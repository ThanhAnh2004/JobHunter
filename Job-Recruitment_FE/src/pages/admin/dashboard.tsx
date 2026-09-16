import { Card, Col, Row, Statistic, Progress, Spin, Tag } from "antd";
import CountUp from 'react-countup';
import { useState, useEffect } from "react";
import { callFetchDashboardStats } from "@/config/api";
import { IDashboardStats } from "@/types/backend";
import { UserOutlined, BankOutlined, ScheduleOutlined, ExceptionOutlined } from "@ant-design/icons";

const DashboardPage = () => {
    const [stats, setStats] = useState<IDashboardStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
                <span style={{ color: '#64748b', fontSize: '14px' }}>Đang tải dữ liệu thống kê hệ thống...</span>
            </div>
        );
    }

    // Tính toán phần trạng thái CV
    const totalCV = stats?.totalResumes ?? 0;
    const getPercent = (count: number) => {
        if (totalCV === 0) return 0;
        return Math.round((count / totalCV) * 100);
    };

    return (
        <div style={{ padding: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: '#0f172a', fontWeight: 700, letterSpacing: '0.5px' }}>
                    Tổng quan Quản trị Toàn Hệ Thống
                </h2>
                <Tag color="red" style={{ fontSize: 13, padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>
                    Super Admin Console
                </Tag>
            </div>
            
            {/* Hàng thẻ thống kê chính */}
            <Row gutter={[20, 20]}>
                <Col span={24} sm={12} md={6}>
                    <Card className="premium-card" bordered={false}>
                        <div className="stat-card-content">
                            <div className="stat-details">
                                <div className="stat-title">Tổng người dùng</div>
                                <div className="stat-number">
                                    <CountUp end={stats?.totalUsers ?? 0} separator="," />
                                </div>
                            </div>
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(24, 144, 255, 0.12)', color: '#1890ff' }}>
                                <UserOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={24} sm={12} md={6}>
                    <Card className="premium-card" bordered={false}>
                        <div className="stat-card-content">
                            <div className="stat-details">
                                <div className="stat-title">Tổng công ty đối tác</div>
                                <div className="stat-number">
                                    <CountUp end={stats?.totalCompanies ?? 0} separator="," />
                                </div>
                            </div>
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(19, 194, 194, 0.12)', color: '#13c2c2' }}>
                                <BankOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={24} sm={12} md={6}>
                    <Card className="premium-card" bordered={false}>
                        <div className="stat-card-content">
                            <div className="stat-details">
                                <div className="stat-title">Việc làm trên hệ thống</div>
                                <div className="stat-number">
                                    <CountUp end={stats?.totalJobs ?? 0} separator="," />
                                </div>
                            </div>
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(82, 196, 26, 0.12)', color: '#52c41a' }}>
                                <ScheduleOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={24} sm={12} md={6}>
                    <Card className="premium-card" bordered={false}>
                        <div className="stat-card-content">
                            <div className="stat-details">
                                <div className="stat-title">Hồ sơ ứng tuyển (CV)</div>
                                <div className="stat-number">
                                    <CountUp end={stats?.totalResumes ?? 0} separator="," />
                                </div>
                            </div>
                            <div className="stat-icon-wrapper" style={{ background: 'rgba(114, 46, 209, 0.12)', color: '#722ed1' }}>
                                <ExceptionOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Hàng phân tích chi tiết hồ sơ CV */}
            <Row gutter={[20, 20]} style={{ marginTop: '25px' }}>
                <Col span={24}>
                    <Card title="Phân tích trạng thái hồ sơ ứng tuyển toàn sàn" className="premium-card" bordered={false}>
                        <Row gutter={[40, 20]} align="middle">
                            <Col span={24} md={10}>
                                <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <Statistic 
                                        title={<span style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Tổng số CV nhận được</span>}
                                        value={totalCV} 
                                        formatter={formatter}
                                        valueStyle={{ fontSize: '42px', fontWeight: 800, color: '#0f172a' }}
                                    />
                                    <div style={{ marginTop: '12px', color: '#64748b', fontSize: '13px' }}>
                                        Số liệu được cập nhật tự động theo thời gian thực
                                    </div>
                                </div>
                            </Col>
                            <Col span={24} md={14}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#334155' }}>
                                            <span>Chờ xử lý (PENDING) - <strong style={{ color: '#d97706' }}>{stats?.countPendingResumes} CV</strong></span>
                                            <span style={{ fontWeight: 600 }}>{getPercent(stats?.countPendingResumes ?? 0)}%</span>
                                        </div>
                                        <Progress percent={getPercent(stats?.countPendingResumes ?? 0)} strokeColor="#faad14" showInfo={false} size={[-1, 8]} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#334155' }}>
                                            <span>Đang đánh giá (REVIEWING) - <strong style={{ color: '#2563eb' }}>{stats?.countReviewingResumes} CV</strong></span>
                                            <span style={{ fontWeight: 600 }}>{getPercent(stats?.countReviewingResumes ?? 0)}%</span>
                                        </div>
                                        <Progress percent={getPercent(stats?.countReviewingResumes ?? 0)} strokeColor="#1890ff" showInfo={false} size={[-1, 8]} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#334155' }}>
                                            <span>Đạt yêu cầu (APPROVED) - <strong style={{ color: '#16a34a' }}>{stats?.countApprovedResumes} CV</strong></span>
                                            <span style={{ fontWeight: 600 }}>{getPercent(stats?.countApprovedResumes ?? 0)}%</span>
                                        </div>
                                        <Progress percent={getPercent(stats?.countApprovedResumes ?? 0)} strokeColor="#52c41a" showInfo={false} size={[-1, 8]} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#334155' }}>
                                            <span>Từ chối (REJECTED) - <strong style={{ color: '#dc2626' }}>{stats?.countRejectedResumes} CV</strong></span>
                                            <span style={{ fontWeight: 600 }}>{getPercent(stats?.countRejectedResumes ?? 0)}%</span>
                                        </div>
                                        <Progress percent={getPercent(stats?.countRejectedResumes ?? 0)} strokeColor="#ff4d4f" showInfo={false} size={[-1, 8]} />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;