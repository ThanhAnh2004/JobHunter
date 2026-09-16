import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Badge, Tooltip } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { callFetchChatBadge } from '@/config/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatHeaderIcon: React.FC = () => {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const user = useAppSelector((state) => state.account.user);
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const navigate = useNavigate();
    const location = useLocation();
    const stompClientRef = useRef<Client | null>(null);

    const loadBadge = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await callFetchChatBadge();
            if (res?.data) {
                setUnreadCount(res.data.unreadConversations || 0);
            }
        } catch (e) {
            // im lặng nếu chưa tải được
        }
    }, [isAuthenticated]);

    useEffect(() => {
        loadBadge();
    }, [loadBadge, location.pathname]);

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
            onConnect: () => {
                client.subscribe(`/topic/chat/${user.id}`, () => {
                    loadBadge();
                });
                if (user?.company?.id) {
                    client.subscribe(`/topic/chat/company/${user.company.id}`, () => {
                        loadBadge();
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
    }, [isAuthenticated, user?.id, user?.company?.id, loadBadge]);

    if (!isAuthenticated) return null;

    const handleClick = () => {
        const roleName = (user?.role?.name ?? '').toUpperCase();
        const isSuperAdmin = user?.email === 'admin@gmail.com' || roleName === 'SUPER_ADMIN' || roleName.includes('ADMIN');
        const isCandidate = !isSuperAdmin && (roleName === 'USER' || roleName === 'NORMAL_USER' || roleName === 'CANDIDATE');
        const isHR = !isSuperAdmin && !isCandidate && (roleName === 'HR' || roleName.includes('HR') || (Boolean(user?.company?.id) && Boolean(user?.role?.permissions?.length)));
        if (isSuperAdmin) {
            navigate('/admin/chat');
        } else if (isHR) {
            navigate('/hr/chat');
        } else {
            navigate('/chat');
        }
    };

    return (
        <Tooltip title="Tin nhắn & Trao đổi">
            <div
                onClick={handleClick}
                style={{
                    cursor: 'pointer',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Badge count={unreadCount} size="small">
                    <MessageOutlined style={{ fontSize: 20, color: '#fff' }} />
                </Badge>
            </div>
        </Tooltip>
    );
};

export default ChatHeaderIcon;
