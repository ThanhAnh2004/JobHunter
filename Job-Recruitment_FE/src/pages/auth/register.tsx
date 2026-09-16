import { Button, Form, Input, Select, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from '@/config/api';
import styles from 'styles/auth.module.scss';
import { IUser } from '@/types/backend';
import { 
    ArrowLeftOutlined, 
    LockOutlined, 
    MailOutlined, 
    UserOutlined, 
    HomeOutlined, 
    RocketOutlined, 
    ThunderboltOutlined,
    SafetyCertificateOutlined 
} from '@ant-design/icons';
import { FaReact } from 'react-icons/fa';

const { Option } = Select;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values: IUser) => {
        const { name, email, password, age, gender, address } = values;
        setIsSubmit(true);
        const res = await callRegister(name, email, password as string, +age, gender, address);
        setIsSubmit(false);
        if (res?.data?.id) {
            message.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } else {
            notification.error({
                message: "Đăng ký không thành công",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
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

            <div className={styles["auth-card"]} style={{ maxWidth: 1000 }}>
                {/* Cột trái: Giới thiệu */}
                <div className={styles["banner-side"]}>
                    <div className={styles["brand-header"]}>
                        <FaReact className={styles["brand-icon"]} />
                        <span className={styles["brand-name"]}>JobHunter</span>
                    </div>

                    <div className={styles["banner-content"]}>
                        <h1 className={styles["hero-title"]}>
                            Bắt đầu hành trình sự nghiệp IT của bạn
                        </h1>
                        <p className={styles["hero-desc"]}>
                            Tạo tài khoản để ứng tuyển công việc mơ ước, theo dõi tiến độ phỏng vấn và nhận gợi ý việc làm phù hợp nhất.
                        </p>

                        <div className={styles["features-list"]}>
                            <div className={styles["feature-item"]}>
                                <div className={styles["feature-icon"]}>
                                    <RocketOutlined />
                                </div>
                                <span className={styles["feature-text"]}>Hồ sơ trực tuyến chuyên nghiệp</span>
                            </div>
                            <div className={styles["feature-item"]}>
                                <div className={styles["feature-icon"]}>
                                    <ThunderboltOutlined />
                                </div>
                                <span className={styles["feature-text"]}>Nhận thông báo việc làm mới qua Email & Web</span>
                            </div>
                            <div className={styles["feature-item"]}>
                                <div className={styles["feature-icon"]}>
                                    <SafetyCertificateOutlined />
                                </div>
                                <span className={styles["feature-text"]}>Bảo mật thông tin & quản trị dữ liệu an toàn</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles["banner-footer"]}>
                        © 2026 JobHunter. All rights reserved.
                    </div>
                </div>

                {/* Cột phải: Form Đăng ký */}
                <div className={styles["form-side"]} style={{ padding: '36px 40px' }}>
                    <div className={styles["mobile-brand"]}>
                        <FaReact className={styles["brand-icon"]} />
                        <span className={styles["brand-name"]}>JobHunter</span>
                    </div>

                    <div className={styles["form-header"]} style={{ marginBottom: 20 }}>
                        <h2 className={styles["form-title"]}>Tạo tài khoản mới 🚀</h2>
                        <p className={styles["form-subtitle"]}>
                            Điền đầy đủ thông tin bên dưới để đăng ký tài khoản
                        </p>
                    </div>

                    <Form<IUser>
                        form={form}
                        name="registerForm"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        size="middle"
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 16px' }}>
                            <Form.Item
                                label="Họ tên"
                                name="name"
                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                            >
                                <Input 
                                    prefix={<UserOutlined style={{ color: '#94a3b8' }} />} 
                                    placeholder="Nguyễn Văn A" 
                                    className={styles["input-field"]} 
                                />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: 'email', message: 'Email không đúng định dạng!' }
                                ]}
                            >
                                <Input 
                                    prefix={<MailOutlined style={{ color: '#94a3b8' }} />} 
                                    placeholder="example@gmail.com" 
                                    className={styles["input-field"]} 
                                />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 16px' }}>
                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined style={{ color: '#94a3b8' }} />} 
                                    placeholder="••••••••" 
                                    className={styles["input-field"]} 
                                />
                            </Form.Item>

                            <Form.Item
                                label="Tuổi"
                                name="age"
                                rules={[{ required: true, message: 'Tuổi không được để trống!' }]}
                            >
                                <Input 
                                    type="number" 
                                    min={16} 
                                    max={100} 
                                    placeholder="22" 
                                    className={styles["input-field"]} 
                                />
                            </Form.Item>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0 16px' }}>
                            <Form.Item
                                name="gender"
                                label="Giới tính"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            >
                                <Select placeholder="Chọn giới tính" allowClear className={styles["input-field"]}>
                                    <Option value="MALE">Nam</Option>
                                    <Option value="FEMALE">Nữ</Option>
                                    <Option value="OTHER">Khác</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                            >
                                <Input 
                                    placeholder="Hà Nội, Việt Nam" 
                                    className={styles["input-field"]} 
                                />
                            </Form.Item>
                        </div>

                        <Form.Item style={{ marginTop: 8, marginBottom: 12 }}>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={isSubmit}
                                block
                                className={styles["submit-btn"]}
                            >
                                Đăng Ký Tài Khoản
                            </Button>
                        </Form.Item>

                        <div className={styles["auth-footer"]}>
                            <span>Đã có tài khoản?</span>
                            <Link to="/login" className={styles["auth-link"]}>
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;