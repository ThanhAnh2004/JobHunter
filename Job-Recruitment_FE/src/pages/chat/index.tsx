import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IConversation, IChatMessage } from '@/types/backend';
import { callFetchConversations, callCreateOrGetConversation } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ConversationList from '@/components/chat/conversation.list';
import ChatBox from '@/components/chat/chat.box';
import { Spin } from 'antd';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '@/styles/chat.scss';

const ClientChatPage: React.FC = () => {
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [searchParams] = useSearchParams();
    const companyIdParam = searchParams.get('companyId');
    const jobIdParam = searchParams.get('jobId');
    const conversationIdParam = searchParams.get('conversationId');

    const user = useAppSelector((state) => state.account.user);
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
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
            console.error('Lỗi tải danh sách hội thoại ứng viên:', err);
        }
        return [];
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const initChat = async () => {
            setLoading(true);
            const convList = await loadConversations();

            // Nếu ứng viên bấm chat từ trang Job hoặc Company
            if (companyIdParam && companyIdParam !== 'undefined' && companyIdParam !== 'null' && !isNaN(+companyIdParam)) {
                try {
                    const createRes = await callCreateOrGetConversation({
                        companyId: +companyIdParam,
                        jobId: jobIdParam && !isNaN(+jobIdParam) ? +jobIdParam : undefined,
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
    }, [companyIdParam, jobIdParam, conversationIdParam, isAuthenticated]);

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

    return (
        <div style={{ maxWidth: 1280, margin: '24px auto', padding: '0 16px' }}>
            <div className="chat-container">
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
        </div>
    );
};

export default ClientChatPage;
