import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Modal, Form, Input, message, notification, Spin } from 'antd';
import { SafetyCertificateOutlined, EditOutlined, PlusOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/redux/hooks';
import { callFetchSettingByKey, callUpdateSetting } from '@/config/api';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const DEFAULT_PRIVACY = {
    title: "Chính Sách Bảo Mật",
    updatedAt: "16-09-2026",
    sections: [
        { heading: "1. Thông tin chúng tôi thu thập", content: "Chúng tôi chỉ thu thập các thông tin cần thiết như họ tên, email, số điện thoại, kinh nghiệm làm việc và CV để phục vụ mục đích kết nối tuyển dụng." },
        { heading: "2. Mục đích sử dụng thông tin", content: "Thông tin của bạn được sử dụng để kết nối ứng viên với nhà tuyển dụng phù hợp, gửi thông báo lịch phỏng vấn và cải thiện trải nghiệm người dùng." },
        { heading: "3. Bảo vệ dữ liệu cá nhân", content: "JobHunter áp dụng các tiêu chuẩn bảo mật mã hóa SSL/TLS hiện đại và xác thực JWT để đảm bảo thông tin cá nhân của bạn luôn được an toàn tuyệt đối." },
        { heading: "4. Chia sẻ dữ liệu với bên thứ ba", content: "Chúng tôi cam kết không bán, trao đổi hoặc tiết lộ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào ngoại trừ các nhà tuyển dụng mà bạn đã chủ động nộp hồ sơ." }
    ]
};

const PrivacyPage: React.FC = () => {
    const user = useAppSelector(state => state.account.user);
    const isSuperAdmin = user?.email === 'admin@gmail.com' || user?.role?.name === 'SUPER_ADMIN';

    const [data, setData] = useState<any>(DEFAULT_PRIVACY);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [form] = Form.useForm();

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await callFetchSettingByKey('PAGE_PRIVACY');
            if (res && res.data && res.data.value) {
                try {
                    const parsed = JSON.parse(res.data.value);
                    setData(parsed);
                } catch {
                    // Fallback
                }
            }
        } catch (e) {
            console.error("Failed to load privacy content:", e);
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
            updatedAt: data.updatedAt,
            sections: data.sections || []
        });
        setIsModalOpen(true);
    };

    const handleSave = async (values: any) => {
        setIsSubmitting(true);
        try {
            const payload = {
                title: values.title,
                updatedAt: values.updatedAt || new Date().toLocaleDateString('vi-VN'),
                sections: values.sections || []
            };

            const res = await callUpdateSetting('PAGE_PRIVACY', JSON.stringify(payload, null, 2), 'Nội dung trang Chính sách bảo mật');
            if (res) {
                message.success('Cập nhật Chính Sách Bảo Mật thành công!');
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
            <div style={{ maxWidth: 960, margin: '0 auto' }}>
                
                {/* Header */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: 20,
                    padding: '36px 32px',
                    border: '1px solid #e2e8f0',
                    marginBottom: 30,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    position: 'relative'
                }}>
                    {isSuperAdmin && (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleOpenEdit}
                            style={{
                                position: 'absolute',
                                top: 24,
                                right: 24,
                                background: '#10b981',
                                borderColor: '#10b981',
                                fontWeight: 600
                            }}
                        >
                            ✏️ Sửa chính sách (Admin)
                        </Button>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <SafetyCertificateOutlined style={{ fontSize: 28, color: '#10b981' }} />
                        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
                            {data.title}
                        </Title>
                    </div>
                    <Text style={{ color: '#64748b', fontSize: 14 }}>
                        Cập nhật lần cuối: <strong>{data.updatedAt}</strong>
                    </Text>
                    <Paragraph style={{ color: '#475569', fontSize: 15, marginTop: 12, lineHeight: 1.7 }}>
                        Sự riêng tư và an toàn dữ liệu của bạn là ưu tiên hàng đầu tại <strong>JobHunter</strong>. Tài liệu này mô tả chi tiết cách chúng tôi bảo vệ, lưu trữ và xử lý thông tin người dùng.
                    </Paragraph>
                </div>

                {/* Content Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {Array.isArray(data.sections) && data.sections.map((sec: any, idx: number) => (
                        <Card
                            key={idx}
                            style={{
                                borderRadius: 16,
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                            }}
                        >
                            <Title level={4} style={{ color: '#1e293b', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <LockOutlined style={{ color: '#10b981', fontSize: 18 }} />
                                {sec.heading}
                            </Title>
                            <Paragraph style={{ color: '#475569', fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                                {sec.content}
                            </Paragraph>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Admin Edit Modal */}
            <Modal
                title="Chỉnh sửa Chính Sách Bảo Mật (Admin)"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={780}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item label="Tiêu đề trang" name="title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Ngày cập nhật" name="updatedAt" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.List name="sections">
                        {(fields, { add, remove }) => (
                            <>
                                <div style={{ fontWeight: 600, marginBottom: 12, color: '#1e293b' }}>
                                    Các mục chính sách bảo mật:
                                </div>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                            <span style={{ fontWeight: 600 }}>Mục #{name + 1}</span>
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)}>
                                                Xóa mục
                                            </Button>
                                        </div>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'heading']}
                                            label="Tiêu đề mục"
                                            rules={[{ required: true, message: 'Nhập tiêu đề mục' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'content']}
                                            label="Nội dung chi tiết"
                                            rules={[{ required: true, message: 'Nhập nội dung mục' }]}
                                        >
                                            <TextArea rows={3} />
                                        </Form.Item>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginBottom: 20 }}>
                                    Thêm mục chính sách mới
                                </Button>
                            </>
                        )}
                    </Form.List>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                        <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={isSubmitting} style={{ background: '#10b981', borderColor: '#10b981' }}>
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default PrivacyPage;
