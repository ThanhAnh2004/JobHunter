import React from 'react';
import { Row, Col, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RocketOutlined, UsergroupAddOutlined, CheckOutlined, SafetyCertificateOutlined, CrownOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/redux/hooks';

export const RecruiterBanner: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);

    const isHR = (user?.role?.permissions?.length && user?.role?.name !== 'USER' && user?.role?.name !== 'NORMAL_USER') || user?.role?.name === 'HR' || user?.role?.name === 'ADMIN';

    const handleRecruiterAction = () => {
        if (!isAuthenticated) {
            message.warning('Chức năng này chỉ dành cho Nhà Tuyển Dụng & HR. Vui lòng đăng nhập tài khoản HR để tiếp tục!');
            navigate('/login');
            return;
        }

        if (isHR) {
            navigate('/hr/job');
        } else {
            Modal.info({
                title: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
                        <CrownOutlined style={{ color: '#f59e0b' }} />
                        <span>Dành Riêng Cho Nhà Tuyển Dụng & HR</span>
                    </div>
                ),
                content: (
                    <div style={{ marginTop: 10 }}>
                        <p style={{ margin: '0 0 10px 0', color: '#334155' }}>
                            Tài khoản hiện tại của bạn <strong>({user.name || user.email})</strong> là tài khoản <strong>Ứng viên</strong>.
                        </p>
                        <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: 13 }}>
                            Chức năng <strong>Đăng tin tuyển dụng</strong> và <strong>Quản trị hồ sơ ứng viên</strong> chỉ dành riêng cho các tài khoản Doanh nghiệp / HR có thẩm quyền.
                        </p>
                    </div>
                ),
                okText: 'Tôi đã hiểu',
                okButtonProps: {
                    style: { background: '#2563eb', borderColor: '#2563eb', fontWeight: 600 }
                }
            });
        }
    };

    return (
        <div style={{
            margin: '50px 0',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #2563eb 100%)',
            borderRadius: 20,
            padding: '40px',
            color: '#ffffff',
            boxShadow: '0 20px 30px -10px rgba(37, 99, 235, 0.4)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 250,
                height: 250,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: -80,
                left: '30%',
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                pointerEvents: 'none'
            }} />

            <Row gutter={[24, 24]} align="middle">
                <Col span={24} md={16}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'rgba(255, 255, 255, 0.15)',
                        padding: '6px 14px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 600,
                        marginBottom: 14,
                        backdropFilter: 'blur(4px)'
                    }}>
                        <UsergroupAddOutlined /> DÀNH CHO DOANH NGHIỆP & NHÀ TUYỂN DỤNG
                    </div>

                    <h2 style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', marginBottom: 12, lineHeight: 1.3 }}>
                        Tìm Kiếm & Tuyển Dụng Nhân Tài IT Chất Lượng Cao
                    </h2>

                    <p style={{ fontSize: 15, color: '#e0e7ff', maxWidth: 650, lineHeight: 1.6, marginBottom: 20 }}>
                        Đăng tin tuyển dụng miễn phí, tiếp cận nguồn nhân sự lập trình viên, kỹ sư công nghệ tiềm năng tại Việt Nam. Quản lý hồ sơ và lịch phỏng vấn thông minh, thuận tiện.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 14, color: '#e0e7ff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckOutlined style={{ color: '#86efac', fontWeight: 'bold' }} /> Tiếp cận ứng viên nhanh chóng
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckOutlined style={{ color: '#86efac', fontWeight: 'bold' }} /> Quy trình phỏng vấn chuyên nghiệp
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckOutlined style={{ color: '#86efac', fontWeight: 'bold' }} /> Không gian quản trị HR độc quyền
                        </div>
                    </div>
                </Col>

                <Col span={24} md={8} style={{ textAlign: 'center' }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(12px)',
                        padding: '28px 24px',
                        borderRadius: 16,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                        <RocketOutlined style={{ fontSize: 42, color: '#fbbf24', marginBottom: 12 }} />
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
                            Bắt đầu tuyển dụng ngay
                        </h3>
                        <p style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 18 }}>
                            Tạo tin tuyển dụng và nhận CV ứng viên tiềm năng ngay hôm nay.
                        </p>
                        <Button
                            type="primary"
                            size="large"
                            block
                            style={{
                                background: '#f59e0b',
                                borderColor: '#f59e0b',
                                color: '#0f172a',
                                fontWeight: 700,
                                height: 46,
                                fontSize: 15,
                                borderRadius: 10,
                                boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)'
                            }}
                            onClick={handleRecruiterAction}
                        >
                            {isAuthenticated ? 'Vào Cổng Nhà Tuyển Dụng' : 'Đăng Tin Tuyển Dụng Miễn Phí'}
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RecruiterBanner;
