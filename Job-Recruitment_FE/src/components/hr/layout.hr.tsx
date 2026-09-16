import React, { useState, useEffect } from 'react';
import {
    AppstoreOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ScheduleOutlined,
    CalendarOutlined,
    PlusCircleOutlined,
    HomeOutlined,
    LogoutOutlined,
    SolutionOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button, Tag } from 'antd';
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { callLogout } from 'config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { withBackendUrl } from '@/config/runtime';
import '@/styles/admin-premium.scss';

const { Content, Sider } = Layout;

const LayoutHR = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const user = useAppSelector(state => state.account.user);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const hrMenuItems: MenuProps['items'] = [
        {
            label: <Link to='/hr'>Tổng quan tuyển dụng</Link>,
            key: '/hr',
            icon: <AppstoreOutlined />
        },
        {
            label: <Link to='/hr/job'>Tin tuyển dụng</Link>,
            key: '/hr/job',
            icon: <ScheduleOutlined />
        },
        {
            label: <Link to='/hr/resume'>Hồ sơ ứng viên (CV)</Link>,
            key: '/hr/resume',
            icon: <SolutionOutlined />
        },
        {
            label: <Link to='/hr/interview'>Lịch phỏng vấn</Link>,
            key: '/hr/interview',
            icon: <CalendarOutlined />
        },
        {
            label: <Link to='/hr/company'>Hồ sơ doanh nghiệp</Link>,
            key: '/hr/company',
            icon: <BankOutlined />
        },
        {
            label: <Link to='/hr/chat'>Tin nhắn & Trao đổi</Link>,
            key: '/hr/chat',
            icon: <MessageOutlined />
        }
    ];

    useEffect(() => {
        // Active key logic
        const path = location.pathname;
        if (path === '/hr' || path === '/hr/') {
            setActiveMenu('/hr');
        } else if (path.startsWith('/hr/job')) {
            setActiveMenu('/hr/job');
        } else if (path.startsWith('/hr/resume')) {
            setActiveMenu('/hr/resume');
        } else if (path.startsWith('/hr/interview')) {
            setActiveMenu('/hr/interview');
        } else if (path.startsWith('/hr/company')) {
            setActiveMenu('/hr/company');
        } else if (path.startsWith('/hr/chat')) {
            setActiveMenu('/hr/chat');
        } else {
            setActiveMenu(path);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/');
        }
    };

    const itemsDropdown: MenuProps['items'] = [
        {
            label: <Link to='/'>Trang chủ việc làm</Link>,
            key: 'home',
            icon: <HomeOutlined />
        },
        {
            label: (
                <span style={{ cursor: 'pointer', color: '#ff4d4f' }} onClick={handleLogout}>
                    Đăng xuất
                </span>
            ),
            key: 'logout',
            icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />
        }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }} className="layout-admin">
            {!isMobile ? (
                <Sider
                    theme="light"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    width={256}
                >
                    <div className="admin-logo">
                        <div className="brand-icon-box hr-icon-box">
                            <BankOutlined />
                        </div>
                        {!collapsed && (
                            <div className="brand-info">
                                <span
                                    className="brand-title"
                                    title={user?.company?.name || 'Doanh Nghiệp'}
                                >
                                    {user?.company?.name || 'Doanh Nghiệp'}
                                </span>
                                <span className="brand-badge hr-badge">
                                    CỔNG NHÀ TUYỂN DỤNG
                                </span>
                            </div>
                        )}
                    </div>

                    {!collapsed && (
                        <div className="menu-section-label">
                            Menu Tuyển Dụng
                        </div>
                    )}

                    <Menu
                        selectedKeys={[activeMenu]}
                        mode="inline"
                        theme="light"
                        items={hrMenuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        style={{ borderRight: 0 }}
                    />

                </Sider>
            ) : (
                <Menu
                    selectedKeys={[activeMenu]}
                    theme="light"
                    items={hrMenuItems}
                    onClick={(e) => setActiveMenu(e.key)}
                    mode="horizontal"
                />
            )}

            <Layout>
                {!isMobile && (
                    <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: 64, background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 40,
                                    height: 40,
                                    color: '#64748b'
                                }}
                            />
                            {user?.company?.name && (
                                <Tag color="blue" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6, fontWeight: 500, margin: 0 }}>
                                    🏢 Doanh nghiệp: <strong>{user.company.name}</strong>
                                </Tag>
                            )}
                        </div>

                        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={() => navigate('/hr/job/upsert')}
                                style={{
                                    background: '#2563eb',
                                    borderRadius: 6,
                                    fontWeight: 600
                                }}
                            >
                                Đăng tin mới
                            </Button>

                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }} className="welcome-text">
                                    <span style={{ fontWeight: 500, color: '#334155' }}>HR {user?.name}</span>
                                    <Avatar src={user?.avatar ? withBackendUrl(`/storage/avatar/${user.avatar}`) : undefined} style={{ backgroundColor: '#2563eb' }}>
                                        {!user?.avatar && (user?.name?.substring(0, 2)?.toUpperCase() || 'HR')}
                                    </Avatar>
                                </Space>
                            </Dropdown>
                        </div>
                    </div>
                )}
                <Content style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutHR;
