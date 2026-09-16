import React from 'react';
import { Modal, Collapse, Tag, Typography, Row, Col, Card } from 'antd';
import { 
    SafetyCertificateOutlined, 
    CheckCircleFilled, 
    BulbOutlined, 
    CodeOutlined, 
    SmileOutlined, 
    MessageOutlined 
} from '@ant-design/icons';

interface InterviewTipsModalProps {
    open: boolean;
    onClose: () => void;
}

const { Panel } = Collapse;

export const InterviewTipsModal: React.FC<InterviewTipsModalProps> = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={880}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18 }}>
                    <SafetyCertificateOutlined style={{ color: '#ea580c' }} />
                    <span>Bộ Cẩm Nang Bí Quyết Phỏng Vấn IT & Vượt Qua Technical Interview</span>
                </div>
            }
            bodyStyle={{ padding: '20px 24px' }}
        >
            <div style={{
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                border: '1px solid #fed7aa',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#9a3412', marginBottom: 4 }}>
                    <BulbOutlined /> Quy trình 4 bước chuẩn bị phỏng vấn công nghệ thành công
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#7c2d12', lineHeight: 1.6 }}>
                    Tổng hợp kinh nghiệm từ các Tech Lead và Chuyên gia HR hàng đầu để giúp bạn tự tin tỏa sáng và đạt mức offer cao nhất.
                </p>
            </div>

            <Collapse defaultActiveKey={['1', '2']} style={{ background: '#ffffff', borderRadius: 10 }}>
                <Panel
                    header={
                        <span style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CodeOutlined style={{ color: '#2563eb' }} /> 1. Vòng Phỏng Vấn Kỹ Thuật (Technical / Live Coding)
                        </span>
                    }
                    key="1"
                >
                    <ul style={{ paddingLeft: 20, color: '#475569', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
                        <li><strong>Giao tiếp khi viết code (Think out loud):</strong> Đừng im lặng khi làm bài test. Hãy nói rõ bạn đang nghĩ gì, cách tiếp cận thuật toán và các trường hợp biên (Edge cases).</li>
                        <li><strong>Nắm vững kiến trúc & bản chất:</strong> Không chỉ biết dùng framework, hãy hiểu rõ JVM memory model, JPA n+1 query, Async/Event loop trong Node, Virtual DOM trong React.</li>
                        <li><strong>System Design căn bản:</strong> Chuẩn bị kiến thức về Load Balancing, Database Sharding, Caching strategy (Redis), Message Queue (Kafka/RabbitMQ).</li>
                    </ul>
                </Panel>

                <Panel
                    header={
                        <span style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MessageOutlined style={{ color: '#16a34a' }} /> 2. Trả Lời Câu Hỏi Tình Huống Theo Mô Hình STAR
                        </span>
                    }
                    key="2"
                >
                    <div style={{ color: '#475569', fontSize: 13, lineHeight: 1.8 }}>
                        <p style={{ margin: '0 0 8px 0' }}>Khi gặp các câu hỏi dạng <em>"Hãy kể về một lần dự án bị sự cố nghiêm trọng và cách bạn xử lý?"</em>, hãy áp dụng công thức:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 10 }}>
                            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                                <strong style={{ color: '#2563eb' }}>S - Situation:</strong>
                                <p style={{ margin: 0, fontSize: 12 }}>Bối cảnh dự án, thời điểm và mức độ nghiêm trọng.</p>
                            </div>
                            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                                <strong style={{ color: '#16a34a' }}>T - Task:</strong>
                                <p style={{ margin: 0, fontSize: 12 }}>Nhiệm vụ cụ thể bạn cần phải thực hiện.</p>
                            </div>
                            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                                <strong style={{ color: '#ea580c' }}>A - Action:</strong>
                                <p style={{ margin: 0, fontSize: 12 }}>Hành động, giải pháp kỹ thuật bạn đã áp dụng.</p>
                            </div>
                            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                                <strong style={{ color: '#9333ea' }}>R - Result:</strong>
                                <p style={{ margin: 0, fontSize: 12 }}>Kết quả đo lường bằng con số cụ thể.</p>
                            </div>
                        </div>
                    </div>
                </Panel>

                <Panel
                    header={
                        <span style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <SmileOutlined style={{ color: '#9333ea' }} /> 3. Câu Hỏi Ngược Lại Cho Nhà Tuyển Dụng (Q&A)
                        </span>
                    }
                    key="3"
                >
                    <ul style={{ paddingLeft: 20, color: '#475569', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
                        <li><em>"Tech stack hiện tại của team đang có kế hoạch nâng cấp hoặc refactor gì trong 6 tháng tới không ạ?"</em></li>
                        <li><em>"Quy trình CI/CD và văn hóa Code Review trong team được vận hành như thế nào?"</em></li>
                        <li><em>"Mục tiêu quan trọng nhất của vị trí này trong 3 tháng đầu tiên là gì?"</em></li>
                    </ul>
                </Panel>
            </Collapse>
        </Modal>
    );
};

export default InterviewTipsModal;
