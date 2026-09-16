import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Modal, Form, Input, message, notification, Spin } from 'antd';
import {
    RocketOutlined,
    EyeOutlined,
    HeartOutlined,
    CheckCircleFilled,
    EditOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
    TrophyOutlined,
    FireOutlined
} from '@ant-design/icons';
import { useAppSelector } from '@/redux/hooks';
import { callFetchSettingByKey, callUpdateSetting } from '@/config/api';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const DEFAULT_ABOUT = {
    title: "Về Chúng Tôi - JobHunter",
    subtitle: "Cầu nối vững chắc giữa nhân tài công nghệ và doanh nghiệp hàng đầu",
    story: "JobHunter được thành lập với sứ mệnh giải quyết bài toán tuyển dụng trong ngành CNTT tại Việt Nam. Chúng tôi tin rằng mỗi lập trình viên đều xứng đáng có một môi trường để bứt phá tiềm năng, và mỗi doanh nghiệp đều xứng đáng sở hữu những chiến binh công nghệ xuất sắc nhất.",
    mission: "Xây dựng hệ sinh thái tuyển dụng thông minh, minh bạch và hiệu quả nhất cho cộng đồng công nghệ thông tin.",
    vision: "Trở thành nền tảng việc làm IT số 1 tại Đông Nam Á, nơi mọi cơ hội nghề nghiệp đều được cá nhân hóa bằng công nghệ hiện đại.",
    values: ["Minh bạch & Tận tâm", "Đổi mới sáng tạo", "Đồng hành cùng phát triển", "Bảo mật & Tôn trọng"]
};

const AboutPage: React.FC = () => {
    const user = useAppSelector(state => state.account.user);
    const isSuperAdmin = user?.email === 'admin@gmail.com' || user?.role?.name === 'SUPER_ADMIN';

    const [data, setData] = useState<any>(DEFAULT_ABOUT);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [form] = Form.useForm();

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await callFetchSettingByKey('PAGE_ABOUT');
            if (res && res.data && res.data.value) {
                try {
                    const parsed = JSON.parse(res.data.value);
                    setData(parsed);
                } catch {
                    // If raw text
                    setData((prev: any) => ({ ...prev, story: res.data.value }));
                }
            }
        } catch (e) {
            console.error("Failed to load about page content:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleOpenEdit = () => {
        form.setFieldsValue({
            title: data.title,
            subtitle: data.subtitle,
            story: data.story,
            mission: data.mission,
            vision: data.vision,
            values: Array.isArray(data.values) ? data.values.join('\n') : data.values
        });
        setIsModalOpen(true);
    };

    const handleSave = async (values: any) => {
        setIsSubmitting(true);
        try {
            const valuesArr = typeof values.values === 'string'
                ? values.values.split('\n').map((v: string) => v.trim()).filter(Boolean)
                : values.values;

            const payload = {
                title: values.title,
                subtitle: values.subtitle,
                story: values.story,
                mission: values.mission,
                vision: values.vision,
                values: valuesArr
            };

            const res = await callUpdateSetting('PAGE_ABOUT', JSON.stringify(payload, null, 2), 'Nội dung trang Về chúng tôi');
            if (res) {
                message.success('Cập nhật nội dung trang Về Chúng Tôi thành công!');
                setData(payload);
                setIsModalOpen(false);
            }
        } catch (err: any) {
            notification.error({
                message: 'Lỗi cập nhật',
                description: err?.message || 'Không thể lưu thay đổi.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ background: '#f8fafc', minHeight: '80vh', padding: '40px 16px 80px 16px' }}>
            <div style={{ maxWidth: 1140, margin: '0 auto' }}>
                
                {/* Header Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
                    borderRadius: 24,
                    padding: '60px 40px',
                    color: '#ffffff',
                    textAlign: 'center',
                    marginBottom: 40,
                    boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)',
                    position: 'relative'
                }}>
                    {isSuperAdmin && (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleOpenEdit}
                            style={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                backdropFilter: 'blur(8px)',
                                fontWeight: 600,
                                color: '#ffffff'
                            }}
                        >
                            ✏️ Sửa nội dung (Admin)
                        </Button>
                    )}
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(255, 255, 255, 0.15)',
                        padding: '6px 18px',
                        borderRadius: 30,
                        fontSize: 14,
                        fontWeight: 600,
                        marginBottom: 16,
                        backdropFilter: 'blur(6px)'
                    }}>
                        🌟 NỀN TẢNG TUYỂN DỤNG CÔNG NGHỆ HÀNG ĐẦU
                    </div>
                    <h1 style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0' }}>
                        {data.title}
                    </h1>
                    <p style={{ fontSize: '18px', color: '#e0e7ff', maxWidth: 720, margin: '0 auto', lineHeight: 1.6 }}>
                        {data.subtitle}
                    </p>
                </div>

                {/* Main Story */}
                <Card style={{ borderRadius: 20, border: '1px solid #e2e8f0', marginBottom: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <Row gutter={[40, 30]} align="middle">
                        <Col xs={24} md={14}>
                            <Title level={3} style={{ color: '#0f172a', fontWeight: 700, marginBottom: 16 }}>
                                Câu chuyện của JobHunter
                            </Title>
                            <Paragraph style={{ fontSize: 16, color: '#475569', lineHeight: 1.8 }}>
                                {data.story}
                            </Paragraph>
                            <Paragraph style={{ fontSize: 16, color: '#475569', lineHeight: 1.8 }}>
                                Chúng tôi không ngừng cải tiến công nghệ, kết hợp hệ thống gợi ý thông minh và công cụ phỏng vấn trực tuyến để tối ưu hóa hành trình tuyển dụng cho cả ứng viên và doanh nghiệp.
                            </Paragraph>
                        </Col>
                        <Col xs={24} md={10}>
                            <div style={{
                                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                borderRadius: 16,
                                padding: '32px 24px',
                                border: '1px solid #bfdbfe'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                                    <TrophyOutlined style={{ fontSize: 32, color: '#2563eb' }} />
                                    <div>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: '#1e3a8a' }}>5,000+</div>
                                        <div style={{ color: '#64748b', fontSize: 13 }}>Việc làm IT đã kết nối</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                                    <TeamOutlined style={{ fontSize: 32, color: '#10b981' }} />
                                    <div>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: '#065f46' }}>10,000+</div>
                                        <div style={{ color: '#64748b', fontSize: 13 }}>Ứng viên công nghệ tài năng</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <FireOutlined style={{ fontSize: 32, color: '#f59e0b' }} />
                                    <div>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: '#92400e' }}>1,200+</div>
                                        <div style={{ color: '#64748b', fontSize: 13 }}>Doanh nghiệp & Startup đồng hành</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Sứ mệnh & Tầm nhìn */}
                <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
                    <Col xs={24} md={12}>
                        <Card style={{ height: '100%', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: 24 }}>
                                    <RocketOutlined />
                                </div>
                                <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
                                    Sứ mệnh
                                </Title>
                            </div>
                            <Paragraph style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>
                                {data.mission}
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card style={{ height: '100%', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: 24 }}>
                                    <EyeOutlined />
                                </div>
                                <Title level={4} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
                                    Tầm nhìn
                                </Title>
                            </div>
                            <Paragraph style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>
                                {data.vision}
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>

                {/* Giá trị cốt lõi */}
                <Card style={{ borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 30 }}>
                        <Title level={3} style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                            Giá Trị Cốt Lõi
                        </Title>
                        <Text style={{ color: '#64748b', fontSize: 15 }}>
                            Những nguyên tắc định hình văn hóa và sản phẩm của chúng tôi mỗi ngày
                        </Text>
                    </div>
                    <Row gutter={[20, 20]}>
                        {Array.isArray(data.values) && data.values.map((val: string, idx: number) => (
                            <Col xs={24} sm={12} md={6} key={idx}>
                                <div style={{
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 14,
                                    padding: '20px 16px',
                                    textAlign: 'center',
                                    transition: 'all 0.2s',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10
                                }}>
                                    <CheckCircleFilled style={{ color: '#2563eb', fontSize: 26 }} />
                                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 15 }}>
                                        {val}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </div>

            {/* Admin Edit Modal */}
            <Modal
                title="Chỉnh sửa nội dung trang Về Chúng Tôi (Admin)"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={700}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item label="Tiêu đề chính" name="title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Tiêu đề phụ (Subtitle)" name="subtitle" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Câu chuyện / Giới thiệu chi tiết" name="story" rules={[{ required: true }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Sứ mệnh" name="mission" rules={[{ required: true }]}>
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="Tầm nhìn" name="vision" rules={[{ required: true }]}>
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="Giá trị cốt lõi (Mỗi dòng một giá trị)" name="values" rules={[{ required: true }]}>
                        <TextArea rows={4} placeholder="Minh bạch & Tận tâm&#10;Đổi mới sáng tạo..." />
                    </Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={isSubmitting} style={{ background: '#2563eb' }}>
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default AboutPage;
