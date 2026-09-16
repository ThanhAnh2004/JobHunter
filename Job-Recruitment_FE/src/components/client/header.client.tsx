import { useState, useEffect } from 'react';
import { BankOutlined, CodeOutlined, ContactsOutlined, FireOutlined, LogoutOutlined, MenuFoldOutlined, RiseOutlined, TwitterOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from 'antd';
import { Menu, ConfigProvider } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { FaReact } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { withBackendUrl } from '@/config/runtime';
import ManageAccount from './modal/manage.account';
import NotificationBell from './notification.bell';
import ChatHeaderIcon from './chat.icon';
import { MessageOutlined } from '@ant-design/icons';

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const [current, setCurrent] = useState('home');
    const location = useLocation();

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);
    const [manageAccountActiveTab, setManageAccountActiveTab] = useState<string>("user-profile");

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            icon: <TwitterOutlined />,
        },
        {
            label: <Link to={'/job'}>Việc Làm IT</Link>,
            key: '/job',
            icon: <CodeOutlined />,
        },
        {
            label: <Link to={'/company'}>Top Công ty IT</Link>,
            key: '/company',
            icon: <RiseOutlined />,
        }
    ];



    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const roleName = (user?.role?.name ?? "").toUpperCase();
    const isSuperAdmin = user?.email === 'admin@gmail.com' || roleName === 'SUPER_ADMIN' || roleName.includes('ADMIN');
    const isCandidate = roleName === 'USER' || roleName === 'NORMAL_USER' || roleName === 'CANDIDATE';
    const isHR = !isCandidate && !isSuperAdmin && (roleName === 'HR' || roleName.includes('HR') || (Boolean(user?.company?.id) && Boolean(user?.role?.permissions?.length)));

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    setManageAccountActiveTab("user-profile");
                    setOpenManageAccount(true);
                }}
            >Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        {
            label: <Link to={isSuperAdmin ? "/admin/chat" : isHR ? "/hr/chat" : "/chat"}>Tin nhắn & Trao đổi</Link>,
            key: 'chat',
            icon: <MessageOutlined style={{ color: '#2563eb' }} />
        },
        ...(isSuperAdmin ? [{
            label: <Link to={"/admin"}>Trang Quản Trị Hệ Thống</Link>,
            key: 'admin',
            icon: <FireOutlined style={{ color: '#dc2626' }} />
        }] : []),
        ...(isHR ? [{
            label: <Link to={"/hr"}>Cổng Nhà Tuyển Dụng (HR)</Link>,
            key: 'hr',
            icon: <BankOutlined style={{ color: '#2563eb' }} />
        }] : []),

        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobile ?
                        <div style={{ display: "flex", gap: 30 }}>
                            <div className={styles['brand']} >
                                <FaReact onClick={() => navigate('/')} title='Hỏi Dân IT' />
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#fff',
                                            colorBgContainer: '#222831',
                                            colorText: '#a7a7a7',
                                        },
                                    }}
                                >

                                    <Menu
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                        disabledOverflow={true}
                                        style={{ minWidth: 420, borderBottom: 'none', background: 'transparent' }}
                                    />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ?
                                        <Link to={'/login'}>Đăng Nhập</Link>
                                        :
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <ChatHeaderIcon />
                                            <NotificationBell onOpenManageAccount={(tabKey: string) => {
                                                setManageAccountActiveTab(tabKey);
                                                setOpenManageAccount(true);
                                            }} />
                                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                                <Space style={{ cursor: "pointer" }}>
                                                    <span>Welcome {user?.name}</span>
                                                    <Avatar src={user?.avatar ? withBackendUrl(`/storage/avatar/${user.avatar}`) : undefined} style={{ backgroundColor: '#3b82f6' }}>
                                                        {!user?.avatar && (user?.name?.substring(0, 2)?.toUpperCase() || 'US')}
                                                    </Avatar>
                                                </Space>
                                            </Dropdown>
                                        </div>
                                    }

                                </div>

                            </div>
                        </div>
                        :
                        <div className={styles['header-mobile']}>
                            <span>Your APP</span>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    }
                </div>
            </div>
            <Drawer title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
                defaultKey={manageAccountActiveTab}
            />
        </>
    )
};

export default Header;