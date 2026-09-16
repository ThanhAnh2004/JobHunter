import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
    CodeOutlined, 
    MobileOutlined, 
    CloudServerOutlined, 
    SafetyCertificateOutlined, 
    ExperimentOutlined, 
    DatabaseOutlined, 
    RocketOutlined, 
    ProjectOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import styles from '@/styles/client.module.scss';
import { callFetchAllSkill } from '@/config/api';

interface CategoryItem {
    id: string;
    name: string;
    skillKeywords: string[];
    jobCount: string;
    icon: React.ReactNode;
    color: string;
    bgGradient: string;
}

const CATEGORIES: CategoryItem[] = [
    {
        id: 'web',
        name: 'Lập Trình Web (Frontend / Backend)',
        skillKeywords: ['REACT.JS', 'VUE.JS', 'ANGULAR', 'NODE.JS', 'NEST.JS', 'JAVA', 'JAVA SPRING', 'SPRING BOOT', 'PHP / LARAVEL', 'FRONTEND', 'BACKEND', 'FULLSTACK', 'TYPESCRIPT'],
        jobCount: 'Xem vị trí tuyển dụng',
        icon: <CodeOutlined />,
        color: '#3b82f6',
        bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.03) 100%)'
    },
    {
        id: 'mobile',
        name: 'Lập Trình Mobile (iOS / Android / Flutter)',
        skillKeywords: ['FLUTTER', 'REACT NATIVE'],
        jobCount: 'Xem vị trí tuyển dụng',
        icon: <MobileOutlined />,
        color: '#10b981',
        bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.03) 100%)'
    },
    {
        id: 'devops',
        name: 'DevOps & Điện Toán Đám Mây (Cloud)',
        skillKeywords: ['DEVOPS', 'DOCKER', 'KUBERNETES', 'AWS'],
        jobCount: 'Xem vị trí tuyển dụng',
        icon: <CloudServerOutlined />,
        color: '#8b5cf6',
        bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.03) 100%)'
    },
    {
        id: 'qa_qc',
        name: 'Kiểm Thử Phần Mềm (QA / QC / Tester)',
        skillKeywords: ['TESTER'],
        jobCount: 'Xem vị trí tuyển dụng',
        icon: <ExperimentOutlined />,
        color: '#f59e0b',
        bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.03) 100%)'
    },
    {
        id: 'data_ai',
        name: 'Dữ Liệu & Trí Tuệ Nhân Tạo (Data / AI)',
        skillKeywords: ['PYTHON', 'DATA ENGINEER', 'AI / ML'],
        jobCount: 'Xem vị trí tuyển dụng',
        icon: <DatabaseOutlined />,
        color: '#ec4899',
        bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.03) 100%)'
    },
    {
        id: 'cyber_security',
        name: 'An Toàn Thông Tin & Bảo Mật (Security)',
        skillKeywords: ['CYBER SECURITY'],
        jobCount: 'Xem vị trí tuyển dụng',
        icon: <SafetyCertificateOutlined />,
        color: '#06b6d4',
        bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0.03) 100%)'
    },
    {
        id: 'game_dev',
        name: 'Phát Triển Game (Unity / Unreal / C++)',
        skillKeywords: ['C# / .NET'],
        jobCount: 'Xem vị trí tuyển dụng',
        icon: <RocketOutlined />,
        color: '#ef4444',
        bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.03) 100%)'
    },
    {
        id: 'product_ba',
        name: 'Quản Lý Dự Án & Phân Tích (BA / PM / PO)',
        skillKeywords: ['BUSINESS ANALYST'],
        jobCount: 'Xem vị trí tuyển dụng',
        icon: <ProjectOutlined />,
        color: '#6366f1',
        bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.03) 100%)'
    }
];

export const HotCategories: React.FC = () => {
    const navigate = useNavigate();
    const [allSkills, setAllSkills] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await callFetchAllSkill('page=1&size=100');
                if (res && res.data && res.data.result) {
                    setAllSkills(res.data.result.map((item: any) => ({
                        id: item.id,
                        name: item.name
                    })));
                }
            } catch (error) {
                console.error("Error fetching skills in HotCategories: ", error);
            }
        };
        fetchSkills();
    }, []);

    const handleCategoryClick = (cat: CategoryItem) => {
        navigate(`/job?category=${cat.id}`);
    };

    return (
        <div style={{ margin: '40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                        Top Ngành Nghề IT Nổi Bật
                    </h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                        Khám phá các lĩnh vực công nghệ thu hút nhiều vị trí tuyển dụng hấp dẫn nhất
                    </p>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                {CATEGORIES.map(item => (
                    <Col span={24} sm={12} md={6} key={item.id}>
                        <Card
                            hoverable
                            onClick={() => handleCategoryClick(item)}
                            style={{
                                borderRadius: 12,
                                border: '1px solid #e2e8f0',
                                background: item.bgGradient,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                height: '100%'
                            }}
                            bodyStyle={{ padding: '20px' }}
                            className={styles["category-card"]}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    background: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 22,
                                    color: item.color,
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
                                    flexShrink: 0
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: '#0f172a',
                                        margin: '0 0 4px 0',
                                        lineHeight: 1.3,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {item.name}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                                            {item.jobCount}
                                        </span>
                                        <ArrowRightOutlined style={{ fontSize: 11, color: item.color }} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HotCategories;
