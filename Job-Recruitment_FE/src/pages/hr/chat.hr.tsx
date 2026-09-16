import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IConversation, IChatMessage } from '@/types/backend';
import { callFetchConversations, callCreateOrGetConversation } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import { useSearchParams } from 'react-router-dom';
import ConversationList from '@/components/chat/conversation.list';
import ChatBox from '@/components/chat/chat.box';
import { Spin } from 'antd';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '@/styles/chat.scss';

const HrChatPage: React.FC = () => {
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<IConversation | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [searchParams] = useSearchParams();
    const candidateIdParam = searchParams.get('candidateId');
    const jobIdParam = searchParams.get('jobId');
    const conversationIdParam = searchParams.get('conversationId');

    const user = useAppSelector((state) => state.account.user);
    const stompClientRef = useRef<Client | null>(null);

    const loadConversations = useCallback(async () => {
        try {
            const res = await callFetchConversations();
            if (res?.data) {
                setConversations(res.data);
                return res.data;
            }
        } catch (err) {
            console.error('Lỗi tải danh sách hội thoại HR:', err);
        }
        return [];
    }, []);

    // Khởi tạo trang: tải danh sách hội thoại và xử lý params nếu có
    useEffect(() => {
        const initChat = async () => {
            setLoading(true);
            const convList = await loadConversations();

            // Nếu có param candidateId, tự động mở hoặc tạo cuộc hội thoại
            if (candidateIdParam && candidateIdParam !== 'undefined' && candidateIdParam !== 'null' && !isNaN(+candidateIdParam)) {
                try {
                    const createRes = await callCreateOrGetConversation({
                        candidateId: +candidateIdParam,
                        jobId: jobIdParam && !isNaN(+jobIdParam) ? +jobIdParam : undefined,
                    });
                    if (createRes?.data) {
                        const targetConv = createRes.data;
                        setActiveConversation(targetConv);
                        // Cập nhật lại danh sách hội thoại
                        const updatedList = await loadConversations();
                        const found = updatedList.find((c) => c.id === targetConv.id);
                        if (found) setActiveConversation(found);
                    }
                } catch (e) {
                    console.error('Lỗi khi mở cuộc hội thoại với candidate:', e);
                }
            } else if (conversationIdParam && !isNaN(+conversationIdParam)) {
                const found = convList.find((c) => c.id === +conversationIdParam);
                if (found) {
                    setActiveConversation(found);
                }
            } else if (convList.length > 0) {
                // Mặc định chọn cuộc hội thoại đầu tiên
                setActiveConversation(convList[0]);
            }

            setLoading(false);
        };

        initChat();
    }, [candidateIdParam, jobIdParam, conversationIdParam]);

    // WebSocket STOMP: Lắng nghe thông báo tin nhắn mới để cập nhật danh sách hội thoại
    useEffect(() => {
        if (!user?.id) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
            onConnect: () => {
                // Kênh tin nhắn cá nhân
                client.subscribe(`/topic/chat/${user.id}`, () => {
                    loadConversations();
                });

                // Kênh tin nhắn của công ty HR
                if (user?.company?.id) {
                    client.subscribe(`/topic/chat/company/${user.company.id}`, () => {
                        loadConversations();
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
    }, [user?.id, user?.company?.id, loadConversations]);

    const handleSelectConversation = (conv: IConversation) => {
        setActiveConversation(conv);
        // Cập nhật unreadCount về 0 trong local state
        setConversations((prev) =>
            prev.map((item) => (item.id === conv.id ? { ...item, unreadCount: 0 } : item))
        );
    };

    const handleMessageSent = (msg: IChatMessage) => {
        // Cập nhật lastMessage và thời gian
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
        <div style={{ padding: '0 0 20px 0' }}>
            <div className="chat-container">
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 12, padding: 40 }}>
                        <Spin size="large" />
                        <span style={{ color: '#64748b' }}>Đang tải giao diện tin nhắn...</span>
                    </div>
                ) : (
                    <>
                        <ConversationList
                            conversations={conversations}
                            activeConversationId={activeConversation?.id || null}
                            onSelectConversation={handleSelectConversation}
                            isHrView={true}
                        />
                        <ChatBox
                            conversation={activeConversation}
                            isHrView={true}
                            onMessageSent={handleMessageSent}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default HrChatPage;
