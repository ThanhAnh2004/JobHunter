import React, { useState, useEffect } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    ApiOutlined,
    UserOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BugOutlined,
    ScheduleOutlined,
    CalendarOutlined,
    HomeOutlined,
    LogoutOutlined,
    SolutionOutlined,
    SafetyCertificateOutlined,
    CrownOutlined,
    SettingOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button, Tag } from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { callLogout } from 'config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { ALL_PERMISSIONS } from '@/config/permissions';
import { withBackendUrl } from '@/config/runtime';
import '@/styles/admin-premium.scss';

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const user = useAppSelector(state => state.account.user);

    const permissions = useAppSelector(state => state.account.user.role.permissions);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isSuperAdmin = user?.email === 'admin@gmail.com' || user?.role?.name === 'SUPER_ADMIN';

    useEffect(() => {
        const ACL_ENABLE = import.meta.env.VITE_ACL_ENABLE;
        const roleName = (user?.role?.name ?? "").toLowerCase();
        const isAdminRole = roleName.includes("admin");

        if (permissions?.length || ACL_ENABLE === 'false' || isAdminRole || isSuperAdmin) {
            const viewCompany = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.method
            );

            const viewUser = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            );

            const viewJob = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.JOBS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.JOBS.GET_PAGINATE.method
            );

            const viewResume = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.method
            );

            const viewRole = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
            );

            const viewPermission = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.method
            );

            const full = [
                {
                    label: <Link to='/admin'>Tổng quan hệ thống</Link>,
                    key: '/admin',
                    icon: <AppstoreOutlined />
                },
                ...(viewCompany || ACL_ENABLE === 'false' || isSuperAdmin ? [{
                    label: <Link to='/admin/company'>Quản lý Công ty</Link>,
                    key: '/admin/company',
                    icon: <BankOutlined />,
                }] : []),

                ...(viewUser || ACL_ENABLE === 'false' || isSuperAdmin ? [{
                    label: <Link to='/admin/user'>Quản lý Người dùng</Link>,
                    key: '/admin/user',
                    icon: <UserOutlined />
                }] : []),
                ...(viewJob || ACL_ENABLE === 'false' || isSuperAdmin ? [{
                    label: <Link to='/admin/job'>Quản lý Việc làm</Link>,
                    key: '/admin/job',
                    icon: <ScheduleOutlined />
                }] : []),

                ...(viewResume || ACL_ENABLE === 'false' || isSuperAdmin ? [{
                    label: <Link to='/admin/resume'>Hồ sơ ứng tuyển (CV)</Link>,
                    key: '/admin/resume',
                    icon: <SolutionOutlined />
                }] : []),
                ...(viewResume || ACL_ENABLE === 'false' || isSuperAdmin ? [{
                    label: <Link to='/admin/interview'>Lịch phỏng vấn</Link>,
                    key: '/admin/interview',
                    icon: <CalendarOutlined />
                }] : []),
                {
                    label: <Link to='/admin/chat'>Tin nhắn & Trao đổi</Link>,
                    key: '/admin/chat',
                    icon: <MessageOutlined />
                },
                ...(viewPermission || ACL_ENABLE === 'false' || isSuperAdmin ? [{
                    label: <Link to='/admin/permission'>Phân quyền API</Link>,
                    key: '/admin/permission',
                    icon: <SafetyCertificateOutlined />
                }] : []),
                ...(viewRole || ACL_ENABLE === 'false' || isSuperAdmin ? [{
                    label: <Link to='/admin/role'>Quản lý Vai trò</Link>,
                    key: '/admin/role',
                    icon: <CrownOutlined />
                }] : []),
                ...(isSuperAdmin ? [{
                    label: <Link to='/admin/settings'>Cài đặt & Chân trang</Link>,
                    key: '/admin/settings',
                    icon: <SettingOutlined />
                }] : []),
            ];

            setMenuItems(full);
        }
    }, [permissions, user?.role?.name, isSuperAdmin]);

    useEffect(() => {
        const path = location.pathname;
        if (path === '/admin' || path === '/admin/') {
            setActiveMenu('/admin');
        } else if (path.startsWith('/admin/company')) {
            setActiveMenu('/admin/company');
        } else if (path.startsWith('/admin/user')) {
            setActiveMenu('/admin/user');
        } else if (path.startsWith('/admin/job')) {
            setActiveMenu('/admin/job');
        } else if (path.startsWith('/admin/resume')) {
            setActiveMenu('/admin/resume');
        } else if (path.startsWith('/admin/interview')) {
            setActiveMenu('/admin/interview');
        } else if (path.startsWith('/admin/chat')) {
            setActiveMenu('/admin/chat');
        } else if (path.startsWith('/admin/permission')) {
            setActiveMenu('/admin/permission');
        } else if (path.startsWith('/admin/role')) {
            setActiveMenu('/admin/role');
        } else if (path.startsWith('/admin/settings')) {
            setActiveMenu('/admin/settings');
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
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
            icon: <HomeOutlined />
        },
        {
            label: <Link to={'/hr'}>Cổng HR Tuyển dụng</Link>,
            key: 'hr',
            icon: <BankOutlined />
        },
        {
            label: <span style={{ cursor: 'pointer', color: '#ff4d4f' }} onClick={handleLogout}>Đăng xuất</span>,
            key: 'logout',
            icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />
        },
    ];

    return (
        <Layout
            style={{ minHeight: '100vh' }}
            className="layout-admin admin-theme"
        >
            {!isMobile ?
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    width={256}
                >
                    <div className="admin-logo">
                        <div className="brand-icon-box admin-icon-box">
                            <BugOutlined />
                        </div>
                        {!collapsed && (
                            <div className="brand-info">
                                <span className="brand-title">
                                    JOBHUNTER
                                </span>
                                <span className="brand-badge admin-badge">
                                    HỆ THỐNG QUẢN TRỊ ADMIN
                                </span>
                            </div>
                        )}
                    </div>

                    {!collapsed && (
                        <div className="menu-section-label">
                            Quản Trị Hệ Thống
                        </div>
                    )}

                    <Menu
                        selectedKeys={[activeMenu]}
                        mode="inline"
                        theme="light"
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        style={{ borderRight: 0 }}
                    />

                    {!collapsed && (
                        <div className="sider-footer-card">
                            <div className="footer-card-title">
                                <SafetyCertificateOutlined style={{ color: '#dc2626' }} />
                                <span>Hệ Thống Quản Trị</span>
                            </div>
                            <div className="footer-card-desc" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 0 }}>
                                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
                                <span>Trạng thái: Hoạt động tốt</span>
                            </div>
                        </div>
                    )}
                </Sider>
                :
                <Menu
                    selectedKeys={[activeMenu]}
                    theme="light"
                    items={menuItems}
                    onClick={(e) => setActiveMenu(e.key)}
                    mode="horizontal"
                />
            }

            <Layout>
                {!isMobile &&
                    <div className='admin-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: 64, background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
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
                            <Tag color="red" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 6, fontWeight: 600, margin: 0 }}>
                                🛡️ Admin Root Panel
                            </Tag>
                        </div>

                        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: "pointer" }} className="welcome-text">
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>Admin {user?.name}</span>
                                    <Avatar src={user?.avatar ? withBackendUrl(`/storage/avatar/${user.avatar}`) : undefined} style={{ backgroundColor: '#dc2626' }}>
                                        {!user?.avatar && (user?.name?.substring(0, 2)?.toUpperCase() || 'AD')}
                                    </Avatar>
                                </Space>
                            </Dropdown>
                        </div>
                    </div>
                }
                <Content style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;