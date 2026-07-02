import { BellOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import { Badge, Dropdown, MenuProps, Spin, Button, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchNotifications, callDeleteNotification, callClearAllNotifications } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface IProps {
    onOpenManageAccount: (tabKey: string) => void;
}

const NotificationBell = (props: IProps) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const user = useAppSelector(state => state.account.user);

    useEffect(() => {
        if (user && user.id) {
            fetchNotifications();
            setupWebSocket();
        }
    }, [user]);

    const fetchNotifications = async () => {
        setLoading(true);
        const res = await callFetchNotifications();
        if (res && res.data) {
            setNotifications(res.data);
        }
        setLoading(false);
    };

    const setupWebSocket = () => {
        const client = new Client({
            webSocketFactory: () => new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
            onConnect: () => {
                client.subscribe(`/topic/notifications/${user.id}`, (message) => {
                    const newNotification = { message: message.body, isRead: false, createdAt: new Date().toISOString() };
                    setNotifications((prev) => [newNotification, ...prev]);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    };

    const handleNotificationClick = (notif: any) => {
        if (notif.message.includes("phỏng vấn") || notif.message.includes("interview")) {
            props.onOpenManageAccount("user-interview");
        } else if (notif.message.includes("CV") || notif.message.includes("status")) {
            props.onOpenManageAccount("user-resume");
        } else {
            props.onOpenManageAccount("user-profile");
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        const res = await callDeleteNotification(id);
        if (res) {
            fetchNotifications();
        }
    };

    const handleClearAll = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const res = await callClearAllNotifications();
        if (res) {
            fetchNotifications();
        }
    };

    const items: MenuProps['items'] = notifications.length > 0 ? [
        ...notifications.map((notif, index) => ({
            key: notif.id || index,
            label: (
                <div 
                    onClick={() => handleNotificationClick(notif)}
                    style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        width: 320, 
                        whiteSpace: 'normal', 
                        padding: '6px 0', 
                        borderBottom: index < notifications.length - 1 ? '1px solid #f0f0f0' : 'none', 
                        cursor: 'pointer' 
                    }}
                >
                    <div style={{ flex: 1, paddingRight: 8 }}>
                        <div style={{ fontWeight: notif.isRead ? 'normal' : 'bold', color: '#1e293b', fontSize: '13.5px' }}>
                            {notif.message}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                            {new Date(notif.createdAt).toLocaleString()}
                        </div>
                    </div>
                    <Button 
                        type="text" 
                        danger 
                        size="small" 
                        icon={<DeleteOutlined style={{ fontSize: 14 }} />} 
                        onClick={(e) => handleDelete(e, notif.id)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                </div>
            )
        })),
        {
            key: 'clear-all-divider',
            type: 'divider' as const
        },
        {
            key: 'clear-all',
            label: (
                <div 
                    onClick={handleClearAll}
                    style={{ 
                        textAlign: 'center', 
                        color: '#ef4444', 
                        fontWeight: 600, 
                        padding: '4px 0', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: 6,
                        fontSize: '13px'
                    }}
                >
                    <ClearOutlined /> Xóa tất cả thông báo
                </div>
            )
        }
    ] : [
        {
            key: 'empty',
            label: <div style={{ padding: '8px 16px', textAlign: 'center', color: '#999' }}>Không có thông báo mới</div>
        }
    ];

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <Dropdown menu={{ items, style: { maxHeight: '400px', overflowY: 'auto' } }} trigger={['click']} placement="bottomRight">
            <div style={{ cursor: 'pointer', padding: '0 12px' }}>
                <Badge count={unreadCount} size="small">
                    <BellOutlined style={{ fontSize: 20, color: '#fff' }} />
                </Badge>
            </div>
        </Dropdown>
    );
};

export default NotificationBell;
