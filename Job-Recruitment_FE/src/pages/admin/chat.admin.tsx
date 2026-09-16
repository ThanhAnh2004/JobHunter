import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IConversation, IChatMessage, ICompany } from '@/types/backend';
import { callFetchConversations, callCreateOrGetConversation, callFetchCompany } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ConversationList from '@/components/chat/conversation.list';
import ChatBox from '@/components/chat/chat.box';
import { Spin, Button, Modal, Select, notification, Space, Typography, Avatar } from 'antd';
import { MessageOutlined, PlusOutlined, BankOutlined, ReloadOutlined } from '@ant-design/icons';
import { withBackendUrl } from '@/config/runtime';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '@/styles/chat.scss';

const { Title, Text } = Typography;

const AdminChatPage: React.FC = () => {
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Modal tạo cuộc hội thoại mới với công ty
    const [openNewChatModal, setOpenNewChatModal] = useState<boolean>(false);
    const [companyList, setCompanyList] = useState<ICompany[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState<boolean>(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [creatingChat, setCreatingChat] = useState<boolean>(false);

    const [searchParams] = useSearchParams();
    const companyIdParam = searchParams.get('companyId');
    const conversationIdParam = searchParams.get('conversationId');

    const user = useAppSelector((state) => state.account.user);
    const navigate = useNavigate();
    const stompClientRef = useRef<Client | null>(null);

    const loadConversations = useCallback(async () => {
        try {
            const res = await callFetchConversations();
            if (res?.data) {
                setConversations(res.data);
                return res.data;
            }
        } catch (err) {
            console.error('Lỗi tải danh sách hội thoại Admin:', err);
        }
        return [];
    }, []);

    // Fetch danh sách các công ty để chọn nhắn tin mới
    const loadCompanyOptions = async () => {
        setLoadingCompanies(true);
        try {
            const res = await callFetchCompany('page=1&size=100');
            if (res?.data?.result) {
                setCompanyList(res.data.result);
            }
        } catch (err) {
            console.error('Lỗi tải danh sách công ty:', err);
        } finally {
            setLoadingCompanies(false);
        }
    };

    // Khởi tạo trang: tải danh sách hội thoại và xử lý params nếu có
    useEffect(() => {
        const initChat = async () => {
            setLoading(true);
            const convList = await loadConversations();

            // Nếu có companyId trong param, tự động mở hoặc tạo cuộc hội thoại
            if (companyIdParam && companyIdParam !== 'undefined' && companyIdParam !== 'null' && !isNaN(+companyIdParam)) {
                try {
                    const createRes = await callCreateOrGetConversation({
                        companyId: +companyIdParam,
                    });
                    if (createRes?.data) {
                        const targetConv = createRes.data;
                        setActiveConversation(targetConv);
                        const updatedList = await loadConversations();
                        const found = updatedList.find((c) => c.id === targetConv.id);
                        if (found) setActiveConversation(found);
                    }
                } catch (e) {
                    console.error('Lỗi khi mở cuộc hội thoại với công ty:', e);
                }
            } else if (conversationIdParam && !isNaN(+conversationIdParam)) {
                const found = convList.find((c) => c.id === +conversationIdParam);
                if (found) {
                    setActiveConversation(found);
                }
            } else if (convList.length > 0) {
                setActiveConversation(convList[0]);
            }

            setLoading(false);
        };

        initChat();
    }, [companyIdParam, conversationIdParam, loadConversations]);

    // WebSocket STOMP: Lắng nghe thông báo tin nhắn mới
    useEffect(() => {
        if (!user?.id) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
            onConnect: () => {
                client.subscribe(`/topic/chat/${user.id}`, () => {
                    loadConversations();
                });
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
    }, [user?.id, loadConversations]);

    const handleSelectConversation = (conv: IConversation) => {
        setActiveConversation(conv);
        setConversations((prev) =>
            prev.map((item) => (item.id === conv.id ? { ...item, unreadCount: 0 } : item))
        );
    };

    const handleMessageSent = (msg: IChatMessage) => {
        setConversations((prev) =>
            prev.map((item) =>
                item.id === msg.conversationId
                    ? {
                          ...item,
                          lastMessage: msg.content,
                          lastMessageAt: msg.createdAt,
                      }
                    : item
            )
        );
    };

    const handleCreateNewChat = async () => {
        if (!selectedCompanyId) {
            notification.warning({
                message: 'Chưa chọn doanh nghiệp',
                description: 'Vui lòng chọn công ty bạn muốn nhắn tin trao đổi.',
            });
            return;
        }

        setCreatingChat(true);
        try {
            const res = await callCreateOrGetConversation({
                companyId: selectedCompanyId,
            });
            if (res?.data) {
                const targetConv = res.data;
                const updatedList = await loadConversations();
                const found = updatedList.find((c) => c.id === targetConv.id);
                setActiveConversation(found || targetConv);
                setOpenNewChatModal(false);
                setSelectedCompanyId(null);
                notification.success({
                    message: 'Bắt đầu cuộc trò chuyện',
                    description: `Đã mở hội thoại với công ty ${targetConv.companyName || ''}`,
                });
            }
        } catch (error) {
            console.error('Lỗi khi tạo cuộc trò chuyện với công ty:', error);
            notification.error({
                message: 'Không thể tạo cuộc trò chuyện',
                description: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
            });
        } finally {
            setCreatingChat(false);
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header thanh công cụ Admin Chat */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                marginBottom: 14,
                background: '#ffffff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                    }}>
                        <MessageOutlined style={{ fontSize: 20 }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                            Trung Tâm Tin Nhắn & Trao Đổi
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>
                            Trao đổi và kết nối trực tiếp với đại diện HR của các doanh nghiệp
                        </div>
                    </div>
                </div>

                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            loadCompanyOptions();
                            setOpenNewChatModal(true);
                        }}
                        style={{
                            background: '#10b981',
                            borderColor: '#10b981',
                            borderRadius: 8,
                            fontWeight: 600,
                            height: 38,
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                        }}
                    >
                        Nhắn tin với Công ty
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={loadConversations}
                        style={{ borderRadius: 8, height: 38 }}
                        title="Tải lại danh sách"
                    />
                </Space>
            </div>

            {/* Container Khung Chat */}
            <div className="chat-container" style={{ flex: 1, height: 'auto', minHeight: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 12, padding: 40 }}>
                        <Spin size="large" />
                        <span style={{ color: '#64748b' }}>Đang tải danh sách tin nhắn...</span>
                    </div>
                ) : (
                    <>
                        <ConversationList
                            conversations={conversations}
                            activeConversationId={activeConversation?.id || null}
                            onSelectConversation={handleSelectConversation}
                            isHrView={false}
                        />
                        <ChatBox
                            conversation={activeConversation}
                            isHrView={false}
                            onMessageSent={handleMessageSent}
                        />
                    </>
                )}
            </div>

            {/* Modal Chọn Công ty để Nhắn tin */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <BankOutlined style={{ color: '#10b981', fontSize: 18 }} />
                        <span>Chọn doanh nghiệp để nhắn tin</span>
                    </div>
                }
                open={openNewChatModal}
                onCancel={() => {
                    setOpenNewChatModal(false);
                    setSelectedCompanyId(null);
                }}
                onOk={handleCreateNewChat}
                okText="Bắt đầu hội thoại"
                cancelText="Hủy"
                confirmLoading={creatingChat}
                okButtonProps={{
                    disabled: !selectedCompanyId,
                    style: { background: '#10b981', borderColor: '#10b981' }
                }}
            >
                <div style={{ padding: '16px 0' }}>
                    <div style={{ marginBottom: 12, color: '#475569', fontSize: 14 }}>
                        Tìm kiếm và chọn doanh nghiệp bạn muốn liên hệ:
                    </div>
                    <Select
                        showSearch
                        placeholder="Tìm theo tên công ty..."
                        loading={loadingCompanies}
                        value={selectedCompanyId}
                        onChange={(val) => setSelectedCompanyId(val)}
                        style={{ width: '100%' }}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                        }
                        options={companyList.map((comp) => ({
                            value: +comp.id!,
                            label: comp.name,
                            company: comp
                        }))}
                        optionRender={(option) => {
                            const comp = option.data.company as ICompany;
                            return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                                    <Avatar
                                        src={comp.logo ? withBackendUrl(`/storage/company/${comp.logo}`) : undefined}
                                        icon={<BankOutlined />}
                                        shape="square"
                                        size={28}
                                        style={{ background: '#f1f5f9', color: '#64748b' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{comp.name}</div>
                                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{comp.address || 'Chưa có địa chỉ'}</div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default AdminChatPage;
