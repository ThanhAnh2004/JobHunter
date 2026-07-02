import { Divider, Row, Col } from 'antd';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    FacebookOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    GithubOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: '#0f172a',
            color: '#94a3b8',
            padding: '60px 0 30px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ maxWidth: '1260px', margin: '0 auto', padding: '0 15px' }}>
                <Row gutter={[40, 40]}>
                    {/* Brand Column */}
                    <Col span={24} md={8}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: '#3b82f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)'
                            }}>
                                J
                            </div>
                            <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>
                                JobHunter
                            </span>
                        </div>
                        <p style={{ lineHeight: '1.7', fontSize: '14px', color: '#64748b' }}>
                            Nền tảng kết nối cơ hội việc làm công nghệ thông tin hàng đầu Việt Nam. Giúp các nhà phát triển tài năng tìm kiếm bến đỗ mơ ước và hỗ trợ doanh nghiệp xây dựng đội ngũ công nghệ vững mạnh.
                        </p>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <a href="#" style={{ color: '#64748b', fontSize: '20px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}><FacebookOutlined /></a>
                            <a href="#" style={{ color: '#64748b', fontSize: '20px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}><TwitterOutlined /></a>
                            <a href="#" style={{ color: '#64748b', fontSize: '20px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}><LinkedinOutlined /></a>
                            <a href="#" style={{ color: '#64748b', fontSize: '20px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}><GithubOutlined /></a>
                        </div>
                    </Col>

                    {/* Navigation Column */}
                    <Col span={12} sm={8} md={5}>
                        <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Khám Phá</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li><Link to="/job" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Việc Làm IT</Link></li>
                            <li><Link to="/company" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Nhà Tuyển Dụng</Link></li>
                            <li><Link to="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Về Chúng Tôi</Link></li>
                        </ul>
                    </Col>

                    {/* Support Column */}
                    <Col span={12} sm={8} md={5}>
                        <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Hỗ Trợ</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Điều khoản dịch vụ</a></li>
                            <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Chính sách bảo mật</a></li>
                            <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>Câu hỏi thường gặp</a></li>
                        </ul>
                    </Col>

                    {/* Contact Column */}
                    <Col span={24} sm={8} md={6}>
                        <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Liên Hệ</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px' }}>
                            <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <EnvironmentOutlined style={{ color: '#3b82f6', marginTop: '3px' }} />
                                <span>97 Man Thiện, Thủ Đức, TP.HCM</span>
                            </li>
                            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <PhoneOutlined style={{ color: '#3b82f6' }} />
                                <span>+84 358 988 590</span>
                            </li>
                            <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <MailOutlined style={{ color: '#3b82f6' }} />
                                <span>thanhanh982004@gmail.com</span>
                            </li>
                        </ul>
                    </Col>
                </Row>

                <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '40px 0 20px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '14px', color: '#64748b' }}>
                    <div>
                        &copy; {new Date().getFullYear()} JobHunter. All rights reserved. Designed by Thanh Anh.
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <span>Vietnam</span>
                        <span>English</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;