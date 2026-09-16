import { Card, Col, Row, Statistic, Progress, Spin, Button, Tag, Space } from "antd";
import CountUp from 'react-countup';
import { useState, useEffect } from "react";
import { callFetchDashboardStats } from "@/config/api";
import { IDashboardStats } from "@/types/backend";
import { 
    ScheduleOutlined, 
    ExceptionOutlined, 
    PlusOutlined, 
    CheckCircleOutlined, 
    ClockCircleOutlined, 
    CloseCircleOutlined,
    CalendarOutlined,
    BankOutlined,
    RightOutlined,
    RocketOutlined
} from "@ant-design/icons";
import { useAppSelector } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";

const HrDashboardPage = () => {
    const [stats, setStats] = useState<IDashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const currentUser = useAppSelector(state => state.account.user);
    const companyName = currentUser?.company?.name || 'Doanh Nghiệp';

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const res = await callFetchDashboardStats();
            if (res && res.data) {
                setStats(res.data);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const formatter = (value: number | string) => {
        return (
            <CountUp end={Number(value)} separator="," />
        );
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px', gap: '12px' }}>
                <Spin size="large" />
                <span style={{ color: '#64748b', fontSize: '14px' }}>Đang tải dữ liệu tuyển dụng...</span>
            </div>
        );
    }

    const totalCV = stats?.totalResumes ?? 0;
    const getPercent = (count: number) => {
        if (totalCV === 0) return 0;
        return Math.round((count / totalCV) * 100);
    };

    return (
        <div style={{ padding: '4px' }}>
            {/* Banner chào mừng HR */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                borderRadius: '16px',
                padding: '24px 32px',
                color: '#fff',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)'
            }}>
                <div>
                    <Tag color="#3b82f6" style={{ fontWeight: 600, borderRadius: 12, padding: '2px 10px', marginBottom: 8, border: 'none' }}>
                        CỔNG TUYỂN DỤNG DOANH NGHIỆP
                    </Tag>
                    <h2 style={{ margin: 0, color: '#fff', fontSize: 24, fontWeight: 700 }}>
                        {companyName}
                    </h2>
                    <p style={{ margin: '6px 0 0 0', color: '#bfdbfe', fontSize: 14 }}>
                        Theo dõi tiến độ tuyển dụng, sàng lọc hồ sơ và quản lý lịch phỏng vấn ứng viên công nghệ
                    </p>
                </div>
                <Space>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        size="large"
                        onClick={() => navigate('/hr/job/upsert')}
                        style={{ background: '#f59e0b', borderColor: '#f59e0b', color: '#0f172a', fontWeight: 700, borderRadius: 8 }}
                    >
                        Tạo Tin Tuyển Dụng
                    </Button>
                </Space>
            </div>

            {/* Thống kê chính */}
            <Row gutter={[20, 20]}>
                <Col span={24} sm={12} md={6}>
                    <Card className="premium-card" bordered={false} hoverable onClick={() => navigate('/hr/job')} style={{ cursor: 'pointer' }}>
                        <div className="stat-card-content">
                            <div className="stat-details">
                                <div className="stat-title">Tin tuyển dụng</div>
                                <div className="stat-number">
                                    <CountUp end={stats?.totalJobs ?? 0} separator="," />
                                </div>
                            </div>
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' }}>
                                <ScheduleOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={24} sm={12} md={6}>
                    <Card className="premium-card" bordered={false} hoverable onClick={() => navigate('/hr/resume')} style={{ cursor: 'pointer' }}>
                        <div className="stat-card-content">
                            <div className="stat-details">
                                <div className="stat-title">Hồ sơ ứng tuyển (CV)</div>
                                <div className="stat-number">
                                    <CountUp end={stats?.totalResumes ?? 0} separator="," />
                                </div>
                            </div>
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                                <ExceptionOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={24} sm={12} md={6}>
                    <Card className="premium-card" bordered={false} hoverable onClick={() => navigate('/hr/interview')} style={{ cursor: 'pointer' }}>
                        <div className="stat-card-content">
                            <div className="stat-details">
                                <div className="stat-title">Lịch phỏng vấn</div>
                                <div className="stat-number">
                                    <CountUp end={stats?.countApprovedResumes ?? 0} separator="," />
                                </div>
                            </div>
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                                <CalendarOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={24} sm={12} md={6}>
                    <Card className="premium-card" bordered={false} hoverable onClick={() => navigate('/hr/company')} style={{ cursor: 'pointer' }}>
                        <div className="stat-card-content">
                            <div className="stat-details">
                                <div className="stat-title">Hồ sơ doanh nghiệp</div>
                                <div className="stat-number" style={{ fontSize: '18px', lineHeight: '36px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    Đã xác thực
                                </div>
                            </div>
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(147, 51, 234, 0.12)', color: '#9333ea' }}>
                                <BankOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Phân tích trạng thái CV & Quick Actions */}
            <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
                <Col span={24} lg={16}>
                    <Card title="Phân tích phễu ứng tuyển CV" className="premium-card" bordered={false}>
                        <Row gutter={[30, 20]} align="middle">
                            <Col span={24} sm={10}>
                                <div style={{ textAlign: 'center', padding: '24px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <Statistic 
                                        title={<span style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Tổng CV tiếp nhận</span>}
                                        value={totalCV} 
                                        formatter={formatter}
                                        valueStyle={{ fontSize: '38px', fontWeight: 800, color: '#0f172a' }}
                                    />
                                    <div style={{ marginTop: '8px', color: '#16a34a', fontSize: '13px', fontWeight: 500 }}>
                                        ✓ Đang đồng bộ thời gian thực
                                    </div>
                                </div>
                            </Col>
                            <Col span={24} sm={14}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#334155', fontSize: 13 }}>
                                            <span><ClockCircleOutlined style={{ color: '#faad14', marginRight: 4 }} /> Chờ duyệt (PENDING): <strong>{stats?.countPendingResumes ?? 0} CV</strong></span>
                                            <span style={{ fontWeight: 600 }}>{getPercent(stats?.countPendingResumes ?? 0)}%</span>
                                        </div>
                                        <Progress percent={getPercent(stats?.countPendingResumes ?? 0)} strokeColor="#faad14" showInfo={false} size={[-1, 8]} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#334155', fontSize: 13 }}>
                                            <span><RocketOutlined style={{ color: '#1890ff', marginRight: 4 }} /> Đang đánh giá (REVIEWING): <strong>{stats?.countReviewingResumes ?? 0} CV</strong></span>
                                            <span style={{ fontWeight: 600 }}>{getPercent(stats?.countReviewingResumes ?? 0)}%</span>
                                        </div>
                                        <Progress percent={getPercent(stats?.countReviewingResumes ?? 0)} strokeColor="#1890ff" showInfo={false} size={[-1, 8]} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#334155', fontSize: 13 }}>
                                            <span><CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} /> Mời phỏng vấn (APPROVED): <strong>{stats?.countApprovedResumes ?? 0} CV</strong></span>
                                            <span style={{ fontWeight: 600 }}>{getPercent(stats?.countApprovedResumes ?? 0)}%</span>
                                        </div>
                                        <Progress percent={getPercent(stats?.countApprovedResumes ?? 0)} strokeColor="#52c41a" showInfo={false} size={[-1, 8]} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#334155', fontSize: 13 }}>
                                            <span><CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 4 }} /> Chưa phù hợp (REJECTED): <strong>{stats?.countRejectedResumes ?? 0} CV</strong></span>
                                            <span style={{ fontWeight: 600 }}>{getPercent(stats?.countRejectedResumes ?? 0)}%</span>
                                        </div>
                                        <Progress percent={getPercent(stats?.countRejectedResumes ?? 0)} strokeColor="#ff4d4f" showInfo={false} size={[-1, 8]} />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Phím tắt & Hướng dẫn tuyển dụng */}
                <Col span={24} lg={8}>
                    <Card title="Hành động nhanh" className="premium-card" bordered={false}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Button 
                                block 
                                style={{ height: 44, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                onClick={() => navigate('/hr/job')}
                            >
                                <span>📋 Quản lý tin tuyển dụng</span>
                                <RightOutlined style={{ fontSize: 12, color: '#94a3b8' }} />
                            </Button>
                            <Button 
                                block 
                                style={{ height: 44, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                onClick={() => navigate('/hr/resume')}
                            >
                                <span>📄 Sàng lọc CV ứng viên</span>
                                <RightOutlined style={{ fontSize: 12, color: '#94a3b8' }} />
                            </Button>
                            <Button 
                                block 
                                style={{ height: 44, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                onClick={() => navigate('/hr/interview')}
                            >
                                <span>📅 Xếp lịch phỏng vấn ứng viên</span>
                                <RightOutlined style={{ fontSize: 12, color: '#94a3b8' }} />
                            </Button>
                            <Button 
                                block 
                                style={{ height: 44, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                onClick={() => navigate('/hr/company')}
                            >
                                <span>🏢 Xem & sửa thông tin công ty</span>
                                <RightOutlined style={{ fontSize: 12, color: '#94a3b8' }} />
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HrDashboardPage;
