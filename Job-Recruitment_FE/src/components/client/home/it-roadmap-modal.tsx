import React, { useState } from 'react';
import { Modal, Tabs, Card, Tag, Button, Typography, Row, Col, Steps, Divider } from 'antd';
import { 
    CompassOutlined, 
    CodeOutlined, 
    DesktopOutlined, 
    CloudServerOutlined, 
    DatabaseOutlined, 
    MobileOutlined, 
    CheckCircleOutlined, 
    TrophyOutlined, 
    DollarCircleOutlined, 
    ArrowRightOutlined,
    BookOutlined,
    RocketOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface ItRoadmapModalProps {
    open: boolean;
    onClose: () => void;
}

interface Milestone {
    level: string;
    exp: string;
    salary: string;
    goals: string[];
    coreSkills: string[];
    projects: string[];
    certifications?: string[];
}

interface RoadmapTrack {
    key: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    badge: string;
    summary: string;
    searchKeyword: string;
    milestones: Milestone[];
}

const ROADMAP_DATA: RoadmapTrack[] = [
    {
        key: 'backend',
        name: 'Backend Engineer',
        icon: <CodeOutlined style={{ fontSize: 18 }} />,
        color: '#16a34a',
        badge: 'Nhu cầu cực cao 🔥',
        summary: 'Xây dựng kiến trúc dịch vụ, xử lý dữ liệu lớn, bảo mật hệ thống và tối ưu hiệu năng API cho hàng triệu người dùng.',
        searchKeyword: 'Backend',
        milestones: [
            {
                level: 'Intern / Fresher',
                exp: '0 - 1 năm kinh nghiệm',
                salary: '8.000.000 - 14.000.000 VNĐ',
                goals: [
                    'Nắm vững lập trình hướng đối tượng (OOP), cấu trúc dữ liệu & giải thuật cơ bản',
                    'Thành thạo 1 ngôn ngữ chính: Java (Spring Boot) / Node.js (Express/NestJS) / Golang / C# (.NET)',
                    'Hiểu rõ cơ chế HTTP/HTTPS, RESTful API Design và Git Version Control'
                ],
                coreSkills: ['Java / Spring Boot', 'Node.js / TypeScript', 'MySQL / PostgreSQL', 'RESTful API', 'Git / GitHub', 'Postman'],
                projects: ['Xây dựng ứng dụng CRUD chuẩn MVC', 'Hệ thống xác thực Authentication (JWT, Refresh Token)', 'Tích hợp thanh toán cơ bản (VNPAY / MoMo)'],
                certifications: ['Oracle Certified Associate (OCA Java)', 'Coursera Web Development Backend Specialization']
            },
            {
                level: 'Junior / Middle',
                exp: '1 - 3 năm kinh nghiệm',
                salary: '16.000.000 - 28.000.000 VNĐ',
                goals: [
                    'Làm chủ ORM/JPA, tối ưu hóa truy vấn Database, Indexing, Tránh N+1 query',
                    'Áp dụng Caching (Redis/Memcached) giảm tải hệ thống',
                    'Làm quen với kiến trúc Microservices, Containerization với Docker và Message Queue'
                ],
                coreSkills: ['Spring Cloud / NestJS', 'Redis Caching', 'Docker & Docker Compose', 'Kafka / RabbitMQ', 'JPA / Hibernate Tuning', 'Unit & Integration Testing (JUnit/Jest)'],
                projects: ['Hệ thống E-Commerce xử lý concurrency đặt hàng', 'Chat Realtime WebSocket đa phòng', 'Tối ưu API phản hồi dưới 100ms với hàng nghìn RPM'],
                certifications: ['Oracle Certified Professional (OCP Java)', 'AWS Certified Developer - Associate']
            },
            {
                level: 'Senior Developer',
                exp: '3 - 5+ năm kinh nghiệm',
                salary: '32.000.000 - 55.000.000 VNĐ',
                goals: [
                    'Thiết kế kiến trúc hệ thống phân tán (Distributed Systems), Event-Driven Architecture',
                    'Đảm bảo High Availability (HA), Fault Tolerance, Rate Limiting, Idempotency',
                    'Lead kỹ thuật, Review code, tối ưu chi phí hạ tầng và hướng dẫn Junior'
                ],
                coreSkills: ['System Design', 'Microservices Architecture', 'Kubernetes (K8s)', 'Elasticsearch / OpenSearch', 'CI/CD Pipeline', 'Security (OAuth2/OIDC, mTLS)'],
                projects: ['Thiết kế lõi thanh toán / Core Banking giao dịch tài chính', 'Kiến trúc Sharding / Replication dữ liệu lớn nhiều Terabyte', 'Xây dựng API Gateway & Service Mesh'],
                certifications: ['AWS Certified Solutions Architect - Associate / Professional', 'Certified Kubernetes Application Developer (CKAD)']
            },
            {
                level: 'Tech Lead / Solution Architect',
                exp: '5+ năm kinh nghiệm',
                salary: '55.000.000 - 90.000.000+ VNĐ',
                goals: [
                    'Định hướng công nghệ tổng thể cho toàn doanh nghiệp, tối ưu Tech Stack ROI',
                    'Quản trị rủi ro kỹ thuật, đảm bảo tuân thủ tiêu chuẩn bảo mật quốc tế (SOC2, PCI-DSS)',
                    'Cầu nối giữa Business Stakeholders và đội ngũ kỹ thuật sản phẩm'
                ],
                coreSkills: ['Enterprise Architecture', 'Domain-Driven Design (DDD)', 'Cloud FinOps', 'Tech Strategy', 'People Leadership', 'Disaster Recovery (DR)'],
                projects: ['Chuyển đổi toàn bộ Monolith sang Cloud-Native Microservices không gián đoạn dịch vụ', 'Hệ thống Realtime Data Pipeline triệu sự kiện mỗi giây'],
                certifications: ['TOGAF Enterprise Architecture', 'AWS Solutions Architect - Professional', 'Google Cloud Certified Professional Cloud Architect']
            }
        ]
    },
    {
        key: 'frontend',
        name: 'Frontend Engineer',
        icon: <DesktopOutlined style={{ fontSize: 18 }} />,
        color: '#2563eb',
        badge: 'Xu hướng hiện đại ✨',
        summary: 'Tạo dựng trải nghiệm người dùng đỉnh cao, giao diện mượt mà, tối ưu SEO, hiệu năng render và tương thích mọi thiết bị.',
        searchKeyword: 'Frontend',
        milestones: [
            {
                level: 'Intern / Fresher',
                exp: '0 - 1 năm kinh nghiệm',
                salary: '7.500.000 - 13.000.000 VNĐ',
                goals: [
                    'Nắm vững HTML5 Semantic, CSS3 (Flexbox/Grid), JavaScript ES6+ hiện đại',
                    'Thành thạo ReactJS (Hooks, Props, State, React Router) hoặc VueJS',
                    'Sử dụng các UI Component Libraries (Ant Design, TailwindCSS, MUI)'
                ],
                coreSkills: ['JavaScript (ES6+)', 'TypeScript Căn bản', 'React.js / Vue.js', 'HTML5 / CSS3 / SCSS', 'TailwindCSS / Ant Design', 'Git / GitHub'],
                projects: ['Trang thương mại điện tử responsive hoàn chỉnh', 'Dashboard quản trị Admin Dashboard với biểu đồ trực quan', 'Portfolio cá nhân chuẩn SEO'],
                certifications: ['Meta Front-End Developer Professional Certificate']
            },
            {
                level: 'Junior / Middle',
                exp: '1 - 3 năm kinh nghiệm',
                salary: '15.000.000 - 26.000.000 VNĐ',
                goals: [
                    'Làm chủ Next.js (App Router, Server Components, SSR, SSG, ISR)',
                    'Quản lý State phức tạp với Redux Toolkit, Zustand, React Query (TanStack Query)',
                    'Tối ưu Web Performance (Core Web Vitals, Code Splitting, Lazy Loading)'
                ],
                coreSkills: ['Next.js / SSR', 'TypeScript Nâng cao', 'Zustand / Redux Toolkit', 'TanStack Query (React Query)', 'Web Performance & SEO', 'Storybook / Jest / Cypress'],
                projects: ['Web App đa ngôn ngữ (i18n) với SSR tối ưu điểm Google Lighthouse 95+', 'Trình chỉnh sửa nội dung Realtime tương tác cao', 'Hệ thống Design System nội bộ có thể tái sử dụng'],
                certifications: ['Frontend Masters Professional Learning Path']
            },
            {
                level: 'Senior / Lead Frontend',
                exp: '3 - 5+ năm kinh nghiệm',
                salary: '28.000.000 - 55.000.000+ VNĐ',
                goals: [
                    'Thiết kế kiến trúc Micro-Frontends (Module Federation), Single SPA',
                    'Xây dựng Enterprise Design System & UI Library riêng biệt cho công ty',
                    'Tối ưu hóa bảo mật Client-side (XSS, CSRF, CSP, Token Storage)'
                ],
                coreSkills: ['Micro-Frontends', 'Webpack / Vite Internals', 'WebAssembly / WebGL / Canvas', 'CI/CD Frontend Pipeline', 'Frontend Architecture', 'Mentoring & Team Lead'],
                projects: ['Kiến trúc Micro-Frontends phân tách độc lập 5+ module cho doanh nghiệp lớn', 'Nền tảng Visualization biểu đồ dữ liệu lớn thời gian thực Canvas/WebGL'],
                certifications: ['Google Web Developer Certification']
            }
        ]
    },
    {
        key: 'devops',
        name: 'DevOps & Cloud Engineer',
        icon: <CloudServerOutlined style={{ fontSize: 18 }} />,
        color: '#ea580c',
        badge: 'Lương & Thưởng Top Đầu 🚀',
        summary: 'Tự động hóa quy trình triển khai CI/CD, vận hành hạ tầng đám mây (AWS/GCP/Azure) an toàn, ổn định và tự động mở rộng.',
        searchKeyword: 'DevOps',
        milestones: [
            {
                level: 'Junior DevOps',
                exp: '1 - 2 năm kinh nghiệm',
                salary: '15.000.000 - 25.000.000 VNĐ',
                goals: [
                    'Thành thạo Linux OS, Bash Scripting, Mạng máy tính (VPC, DNS, Subnet, SSL/TLS)',
                    'Đóng gói ứng dụng với Docker, tối ưu kích thước Dockerfile',
                    'Xây dựng pipeline CI/CD cơ bản (GitHub Actions, GitLab CI)'
                ],
                coreSkills: ['Linux / Bash Shell', 'Docker / Containerization', 'GitHub Actions / GitLab CI', 'Nginx / Reverse Proxy', 'Python / Go Scripting', 'AWS Core (EC2, S3, RDS)'],
                projects: ['Tự động hóa quy trình Build & Deploy Web App lên Cloud qua GitHub Actions', 'Hệ thống Nginx Reverse Proxy cân bằng tải và cấu hình SSL tự động'],
                certifications: ['AWS Certified Cloud Practitioner', 'Linux Foundation Certified System Administrator (LFCS)']
            },
            {
                level: 'Middle / Senior DevOps',
                exp: '2 - 5 năm kinh nghiệm',
                salary: '28.000.000 - 55.000.000 VNĐ',
                goals: [
                    'Quản trị cụm Kubernetes (K8s), Helm Charts, Autoscaling (HPA, VPA)',
                    'Triển khai Infrastructure as Code (IaC) với Terraform / Ansible',
                    'Xây dựng hệ thống Giám sát & Cảnh báo (Observability) với Prometheus, Grafana, ELK'
                ],
                coreSkills: ['Kubernetes (EKS/GKE)', 'Terraform (IaC)', 'Prometheus / Grafana', 'ArgoCD (GitOps)', 'Vault / KMS Security', 'Kafka / Redis Cluster Ops'],
                projects: ['Triển khai mô hình GitOps với ArgoCD quản lý 50+ Microservices', 'Hệ thống Logging tập trung ELK xử lý hàng tỷ log entries mỗi ngày'],
                certifications: ['Certified Kubernetes Administrator (CKA)', 'AWS Certified Solutions Architect / DevOps Engineer Professional', 'HashiCorp Certified: Terraform Associate']
            }
        ]
    },
    {
        key: 'ai-data',
        name: 'AI & Data Engineer',
        icon: <DatabaseOutlined style={{ fontSize: 18 }} />,
        color: '#9333ea',
        badge: 'Đón Đầu Kỷ Nguyên AI 🤖',
        summary: 'Xây dựng Data Pipeline, xử lý Big Data, tích hợp mô hình Machine Learning & Generative AI (LLMs) vào sản phẩm thực tế.',
        searchKeyword: 'Data',
        milestones: [
            {
                level: 'Junior Data / AI Engineer',
                exp: '0 - 2 năm kinh nghiệm',
                salary: '14.000.000 - 24.000.000 VNĐ',
                goals: [
                    'Thành thạo Python (Pandas, NumPy) và SQL phân tích dữ liệu nâng cao',
                    'Hiểu rõ cấu trúc Data Warehouse, Data Modeling (Star/Snowflake Schema)',
                    'Xây dựng Pipeline ETL/ELT cơ bản thu thập và làm sạch dữ liệu'
                ],
                coreSkills: ['Python (Data Stack)', 'Advanced SQL', 'PostgreSQL / ClickHouse', 'Apache Airflow Căn bản', 'Git / Docker', 'FastAPI'],
                projects: ['Pipeline ETL tự động cào và chuẩn hóa dữ liệu tài chính hàng ngày', 'API tích hợp mô hình phân loại văn bản / hình ảnh với PyTorch/HuggingFace'],
                certifications: ['Databricks Certified Data Engineer Associate', 'Google Cloud Certified Professional Data Engineer']
            },
            {
                level: 'Senior Data / AI Specialist',
                exp: '3 - 5+ năm kinh nghiệm',
                salary: '30.000.000 - 65.000.000+ VNĐ',
                goals: [
                    'Xử lý dữ liệu phân tán quy mô lớn với Apache Spark / PySpark, Kafka Streaming',
                    'Triển khai ứng dụng RAG (Retrieval-Augmented Generation), Vector Database và Fine-tuning LLM',
                    'Tối ưu hạ tầng Data Lakehouse (Delta Lake, Iceberg) và chi phí BigQuery/Snowflake'
                ],
                coreSkills: ['PySpark / Databricks', 'Apache Kafka / Flink', 'Vector DB (Pinecone/Milvus/pgvector)', 'LangChain / LlamaIndex / GenAI', 'Snowflake / BigQuery', 'MLflow / MLOps'],
                projects: ['Hệ thống AI Chatbot RAG nội bộ truy vấn hàng chục nghìn tài liệu công ty', 'Nền tảng Realtime Data Streaming phân tích hành vi người dùng triệu event/phút'],
                certifications: ['Databricks Certified Data Engineer Professional', 'AWS Certified Machine Learning - Specialty']
            }
        ]
    },
    {
        key: 'mobile',
        name: 'Mobile App Developer',
        icon: <MobileOutlined style={{ fontSize: 18 }} />,
        color: '#0284c7',
        badge: 'Ứng Dụng Đa Nền Tảng 📱',
        summary: 'Phát triển ứng dụng di động iOS/Android hiệu năng cao với Flutter, React Native hoặc Native (Swift / Kotlin).',
        searchKeyword: 'Mobile',
        milestones: [
            {
                level: 'Junior / Middle Mobile',
                exp: '1 - 3 năm kinh nghiệm',
                salary: '14.000.000 - 26.000.000 VNĐ',
                goals: [
                    'Làm chủ Flutter (Dart, Bloc/Riverpod) hoặc React Native (TypeScript, Zustand)',
                    'Tích hợp Native Device APIs (Camera, GPS, Push Notifications, Bluetooth)',
                    'Tối ưu hiệu năng 60 FPS, xử lý Offline Mode và Local Database (SQLite, Realm, Hive)'
                ],
                coreSkills: ['Flutter / Dart', 'React Native / TypeScript', 'State Management (Bloc/Redux)', 'RESTful API & WebSocket', 'App Publishing (Google Play & App Store)', 'Firebase Suite'],
                projects: ['App Đặt vé & Thanh toán tích hợp ví điện tử và Apple Pay / Google Pay', 'App Mạng xã hội Realtime với thông báo đẩy Push Notification FCM'],
                certifications: ['Meta React Native Specialization', 'Google Associate Android Developer']
            },
            {
                level: 'Senior Mobile Lead',
                exp: '3 - 5+ năm kinh nghiệm',
                salary: '28.000.000 - 50.000.000+ VNĐ',
                goals: [
                    'Kiến trúc Clean Architecture / MVVM / MVI cho ứng dụng triệu người dùng',
                    'Tối ưu dung lượng App Bundle, Memory Leaks, Battery Consumption',
                    'Xây dựng Native Bridge / Custom Plugins kết nối C++ / Swift / Kotlin'
                ],
                coreSkills: ['Clean Architecture', 'Native Swift / Kotlin Interop', 'CI/CD Mobile (Fastlane)', 'Performance & Memory Profiling', 'Security & App Hardening (Obfuscation)'],
                projects: ['Ứng dụng Super-App đa tiện ích với kiến trúc Micro-App', 'Tự động hóa hoàn toàn quy trình Build, Test & Release lên Store bằng Fastlane CI'],
                certifications: ['Google Professional Mobile Developer']
            }
        ]
    }
];

export const ItRoadmapModal: React.FC<ItRoadmapModalProps> = ({ open, onClose }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('backend');

    const currentTrack = ROADMAP_DATA.find(t => t.key === activeTab) || ROADMAP_DATA[0];

    const handleSearchJobs = (keyword: string) => {
        onClose();
        navigate(`/job?keyword=${encodeURIComponent(keyword)}`);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={940}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18 }}>
                    <CompassOutlined style={{ color: '#2563eb', fontSize: 22 }} />
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                        Bản Đồ Lộ Trình Phát Triển Kỹ Năng & Sự Nghiệp IT 2026
                    </span>
                </div>
            }
            bodyStyle={{ padding: '16px 24px 24px 24px', maxHeight: '80vh', overflowY: 'auto' }}
        >
            {/* INTRO HERO BANNER */}
            <div style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 20
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#1e40af', marginBottom: 4, fontSize: 15 }}>
                            <RocketOutlined /> Định Hướng Rõ Ràng — Tăng Tốc Thu Nhập & Vị Thế Nghề Nghiệp
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: '#1e3a8a', lineHeight: 1.6 }}>
                            Khám phá từng nấc thang từ Fresher đến Tech Lead với danh sách kỹ năng trọng tâm, dự án thực chiến và chứng chỉ khuyên dùng.
                        </p>
                    </div>
                </div>
            </div>

            {/* TRACK SELECTION TABS */}
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                type="card"
                items={ROADMAP_DATA.map(track => ({
                    key: track.key,
                    label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                            {track.icon}
                            <span>{track.name}</span>
                        </div>
                    )
                }))}
            />

            {/* ACTIVE TRACK HEADER INFO */}
            <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                                Lộ trình chuyên sâu: {currentTrack.name}
                            </h3>
                            <Tag color="success" style={{ borderRadius: 6, fontWeight: 600 }}>
                                {currentTrack.badge}
                            </Tag>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                            {currentTrack.summary}
                        </p>
                    </div>

                    <Button 
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        style={{
                            background: '#2563eb',
                            borderRadius: 8,
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                        }}
                        onClick={() => handleSearchJobs(currentTrack.searchKeyword)}
                    >
                        Khám phá việc làm {currentTrack.name}
                    </Button>
                </div>
            </div>

            {/* MILESTONE LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {currentTrack.milestones.map((milestone, idx) => (
                    <Card
                        key={idx}
                        style={{
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                        }}
                        bodyStyle={{ padding: '18px 20px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 14,
                                    border: '1px solid #bfdbfe'
                                }}>
                                    {idx + 1}
                                </div>
                                <div>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                                        {milestone.level}
                                    </span>
                                    <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>
                                        ({milestone.exp})
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                padding: '4px 12px',
                                borderRadius: 20,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                color: '#15803d',
                                fontWeight: 700,
                                fontSize: 13
                            }}>
                                <DollarCircleOutlined /> Lương tham khảo: {milestone.salary}
                            </div>
                        </div>

                        <Row gutter={[16, 16]}>
                            {/* CỘT TRÁI: MỤC TIÊU & DỰ ÁN */}
                            <Col span={24} md={12}>
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#334155', marginBottom: 6, fontSize: 13 }}>
                                        <CheckCircleOutlined style={{ color: '#16a34a' }} /> Mục tiêu & Năng lực cốt lõi:
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: 18, color: '#475569', fontSize: 12.5, lineHeight: 1.7 }}>
                                        {milestone.goals.map((goal, gIdx) => (
                                            <li key={gIdx}>{goal}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#334155', marginBottom: 6, fontSize: 13 }}>
                                        <BookOutlined style={{ color: '#0284c7' }} /> Dự án thực chiến gợi ý:
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: 18, color: '#475569', fontSize: 12.5, lineHeight: 1.7 }}>
                                        {milestone.projects.map((proj, pIdx) => (
                                            <li key={pIdx}>{proj}</li>
                                        ))}
                                    </ul>
                                </div>
                            </Col>

                            {/* CỘT PHẢI: KỸ NĂNG & CHỨNG CHỈ */}
                            <Col span={24} md={12}>
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#334155', marginBottom: 8, fontSize: 13 }}>
                                        <CodeOutlined style={{ color: '#2563eb' }} /> Kỹ năng & Công nghệ trọng tâm:
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {milestone.coreSkills.map((skill, sIdx) => (
                                            <Tag key={sIdx} color="blue" style={{ borderRadius: 6, margin: 0, fontSize: 12, padding: '2px 8px' }}>
                                                {skill}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>

                                {milestone.certifications && milestone.certifications.length > 0 && (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#334155', marginBottom: 6, fontSize: 13 }}>
                                            <SafetyCertificateOutlined style={{ color: '#ea580c' }} /> Chứng chỉ giá trị cao:
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {milestone.certifications.map((cert, cIdx) => (
                                                <Tag key={cIdx} color="orange" style={{ borderRadius: 6, margin: 0, fontSize: 11, padding: '1px 7px' }}>
                                                    {cert}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>

            {/* FOOTER TIP */}
            <div style={{
                marginTop: 20,
                textAlign: 'center',
                padding: '14px',
                background: '#f8fafc',
                borderRadius: 10,
                border: '1px dashed #cbd5e1'
            }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                    💡 <strong>Mẹo thăng tiến:</strong> Nhà tuyển dụng ưu tiên ứng viên hiểu sâu bản chất (Architecture & Performance) hơn là chỉ biết sử dụng cú pháp framework cơ bản.
                </span>
            </div>
        </Modal>
    );
};

export default ItRoadmapModal;
