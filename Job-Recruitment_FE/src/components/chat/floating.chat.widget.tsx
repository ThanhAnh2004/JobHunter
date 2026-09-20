import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IConversation, IChatMessage } from '@/types/backend';
import { callFetchConversations, callFetchChatBadge } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Tooltip, Avatar, Input, Empty, Spin } from 'antd';
import {
    MessageFilled,
    CloseOutlined,
    MinusOutlined,
    ArrowLeftOutlined,
    BankOutlined,
    UserOutlined,
    SearchOutlined,
    ExportOutlined
} from '@ant-design/icons';
import { withBackendUrl, DEFAULT_COMPANY_LOGO, getCompanyLogoUrl } from '@/config/runtime';
import { formatRelativeTime } from '@/config/utils';
import ChatBox from './chat.box';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const FloatingChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<IConversation | null>(null);
    const [unreadTotal, setUnreadTotal] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const user = useAppSelector((state) => state.account.user);
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const location = useLocation();
    const navigate = useNavigate();
    const stompClientRef = useRef<Client | null>(null);

    const roleName = (user?.role?.name ?? '').toUpperCase();
    const isSuperAdmin = user?.email === 'admin@gmail.com' || roleName === 'SUPER_ADMIN' || roleName.includes('ADMIN');
    const isCandidate = !isSuperAdmin && (roleName === 'USER' || roleName === 'NORMAL_USER' || roleName === 'CANDIDATE');
    const isHR = !isSuperAdmin && !isCandidate && (roleName === 'HR' || roleName.includes('HR') || (Boolean(user?.company?.id) && Boolean(user?.role?.permissions?.length)));

    // Ẩn popup nổi nếu đang ở chính màn hình chat toàn trang
    const shouldHide =
        !isAuthenticated ||
        location.pathname === '/chat' ||
        location.pathname === '/hr/chat' ||
        location.pathname === '/admin/chat';

    const loadBadgeAndConversations = useCallback(async () => {
        try {
            const badgeRes = await callFetchChatBadge();
            if (badgeRes?.data) {
                setUnreadTotal(badgeRes.data.unreadConversations || 0);
            }
            const convRes = await callFetchConversations();
            if (convRes?.data) {
                setConversations(convRes.data);
            }
        } catch (e) {
            // im lặng khi lỗi mạng
        }
    }, []);

    useEffect(() => {
        if (!shouldHide && user?.id) {
            loadBadgeAndConversations();
        }
    }, [shouldHide, user?.id, loadBadgeAndConversations]);

    // WebSocket STOMP: Lắng nghe thông báo tin nhắn mới toàn cục
    useEffect(() => {
        if (shouldHide || !user?.id) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
            onConnect: () => {
                // Kênh cá nhân
                client.subscribe(`/topic/chat/${user.id}`, () => {
                    loadBadgeAndConversations();
                });

                // Kênh công ty dành cho HR
                if (user?.company?.id) {
                    client.subscribe(`/topic/chat/company/${user.company.id}`, () => {
                        loadBadgeAndConversations();
                    });
                }
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [shouldHide, user?.id, user?.company?.id, loadBadgeAndConversations]);

    if (shouldHide) return null;

    const handleOpenWidget = () => {
        setIsOpen(true);
        loadBadgeAndConversations();
    };

    const handleSelectConversation = (conv: IConversation) => {
        setSelectedConv(conv);
        // Reset unread trong local state
        setConversations((prev) =>
            prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
        );
    };

    const handleOpenFullScreen = () => {
        setIsOpen(false);
        const chatBase = isSuperAdmin ? '/admin/chat' : isHR ? '/hr/chat' : '/chat';
        if (selectedConv) {
            navigate(`${chatBase}?conversationId=${selectedConv.id}`);
        } else {
            navigate(chatBase);
        }
    };

    const filteredConversations = conversations.filter((c) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        const targetName = isHR ? (c.candidateName || '') : (c.companyName || '');
        const jobTitle = c.jobName || '';
        return targetName.toLowerCase().includes(query) || jobTitle.toLowerCase().includes(query);
    });

    return (
        <div className="floating-chat-widget">
            {!isOpen ? (
                <Tooltip title={isHR ? "Tin nhắn với Ứng viên" : "Nhắn tin với Nhà tuyển dụng"} placement="left">
                    <Badge count={unreadTotal} overflowCount={99} offset={[-4, 4]}>
                        <div className="chat-fab-button" onClick={handleOpenWidget}>
                            <MessageFilled />
                        </div>
                    </Badge>
                </Tooltip>
            ) : (
                <div className="floating-chat-window">
                    {/* Header phong cách Facebook Messenger */}
                    <div className="floating-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                            {selectedConv ? (
                                <>
                                    <ArrowLeftOutlined
                                        style={{ cursor: 'pointer', fontSize: 16 }}
                                        onClick={() => setSelectedConv(null)}
                                        title="Quay lại danh sách chat"
                                    />
                                    <div style={{ position: 'relative', flexShrink: 0 }}>
                                        {isHR ? (
                                            selectedConv.candidateAvatar ? (
                                                <Avatar
                                                    src={withBackendUrl(`/storage/avatar/${selectedConv.candidateAvatar}`)}
                                                    size={34}
                                                    style={{ border: '1px solid #e2e8f0' }}
                                                >
                                                    {selectedConv.candidateName ? selectedConv.candidateName.substring(0, 2).toUpperCase() : 'U'}
                                                </Avatar>
                                            ) : (
                                                <Avatar size={34} style={{ backgroundColor: '#3b82f6', fontWeight: 600 }}>
                                                    {selectedConv.candidateName ? selectedConv.candidateName.substring(0, 2).toUpperCase() : <UserOutlined />}
                                                </Avatar>
                                            )
                                        ) : (
                                            <Avatar
                                                src={getCompanyLogoUrl(selectedConv.companyLogo)}
                                                size={34}
                                                shape="square"
                                                onError={() => false}
                                                style={{ borderRadius: 6, background: '#fff', border: '1px solid #e2e8f0' }}
                                            >
                                                {selectedConv.companyName ? selectedConv.companyName.substring(0, 2).toUpperCase() : <BankOutlined />}
                                            </Avatar>
                                        )}
                                        <span className="online-dot" style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#22c55e', border: '1.5px solid #fff' }}></span>
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {isHR ? selectedConv.candidateName : selectedConv.companyName}
                                        </div>
                                        <div style={{ fontSize: 11, opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {selectedConv.jobName ? `💼 ${selectedConv.jobName}` : (isHR ? selectedConv.candidateEmail : 'Trực tuyến')}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <MessageFilled style={{ fontSize: 18 }} />
                                    <span style={{ fontSize: 15, fontWeight: 700 }}>
                                        {isHR ? 'Tin nhắn Ứng viên' : 'Đoạn chat Tuyển dụng'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="header-actions">
                            <Tooltip title="Mở trang đầy đủ">
                                <ExportOutlined className="action-icon" onClick={handleOpenFullScreen} />
                            </Tooltip>
                            <Tooltip title="Thu nhỏ">
                                <MinusOutlined className="action-icon" onClick={() => setIsOpen(false)} />
                            </Tooltip>
                            <Tooltip title="Đóng">
                                <CloseOutlined className="action-icon" onClick={() => setIsOpen(false)} />
                            </Tooltip>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="floating-body">
                        {selectedConv ? (
                            <ChatBox
                                conversation={selectedConv}
                                isHrView={isHR}
                                onMessageSent={(msg) => {
                                    setConversations((prev) =>
                                        prev.map((c) =>
                                            c.id === msg.conversationId
                                                ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt }
                                                : c
                                        )
                                    );
                                }}
                            />
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                {/* Thanh tìm kiếm */}
                                <div style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>
                                    <Input
                                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                                        placeholder={isHR ? "Tìm kiếm ứng viên, công việc..." : "Tìm kiếm nhà tuyển dụng..."}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        allowClear
                                        style={{ borderRadius: 20, background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                    />
                                </div>

                                {/* Danh sách hội thoại */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
                                    {filteredConversations.length > 0 ? (
                                        filteredConversations.map((conv) => {
                                            const partnerName = isHR ? conv.candidateName : conv.companyName;
                                            const candidateAvatar = conv.candidateAvatar;
                                            const companyLogo = conv.companyLogo;

                                            return (
                                                <div
                                                    key={conv.id}
                                                    className="conversation-item"
                                                    onClick={() => handleSelectConversation(conv)}
                                                    style={{ padding: '10px 12px', marginBottom: 6 }}
                                                >
                                                    <div className="conv-avatar-box">
                                                        {isHR ? (
                                                            candidateAvatar ? (
                                                                <Avatar
                                                                    src={withBackendUrl(`/storage/avatar/${candidateAvatar}`)}
                                                                    size={42}
                                                                    style={{ border: '1px solid #e2e8f0' }}
                                                                >
                                                                    {partnerName ? partnerName.substring(0, 2).toUpperCase() : 'U'}
                                                                </Avatar>
                                                            ) : (
                                                                <Avatar size={42} style={{ backgroundColor: '#3b82f6', fontWeight: 600 }}>
                                                                    {partnerName ? partnerName.substring(0, 2).toUpperCase() : <UserOutlined />}
                                                                </Avatar>
                                                            )
                                                        ) : (
                                                            <Avatar
                                                                src={getCompanyLogoUrl(companyLogo)}
                                                                size={42}
                                                                shape="square"
                                                                onError={() => false}
                                                                style={{ borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0' }}
                                                            >
                                                                {partnerName ? partnerName.substring(0, 2).toUpperCase() : <BankOutlined />}
                                                            </Avatar>
                                                        )}
                                                    </div>

                                                    <div className="conv-info">
                                                        <div className="conv-header">
                                                            <span className="conv-name" style={{ fontSize: 13.5 }}>
                                                                {partnerName || 'Chưa cập nhật tên'}
                                                            </span>
                                                            <span className="conv-time">
                                                                {conv.lastMessageAt ? formatRelativeTime(conv.lastMessageAt) : ''}
                                                            </span>
                                                        </div>

                                                        <div className="conv-preview">
                                                            <span className="last-message" style={{ fontSize: 12.5 }}>
                                                                {conv.lastMessage || 'Bắt đầu cuộc trò chuyện...'}
                                                            </span>
                                                            {conv.unreadCount > 0 && (
                                                                <span className="unread-badge">{conv.unreadCount}</span>
                                                            )}
                                                        </div>

                                                        {conv.jobName && (
                                                            <span className="conv-job-tag" style={{ fontSize: 10.5 }}>
                                                                💼 {conv.jobName}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={searchTerm ? "Không tìm thấy cuộc trò chuyện phù hợp" : "Chưa có cuộc hội thoại nào"}
                                            style={{ marginTop: 60 }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatingChatWidget;
