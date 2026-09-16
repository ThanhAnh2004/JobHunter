import React from 'react';
import { Modal, Table, Tag, Typography, Row, Col, Card } from 'antd';
import { LineChartOutlined, ThunderboltOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface SalaryReportModalProps {
    open: boolean;
    onClose: () => void;
}

const SALARY_DATA = [
    {
        key: '1',
        role: 'Java / Spring Boot Engineer',
        fresher: '9 - 14 triệu',
        junior: '14 - 24 triệu',
        middle: '25 - 42 triệu',
        senior: '45 - 75 triệu',
        trend: '+12% / năm'
    },
    {
        key: '2',
        role: 'Frontend Developer (React / Vue)',
        fresher: '8 - 13 triệu',
        junior: '13 - 22 triệu',
        middle: '22 - 38 triệu',
        senior: '40 - 65 triệu',
        trend: '+10% / năm'
    },
    {
        key: '3',
        role: 'Fullstack Software Engineer',
        fresher: '10 - 15 triệu',
        junior: '16 - 26 triệu',
        middle: '28 - 48 triệu',
        senior: '50 - 85 triệu',
        trend: '+15% / năm'
    },
    {
        key: '4',
        role: 'DevOps & Cloud Engineer (AWS/K8s)',
        fresher: '10 - 16 triệu',
        junior: '18 - 30 triệu',
        middle: '32 - 55 triệu',
        senior: '55 - 95 triệu',
        trend: '+18% / năm'
    },
    {
        key: '5',
        role: 'Data Engineer & AI / ML Specialist',
        fresher: '11 - 17 triệu',
        junior: '18 - 32 triệu',
        middle: '35 - 60 triệu',
        senior: '60 - 110 triệu',
        trend: '+22% / năm'
    },
    {
        key: '6',
        role: 'Mobile Developer (Flutter / React Native)',
        fresher: '9 - 14 triệu',
        junior: '14 - 24 triệu',
        middle: '24 - 40 triệu',
        senior: '42 - 70 triệu',
        trend: '+11% / năm'
    },
    {
        key: '7',
        role: 'QA / QC & Automation Tester',
        fresher: '8 - 12 triệu',
        junior: '12 - 20 triệu',
        middle: '20 - 35 triệu',
        senior: '36 - 55 triệu',
        trend: '+9% / năm'
    }
];

const COLUMNS = [
    {
        title: 'Vị Trí / Công Nghệ',
        dataIndex: 'role',
        key: 'role',
        render: (text: string) => <strong style={{ color: '#0f172a' }}>{text}</strong>
    },
    {
        title: 'Fresher (0-1 năm)',
        dataIndex: 'fresher',
        key: 'fresher'
    },
    {
        title: 'Junior (1-3 năm)',
        dataIndex: 'junior',
        key: 'junior'
    },
    {
        title: 'Middle (3-5 năm)',
        dataIndex: 'middle',
        key: 'middle',
        render: (text: string) => <span style={{ fontWeight: 600, color: '#2563eb' }}>{text}</span>
    },
    {
        title: 'Senior (5+ năm)',
        dataIndex: 'senior',
        key: 'senior',
        render: (text: string) => <span style={{ fontWeight: 700, color: '#16a34a' }}>{text}</span>
    },
    {
        title: 'Tăng Trưởng',
        dataIndex: 'trend',
        key: 'trend',
        render: (text: string) => <Tag color="green">{text}</Tag>
    }
];

export const SalaryReportModal: React.FC<SalaryReportModalProps> = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={950}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18 }}>
                    <LineChartOutlined style={{ color: '#9333ea' }} />
                    <span>Báo Cáo Mức Lương IT Việt Nam 2026 — Khảo Sát Thực Tế</span>
                </div>
            }
            bodyStyle={{ padding: '20px 24px' }}
        >
            <div style={{
                background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                border: '1px solid #e9d5ff',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#6b21a8', marginBottom: 4 }}>
                    <ThunderboltOutlined /> Tổng quan thị trường tuyển dụng IT 2026
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#581c87', lineHeight: 1.6 }}>
                    Dữ liệu được tổng hợp từ hơn 50.000 tin tuyển dụng thực tế và khảo sát tại các trung tâm công nghệ Hà Nội, TP. Hồ Chí Minh và Đà Nẵng. Mức lương tính theo thu nhập GROSS (triệu VNĐ/tháng).
                </p>
            </div>

            <Table
                dataSource={SALARY_DATA}
                columns={COLUMNS}
                pagination={false}
                bordered
                size="middle"
            />

            <div style={{ marginTop: 20, background: '#f8fafc', padding: '14px 18px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13, color: '#64748b' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>💡 Lưu ý đàm phán:</span> Các kỹ sư có tiếng Anh lưu loát (IELTS 6.5+ hoặc TOEIC 800+) hoặc kinh nghiệm làm việc trực tiếp với khách hàng US/Singapore/Châu Âu thường đạt mức lương cao hơn 25% - 40% so với mặt bằng chung.
            </div>
        </Modal>
    );
};

export default SalaryReportModal;
