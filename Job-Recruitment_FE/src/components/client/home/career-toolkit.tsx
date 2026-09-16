import React, { useState } from 'react';
import { Row, Col, Card, Button, Tag } from 'antd';
import { 
    CalculatorOutlined, 
    CompassOutlined, 
    LineChartOutlined, 
    SafetyCertificateOutlined,
    RightOutlined,
    StarFilled
} from '@ant-design/icons';
import GrossNetModal from './gross-net-modal';
import ItRoadmapModal from './it-roadmap-modal';
import SalaryReportModal from './salary-report-modal';
import InterviewTipsModal from './interview-tips-modal';

export const CareerToolkit: React.FC = () => {
    const [openGrossNet, setOpenGrossNet] = useState<boolean>(false);
    const [openItRoadmap, setOpenItRoadmap] = useState<boolean>(false);
    const [openSalaryReport, setOpenSalaryReport] = useState<boolean>(false);
    const [openInterviewTips, setOpenInterviewTips] = useState<boolean>(false);

    const toolkits = [
        {
            id: 'gross-net',
            title: 'Tính Lương GROSS - NET',
            description: 'Công cụ quy đổi lương Gross ⇄ Net chuẩn xác theo luật thuế và bảo hiểm xã hội mới nhất 2026.',
            icon: <CalculatorOutlined style={{ fontSize: 26, color: '#16a34a' }} />,
            badge: 'HOT NHẤT',
            badgeColor: 'success',
            actionText: 'Tính lương ngay',
            action: () => setOpenGrossNet(true),
            cardBg: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            borderColor: '#bbf7d0'
        },
        {
            id: 'it-roadmap',
            title: 'Lộ Trình Nghề Nghiệp IT',
            description: 'Khám phá lộ trình kỹ năng chi tiết từ Fresher đến Tech Lead cho Backend, Frontend, DevOps, AI & Mobile.',
            icon: <CompassOutlined style={{ fontSize: 26, color: '#2563eb' }} />,
            badge: 'LỘ TRÌNH 2026',
            badgeColor: 'processing',
            actionText: 'Xem roadmap',
            action: () => setOpenItRoadmap(true),
            cardBg: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
            borderColor: '#bfdbfe'
        },
        {
            id: 'salary-report',
            title: 'Báo Cáo Lương IT 2026',
            description: 'Khảo sát mức lương chi tiết theo từng ngôn ngữ (Java, React, Python, Golang) và cấp bậc kinh nghiệm.',
            icon: <LineChartOutlined style={{ fontSize: 26, color: '#9333ea' }} />,
            badge: 'CẬP NHẬT',
            badgeColor: 'purple',
            actionText: 'Tra cứu lương',
            action: () => setOpenSalaryReport(true),
            cardBg: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
            borderColor: '#e9d5ff'
        },
        {
            id: 'interview-prep',
            title: 'Bí Quyết Phỏng Vấn IT',
            description: 'Tổng hợp các câu hỏi và kỹ năng phỏng vấn kỹ thuật thường gặp tại các công ty công nghệ.',
            icon: <SafetyCertificateOutlined style={{ fontSize: 26, color: '#ea580c' }} />,
            badge: 'HỮU ÍCH',
            badgeColor: 'warning',
            actionText: 'Khám phá ngay',
            action: () => setOpenInterviewTips(true),
            cardBg: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
            borderColor: '#fed7aa'
        }
    ];

    return (
        <div style={{ margin: '50px 0' }}>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <StarFilled style={{ color: '#f59e0b', fontSize: 18 }} />
                    <span style={{ color: '#2563eb', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        Dành Riêng Cho Ứng Viên
                    </span>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                    Bộ Tiện Ích Phát Triển Sự Nghiệp
                </h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                    Công cụ thông minh giúp bạn chủ động định giá bản thân, xây dựng hồ sơ và nắm bắt cơ hội tốt nhất
                </p>
            </div>

            <Row gutter={[20, 20]}>
                {toolkits.map(tool => (
                    <Col span={24} sm={12} md={6} key={tool.id}>
                        <Card
                            hoverable
                            style={{
                                borderRadius: 14,
                                border: `1px solid ${tool.borderColor}`,
                                background: tool.cardBg,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            bodyStyle={{ 
                                padding: '22px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%',
                                justifyContent: 'space-between'
                            }}
                            onClick={tool.action}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                    <div style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 12,
                                        background: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                    }}>
                                        {tool.icon}
                                    </div>
                                    <Tag color={tool.badgeColor} style={{ fontWeight: 600, borderRadius: 6, fontSize: 11, padding: '2px 8px' }}>
                                        {tool.badge}
                                    </Tag>
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                                    {tool.title}
                                </h3>
                                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                                    {tool.description}
                                </p>
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <Button 
                                    type="link" 
                                    style={{ padding: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    {tool.actionText} <RightOutlined style={{ fontSize: 11 }} />
                                </Button>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* 1. Gross - Net Calculator Modal */}
            <GrossNetModal
                open={openGrossNet}
                onClose={() => setOpenGrossNet(false)}
            />

            {/* 2. IT Career Roadmap Modal */}
            <ItRoadmapModal
                open={openItRoadmap}
                onClose={() => setOpenItRoadmap(false)}
            />

            {/* 3. Salary Report 2026 Modal */}
            <SalaryReportModal
                open={openSalaryReport}
                onClose={() => setOpenSalaryReport(false)}
            />

            {/* 4. Interview Tips & Prep Modal */}
            <InterviewTipsModal
                open={openInterviewTips}
                onClose={() => setOpenInterviewTips(false)}
            />
        </div>
    );
};

export default CareerToolkit;
