import React, { useState, useEffect, useRef } from 'react';
import { IConversation, IChatMessage } from '@/types/backend';
import { callFetchMessages, callSendMessage, callMarkConversationAsRead } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import { Input, Button, Avatar, Spin, Empty, Tooltip } from 'antd';
import { SendOutlined, UserOutlined, BankOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { withBackendUrl } from '@/config/runtime';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface IProps {
    conversation: IConversation | null;
    isHrView?: boolean;
    onMessageSent?: (msg: IChatMessage) => void;
}

const ChatBox: React.FC<IProps> = ({ conversation, isHrView = false, onMessageSent }) => {
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [inputContent, setInputContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const user = useAppSelector((state) => state.account.user);
    const currentUserId = user?.id ? +user.id : 0;

    const messagesAreaRef = useRef<HTMLDivElement>(null);
    const stompClientRef = useRef<Client | null>(null);

    const scrollToBottom = (smooth = true) => {
        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTo({
                top: messagesAreaRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    };

    // Tải tin nhắn khi đổi cuộc hội thoại
    useEffect(() => {
        if (!conversation?.id) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await callFetchMessages(conversation.id);
                if (res?.data) {
                    setMessages(res.data);
                    // Đánh dấu đã đọc
                    callMarkConversationAsRead(conversation.id);
                }
            } catch (err) {
                console.error('Lỗi khi tải tin nhắn:', err);
            } finally {
                setLoading(false);
                setTimeout(() => scrollToBottom(false), 100);
            }
        };

        fetchMessages();
    }, [conversation?.id]);

    // Thiết lập WebSocket STOMP lắng nghe tin nhắn thời gian thực
    useEffect(() => {
        if (!conversation?.id) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
            onConnect: () => {
                client.subscribe(`/topic/conversations/${conversation.id}`, (message) => {
                    try {
                        const newMsg: IChatMessage = JSON.parse(message.body);
                        setMessages((prev) => {
                            // Kiểm tra trùng lặp
                            if (prev.some((m) => m.id === newMsg.id)) return prev;
                            return [...prev, newMsg];
                        });
                        setTimeout(() => scrollToBottom(true), 50);

                        // Nếu tin nhắn gửi từ đối phương thì đánh dấu đã đọc
                        if (newMsg.senderId !== currentUserId) {
                            callMarkConversationAsRead(conversation.id);
                        }
                    } catch (e) {
                        console.error('Lỗi parse tin nhắn STOMP:', e);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
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
    }, [conversation?.id, currentUserId]);

    const handleSendMessage = async () => {
        if (!inputContent.trim() || !conversation?.id || sending) return;

        const textToSend = inputContent.trim();
        setInputContent('');
        setSending(true);

        try {
            const res = await callSendMessage({
                conversationId: conversation.id,
                content: textToSend,
                type: 'TEXT',
            });

            if (res?.data) {
                const sentMsg = res.data;
                // Thêm vào danh sách tin nhắn nếu STOMP chưa bắn về kịp
                setMessages((prev) => {
                    if (prev.some((m) => m.id === sentMsg.id)) return prev;
                    return [...prev, sentMsg];
                });
                setTimeout(() => scrollToBottom(true), 50);

                if (onMessageSent) {
                    onMessageSent(sentMsg);
                }
            }
        } catch (err) {
            console.error('Lỗi gửi tin nhắn:', err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!conversation) {
        return (
            <div className="chat-main" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px' }}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div style={{ maxWidth: 460, margin: '0 auto' }}>
                            <div style={{ color: '#0f172a', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                                Chưa có cuộc hội thoại nào được chọn
                            </div>
                            <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                                {!isHrView ? (
                                    <>Bạn có thể truy cập bất kỳ tin tuyển dụng hoặc trang công ty nào và nhấn nút <strong>"Nhắn tin với NTD"</strong> để bắt đầu trao đổi trực tiếp với nhà tuyển dụng.</>
                                ) : (
                                    <>Chọn một cuộc hội thoại từ danh sách bên trái hoặc vào trang Quản lý hồ sơ để nhắn tin trao đổi với ứng viên.</>
                                )}
                            </div>
                            {!isHrView && (
                                <Button 
                                    type="primary" 
                                    onClick={() => window.location.href = '/job'} 
                                    style={{ borderRadius: 8, height: 38, fontWeight: 600 }}
                                >
                                    🔍 Khám phá việc làm để nhắn tin
                                </Button>
                            )}
                        </div>
                    }
                />
            </div>
        );
    }

    const partnerName = isHrView ? conversation.candidateName : conversation.companyName;
    const partnerSubtitle = isHrView
        ? conversation.candidateEmail
        : conversation.jobName || 'Nhà tuyển dụng';
    const candidateAvatar = conversation.candidateAvatar;
    const companyLogo = conversation.companyLogo;

    return (
        <div className="chat-main">
            {/* Header phòng chat */}
            <div className="chat-header">
                <div className="chat-partner-info">
                    {isHrView ? (
                        candidateAvatar ? (
                            <Avatar
                                src={withBackendUrl(`/storage/avatar/${candidateAvatar}`)}
                                size={44}
                                style={{ border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                            >
                                {partnerName ? partnerName.substring(0, 2).toUpperCase() : 'U'}
                            </Avatar>
                        ) : (
                            <Avatar
                                size={44}
                                style={{ backgroundColor: '#3b82f6', fontWeight: 600, fontSize: 16 }}
                            >
                                {partnerName ? partnerName.substring(0, 2).toUpperCase() : <UserOutlined />}
                            </Avatar>
                        )
                    ) : (
                        companyLogo ? (
                            <Avatar
                                src={withBackendUrl(`/storage/company/${companyLogo}`)}
                                size={44}
                                shape="square"
                                style={{ borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0' }}
                            />
                        ) : (
                            <Avatar
                                size={44}
                                style={{ backgroundColor: '#10b981', borderRadius: 10, fontWeight: 600, fontSize: 16 }}
                            >
                                {partnerName ? partnerName.substring(0, 2).toUpperCase() : <BankOutlined />}
                            </Avatar>
                        )
                    )}
                    <div>
                        <div className="partner-name">{partnerName || 'Chưa cập nhật tên'}</div>
                        <div className="partner-subtitle">
                            {conversation.jobName && (
                                <span style={{ color: '#2563eb', fontWeight: 600 }}>
                                    💼 {conversation.jobName}
                                </span>
                            )}
                            {isHrView && <span>• {partnerSubtitle}</span>}
                        </div>
                    </div>
                </div>

                {isHrView && (
                    <Tooltip title="Xem chi tiết hồ sơ ứng viên">
                        <Button
                            type="text"
                            icon={<InfoCircleOutlined style={{ fontSize: 18, color: '#64748b' }} />}
                            onClick={() => window.open(`/hr/resume`, '_blank')}
                        />
                    </Tooltip>
                )}
            </div>

            {/* Vùng hiển thị tin nhắn */}
            <div className="chat-messages-area" ref={messagesAreaRef}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 8 }}>
                        <Spin size="default" />
                        <span style={{ color: '#94a3b8', fontSize: 13 }}>Đang tải tin nhắn...</span>
                    </div>
                ) : messages.length > 0 ? (
                    messages.map((msg) => {
                        const isMine = msg.senderId === currentUserId;
                        let msgAvatarSrc: string | null = null;
                        if (!isMine) {
                            if (msg.senderAvatar) {
                                msgAvatarSrc = msg.senderAvatar.startsWith('/')
                                    ? withBackendUrl(msg.senderAvatar)
                                    : withBackendUrl(`/storage/avatar/${msg.senderAvatar}`);
                            } else if (isHrView && candidateAvatar) {
                                msgAvatarSrc = withBackendUrl(`/storage/avatar/${candidateAvatar}`);
                            } else if (!isHrView && companyLogo) {
                                msgAvatarSrc = withBackendUrl(`/storage/company/${companyLogo}`);
                            }
                        }

                        return (
                            <div
                                key={msg.id}
                                className={`message-bubble-wrapper ${isMine ? 'mine' : 'theirs'}`}
                            >
                                {!isMine && (
                                    <Avatar
                                        size={34}
                                        src={msgAvatarSrc || undefined}
                                        style={{
                                            backgroundColor: isHrView ? '#3b82f6' : '#10b981',
                                            fontSize: 12,
                                            fontWeight: 600,
                                            flexShrink: 0,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                                        }}
                                    >
                                        {!msgAvatarSrc && (msg.senderName ? msg.senderName.substring(0, 2).toUpperCase() : 'U')}
                                    </Avatar>
                                )}

                                <div className="message-bubble">
                                    <div className="message-text">{msg.content}</div>
                                    <div className="message-time">
                                        {dayjs(msg.createdAt).format('HH:mm')}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: 13 }}>
                        Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên! 👋
                    </div>
                )}
            </div>

            {/* Thanh soạn thảo tin nhắn */}
            <div className="chat-input-area">
                <TextArea
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn... (Nhấn Enter để gửi, Shift+Enter xuống dòng)"
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    disabled={sending}
                />
                <button
                    type="button"
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!inputContent.trim() || sending}
                    title="Gửi tin nhắn"
                >
                    <SendOutlined />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
