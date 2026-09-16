import React, { useState } from 'react';
import { Row, Col, Card, Tag, Typography, Modal, Button, Divider } from 'antd';
import { ClockCircleOutlined, EyeOutlined, RightOutlined, BookOutlined, ShareAltOutlined, LikeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface BlogPost {
    id: number;
    title: string;
    summary: string;
    category: string;
    categoryColor: string;
    readTime: string;
    views: string;
    image: string;
    date: string;
    author: string;
    content: string[];
}

const BLOG_POSTS: BlogPost[] = [
    {
        id: 1,
        title: 'Bí quyết đàm phán lương IT hiệu quả và khéo léo khi chuyển việc',
        summary: 'Cách chuẩn bị portfolio, xác định giá trị thị trường và nghệ thuật giao tiếp khéo léo với nhà tuyển dụng.',
        category: 'Đàm phán lương',
        categoryColor: 'green',
        readTime: '5 phút đọc',
        views: '320 lượt xem',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
        date: '12/09/2026',
        author: 'Nguyễn Minh Tuấn — Chuyên gia Tuyển dụng IT JobHunter',
        content: [
            '1. Khảo sát kỹ mức lương thị trường: Trước khi bước vào vòng thương lượng, bạn cần nắm rõ dải lương (salary range) cho vị trí và số năm kinh nghiệm của mình thông qua các báo cáo uy tín.',
            '2. Không đưa ra con số chính xác quá sớm: Khi được hỏi về mức lương mong muốn ở vòng đầu, hãy đưa ra một khoảng linh hoạt kèm câu nói: "Mức lương mong muốn của em dao động từ X đến Y tùy thuộc vào trách nhiệm thực tế và gói phúc lợi tổng thể của công ty."',
            '3. Nhấn mạnh vào giá trị bạn mang lại (Value-driven): Hãy chứng minh bằng các dự án cụ thể, khả năng giải quyết bài toán hiệu năng, tối ưu chi phí hạ tầng hoặc nâng cao trải nghiệm người dùng.',
            '4. Đàm phán toàn diện (Total Compensation): Đừng chỉ nhìn vào lương cứng hàng tháng. Hãy cân nhắc cả lương tháng 13, thưởng hiệu suất (KPI), chế độ làm việc Hybrid/Remote, bảo hiểm sức khỏe cao cấp và ngân sách đào tạo cá nhân.'
        ]
    },
    {
        id: 2,
        title: 'Top 15 câu hỏi phỏng vấn Spring Boot & Microservices thường gặp',
        summary: 'Tổng hợp các câu hỏi thực chiến về kiến trúc Microservices, JPA performance, caching và transaction.',
        category: 'Kỹ năng phỏng vấn',
        categoryColor: 'blue',
        readTime: '8 phút đọc',
        views: '450 lượt xem',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        date: '10/09/2026',
        author: 'Trần Hoàng Nam — Senior Backend Architect',
        content: [
            '1. Vấn đề N+1 Query trong Spring Data JPA là gì và cách xử lý? — Sử dụng @EntityGraph, JOIN FETCH trong JPQL, hoặc cấu hình batch_size trong Hibernate.',
            '2. Cơ chế Transaction Propagation trong Spring: Khác biệt giữa REQUIRED, REQUIRES_NEW và NESTED.',
            '3. Cách triển khai Distributed Caching với Redis: Chiến lược Cache-Aside, Write-Through, xử lý Cache Penetration, Cache Breakdown và Cache Avalanche.',
            '4. Giao tiếp giữa các Microservices: Khi nào dùng Synchronous (REST/gRPC) và khi nào dùng Asynchronous Event-driven (Apache Kafka / RabbitMQ)?',
            '5. Xử lý Distributed Transaction trong Microservices: Áp dụng Saga Pattern (Choreography vs Orchestration) hoặc Two-Phase Commit (2PC).'
        ]
    },
    {
        id: 3,
        title: 'Cách viết CV lập trình viên chuẩn ATS tạo ấn tượng với nhà tuyển dụng',
        summary: 'Hướng dẫn cấu trúc CV chuẩn, cách làm nổi bật dự án cá nhân và các từ khóa công nghệ cần có.',
        category: 'Cẩm nang CV',
        categoryColor: 'purple',
        readTime: '6 phút đọc',
        views: '280 lượt xem',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
        date: '08/09/2026',
        author: 'Lê Thùy Dung — Talent Acquisition Lead',
        content: [
            '1. Giữ bố cục 1 cột đơn giản, rõ ràng: Tránh các mẫu CV thiết kế đồ họa 2-3 cột phức tạp với nhiều thanh biểu đồ kỹ năng (skill bars) vì các hệ thống ATS thường quét sai thông tin.',
            '2. Liệt kê từ khóa công nghệ chính xác: Viết đúng tên chuẩn hóa như "ReactJS", "TypeScript", "Spring Boot", "Docker", "AWS S3" thay vì viết tắt mơ hồ.',
            '3. Viết mô tả dự án theo mô hình STAR: Nêu rõ Bối cảnh (Situation), Nhiệm vụ (Task), Công nghệ & Hành động (Action) và Kết quả định lượng (Result — ví dụ: giảm latency 40%, phục vụ 10.000 users/ngày).',
            '4. Luôn đính kèm liên kết GitHub / Live Demo và LinkedIn có hồ sơ hoạt động chuyên nghiệp.'
        ]
    },
    {
        id: 4,
        title: 'Lộ trình phát triển từ Junior lên Senior Software Engineer năm 2026',
        summary: 'Những kỹ năng chuyên sâu về System Design, tư duy giải quyết vấn đề và kỹ năng làm việc nhóm cần có.',
        category: 'Định hướng sự nghiệp',
        categoryColor: 'orange',
        readTime: '7 phút đọc',
        views: '390 lượt xem',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
        date: '05/09/2026',
        author: 'Phạm Đức Anh — Engineering Manager',
        content: [
            '1. Từ "Làm cho chạy được" sang "Làm cho ổn định, mở rộng và bảo trì được": Senior không chỉ viết code giải quyết task, mà còn quan tâm đến Clean Architecture, Unit Test, Logging & Monitoring.',
            '2. Nâng cao tư duy System Design: Hiểu sâu về High Availability (HA), Load Balancing, Database Indexing, Caching layers và Async processing.',
            '3. Kỹ năng giao tiếp và phản biện kỹ thuật (Code Review & Mentoring): Giúp đỡ các bạn Junior phát triển, đóng góp vào các bản RFC kỹ thuật của công ty.',
            '4. Hiểu sâu về bài toán kinh doanh (Business Impact): Hiểu vì sao tính năng này được làm, nó giải quyết nỗi đau gì của khách hàng và mang lại doanh thu ra sao.'
        ]
    }
];

export const CareerBlog: React.FC = () => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    return (
        <div style={{ margin: '50px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                        Cẩm Nang Nghề Nghiệp & Bí Quyết Phỏng Vấn
                    </h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                        Cập nhật kiến thức, kinh nghiệm ứng tuyển và xu hướng thị trường lao động công nghệ mới nhất
                    </p>
                </div>
            </div>

            <Row gutter={[20, 20]}>
                {BLOG_POSTS.map(post => (
                    <Col span={24} sm={12} md={6} key={post.id}>
                        <Card
                            hoverable
                            onClick={() => setSelectedPost(post)}
                            style={{
                                borderRadius: 14,
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}
                            cover={
                                <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        alt={post.title}
                                        src={post.image}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                    />
                                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                                        <Tag color={post.categoryColor} style={{ fontWeight: 600, borderRadius: 4, margin: 0 }}>
                                            {post.category}
                                        </Tag>
                                    </div>
                                </div>
                            }
                        >
                            <div>
                                <div style={{ display: 'flex', gap: 10, fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>
                                    <span><ClockCircleOutlined style={{ marginRight: 4 }} />{post.readTime}</span>
                                    <span>•</span>
                                    <span><EyeOutlined style={{ marginRight: 4 }} />{post.views}</span>
                                </div>
                                <h3 style={{
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: '#0f172a',
                                    marginBottom: 8,
                                    lineHeight: 1.4,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {post.title}
                                </h3>
                                <p style={{
                                    fontSize: 13,
                                    color: '#64748b',
                                    lineHeight: 1.5,
                                    margin: 0,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {post.summary}
                                </p>
                            </div>

                            <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                                <span style={{ color: '#94a3b8' }}>{post.date}</span>
                                <span style={{ color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    Đọc bài viết <RightOutlined style={{ fontSize: 10 }} />
                                </span>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* MODAL ĐỌC CHI TIẾT BÀI VIẾT */}
            <Modal
                open={!!selectedPost}
                onCancel={() => setSelectedPost(null)}
                footer={null}
                width={800}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18 }}>
                        <BookOutlined style={{ color: '#2563eb' }} />
                        <span>Cẩm Nang Nghề Nghiệp IT</span>
                    </div>
                }
                bodyStyle={{ padding: '24px 28px' }}
            >
                {selectedPost && (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <Tag color={selectedPost.categoryColor} style={{ fontWeight: 600, borderRadius: 4, marginBottom: 10 }}>
                                {selectedPost.category}
                            </Tag>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                                {selectedPost.title}
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#64748b', fontSize: 13 }}>
                                <span>✍️ {selectedPost.author}</span>
                                <span>•</span>
                                <span>🕒 {selectedPost.date} ({selectedPost.readTime})</span>
                            </div>
                        </div>

                        <div style={{ borderRadius: 12, overflow: 'hidden', height: 260, marginBottom: 20 }}>
                            <img
                                alt={selectedPost.title}
                                src={selectedPost.image}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <div style={{
                            background: '#f8fafc',
                            borderLeft: '4px solid #3b82f6',
                            padding: '14px 18px',
                            borderRadius: '0 8px 8px 0',
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#334155',
                            lineHeight: 1.6,
                            marginBottom: 24
                        }}>
                            {selectedPost.summary}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {selectedPost.content.map((paragraph, idx) => (
                                <div key={idx} style={{ fontSize: 15, color: '#334155', lineHeight: 1.8 }}>
                                    <p style={{ margin: 0 }}>
                                        {paragraph}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Divider style={{ margin: '24px 0 16px 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: '#94a3b8' }}>
                                Cảm ơn bạn đã đọc bài viết từ JobHunter.
                            </span>
                            <Button
                                type="primary"
                                onClick={() => setSelectedPost(null)}
                                style={{ background: '#2563eb', borderRadius: 8, fontWeight: 600 }}
                            >
                                Đóng bài viết
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CareerBlog;

