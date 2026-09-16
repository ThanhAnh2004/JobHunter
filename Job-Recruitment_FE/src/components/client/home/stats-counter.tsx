import React from 'react';
import { Row, Col, Card } from 'antd';
import { 
    BankOutlined, 
    SolutionOutlined, 
    TeamOutlined, 
    CheckCircleOutlined 
} from '@ant-design/icons';
import CountUp from 'react-countup';

export const StatsCounter: React.FC = () => {
    const stats = [
        {
            id: 'companies',
            number: 50,
            suffix: '+',
            label: 'Doanh Nghiệp Tham Gia',
            description: 'Các công ty & đơn vị công nghệ tuyển dụng trực tiếp',
            icon: <BankOutlined style={{ fontSize: 28, color: '#3b82f6' }} />,
            bgColor: '#eff6ff'
        },
        {
            id: 'jobs',
            number: 100,
            suffix: '+',
            label: 'Cơ Hội Việc Làm IT',
            description: 'Vị trí tuyển dụng phong phú từ Fresher đến Senior',
            icon: <SolutionOutlined style={{ fontSize: 28, color: '#10b981' }} />,
            bgColor: '#ecfdf5'
        },
        {
            id: 'candidates',
            number: 500,
            suffix: '+',
            label: 'Ứng Viên Đồng Hành',
            description: 'Cộng đồng lập trình viên và sinh viên công nghệ',
            icon: <TeamOutlined style={{ fontSize: 28, color: '#8b5cf6' }} />,
            bgColor: '#f5f3ff'
        },
        {
            id: 'success_rate',
            number: 100,
            suffix: '%',
            label: 'Trải Nghiệm Miễn Phí',
            description: 'Ứng tuyển, nộp CV và dùng mọi tiện ích không mất phí',
            icon: <CheckCircleOutlined style={{ fontSize: 28, color: '#f59e0b' }} />,
            bgColor: '#fffbeb'
        }
    ];

    return (
        <div style={{
            margin: '60px 0',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 20,
            padding: '40px 30px',
            color: '#ffffff',
            boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.4)'
        }}>
            <Row gutter={[24, 24]} align="middle">
                {stats.map(item => (
                    <Col span={24} sm={12} md={6} key={item.id}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '10px'
                        }}>
                            <div style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(8px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 14,
                                border: '1px solid rgba(255, 255, 255, 0.15)'
                            }}>
                                {item.icon}
                            </div>
                            <div style={{ fontSize: 34, fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginBottom: 6 }}>
                                <CountUp end={item.number} separator="," duration={2.5} />
                                <span style={{ color: '#38bdf8' }}>{item.suffix}</span>
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
                                {item.label}
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4, maxWidth: 220 }}>
                                {item.description}
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default StatsCounter;
