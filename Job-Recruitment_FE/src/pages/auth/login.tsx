import { Button, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from '@/config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';
import { 
    ArrowLeftOutlined, 
    LockOutlined, 
    MailOutlined, 
    SafetyCertificateOutlined, 
    RocketOutlined 
} from '@ant-design/icons';
import { FaReact } from 'react-icons/fa';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");

    const getRedirectUrl = (userData?: any) => {
        const roleName = (userData?.role?.name ?? "").toUpperCase();
        const email = userData?.email ?? "";
        const isSuperAdmin = email === 'admin@gmail.com' || roleName === 'SUPER_ADMIN' || roleName.includes('ADMIN');
        if (isSuperAdmin) return '/admin';

        const isHR = roleName === 'HR' || roleName.includes('HR');
        if (isHR) return '/hr';

        // Mặc định tất cả tài khoản ứng viên / người dùng bình thường đều về trang chủ '/'
        return '/';
    };

    useEffect(() => {
        // Đã login => tự động chuyển hướng
        if (isAuthenticated) {
            window.location.href = getRedirectUrl(user);
        }
    }, [isAuthenticated, user]);

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user));
            message.success('Đăng nhập tài khoản thành công!');

            const roleName = (res.data.user?.role?.name ?? "").toUpperCase();
            const isSuperAdmin = res.data.user?.email === 'admin@gmail.com' || roleName === 'SUPER_ADMIN' || roleName.includes('ADMIN');
            const isHR = roleName === 'HR' || roleName.includes('HR');

            if (callback && callback !== '/login') {
                const isPrivilegedRoute = callback.startsWith('/admin') || callback.startsWith('/hr');
                if (isPrivilegedRoute) {
                    if (isSuperAdmin) {
                        window.location.href = callback.startsWith('/admin') ? callback : '/admin';
                        return;
                    }
                    if (isHR) {
                        window.location.href = callback.startsWith('/hr') ? callback : '/hr';
                        return;
                    }
                    // Tài khoản thường không được truy cập /admin hoặc /hr -> chuyển hướng về trang chủ
                    window.location.href = '/';
                    return;
                }
                window.location.href = callback;
                return;
            }

            // Tự động chuyển hướng đúng theo vai trò
            window.location.href = getRedirectUrl(res.data.user);
        } else {
            let errorMsg = res?.message && Array.isArray(res.message) ? res.message[0] : res?.message;
            if (errorMsg === "Bad credentials" || errorMsg === "Bad credentials." || errorMsg === "User not found") {
                errorMsg = "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!";
            }
            notification.error({
                message: "Đăng nhập không thành công",
                description: errorMsg || "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!",
                duration: 5
            });
        }
    };

    return (
        <div className={styles["auth-container"]}>
            {/* Nút quay về trang chủ */}
            <Link to="/" className={styles["back-home-button"]}>
                <ArrowLeftOutlined />
                <span>Về trang chủ</span>
            </Link>

            <div className={styles["auth-card"]}>
                {/* Cột trái: Giới thiệu thương hiệu & tính năng */}
                <div className={styles["banner-side"]}>
                    <div className={styles["brand-header"]}>
                        <FaReact className={styles["brand-icon"]} />
                        <span className={styles["brand-name"]}>JobHunter</span>
                    </div>

                    <div className={styles["banner-content"]}>
                        <h1 className={styles["hero-title"]}>
                            Khám phá cơ hội việc làm IT hàng đầu
                        </h1>
                        <p className={styles["hero-desc"]}>
                            Nền tảng tuyển dụng thông minh tích hợp AI CV Matching và thông báo realtime dành riêng cho Developer.
                        </p>

                        <div className={styles["features-list"]}>
                            <div className={styles["feature-item"]}>
                                <div className={styles["feature-icon"]}>
                                    <RocketOutlined />
                                </div>
                                <span className={styles["feature-text"]}>Tìm kiếm việc làm IT nhanh chóng & chính xác</span>
                            </div>
                            <div className={styles["feature-item"]}>
                                <div className={styles["feature-icon"]}>
                                    <SafetyCertificateOutlined />
                                </div>
                                <span className={styles["feature-text"]}>Kết nối trực tiếp doanh nghiệp công nghệ uy tín</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles["banner-footer"]}>
                        © 2026 JobHunter. All rights reserved.
                    </div>
                </div>

                {/* Cột phải: Form Đăng nhập */}
                <div className={styles["form-side"]}>
                    <div className={styles["mobile-brand"]}>
                        <FaReact className={styles["brand-icon"]} />
                        <span className={styles["brand-name"]}>JobHunter</span>
                    </div>

                    <div className={styles["form-header"]}>
                        <h2 className={styles["form-title"]}>Chào mừng trở lại! 👋</h2>
                        <p className={styles["form-subtitle"]}>
                            Nhập thông tin đăng nhập để tiếp tục truy cập hệ thống
                        </p>
                    </div>

                    <Form
                        form={form}
                        name="loginForm"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        size="large"
                    >
                        <Form.Item
                            label="Email"
                            name="username"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không đúng định dạng!' }
                            ]}
                        >
                            <Input 
                                prefix={<MailOutlined style={{ color: '#94a3b8' }} />} 
                                placeholder="name@example.com"
                                className={styles["input-field"]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined style={{ color: '#94a3b8' }} />} 
                                placeholder="••••••••"
                                className={styles["input-field"]}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 12 }}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={isSubmit}
                                block
                                className={styles["submit-btn"]}
                            >
                                Đăng Nhập
                            </Button>
                        </Form.Item>

                        <div className={styles["auth-footer"]}>
                            <span>Chưa có tài khoản?</span>
                            <Link to="/register" className={styles["auth-link"]}>
                                Đăng ký ngay
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;