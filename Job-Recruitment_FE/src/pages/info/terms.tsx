import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Modal, Form, Input, message, notification, Spin, Divider } from 'antd';
import { FileTextOutlined, EditOutlined, PlusOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/redux/hooks';
import { callFetchSettingByKey, callUpdateSetting } from '@/config/api';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const DEFAULT_TERMS = {
    title: "Điều Khoản Dịch Vụ",
    updatedAt: "16-09-2026",
    sections: [
        { heading: "1. Chấp thuận điều khoản", content: "Bằng việc truy cập và sử dụng dịch vụ trên nền tảng JobHunter, bạn đồng ý tuân thủ toàn bộ các điều khoản và điều kiện được nêu tại đây." },
        { heading: "2. Tài khoản người dùng", content: "Người dùng chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình. Mọi hoạt động phát sinh dưới tài khoản của bạn sẽ thuộc trách nhiệm cá nhân của bạn." },
        { heading: "3. Quy định dành cho Nhà tuyển dụng", content: "Tin tuyển dụng đăng tải phải chính xác, không vi phạm pháp luật và không có nội dung phân biệt đối xử hay gian lận tuyển dụng." },
        { heading: "4. Quy định dành cho Ứng viên", content: "Hồ sơ ứng tuyển và CV gửi qua hệ thống phải phản ánh trung thực năng lực và kinh nghiệm làm việc thực tế." },
        { heading: "5. Quyền sở hữu trí tuệ", content: "Mọi thương hiệu, biểu trưng và nội dung thuộc sở hữu của JobHunter hoặc bên cấp phép đều được bảo vệ bởi luật sở hữu trí tuệ." }
    ]
};

const TermsPage: React.FC = () => {
    const user = useAppSelector(state => state.account.user);
    const isSuperAdmin = user?.email === 'admin@gmail.com' || user?.role?.name === 'SUPER_ADMIN';

    const [data, setData] = useState<any>(DEFAULT_TERMS);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [form] = Form.useForm();

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await callFetchSettingByKey('PAGE_TERMS');
            if (res && res.data && res.data.value) {
                try {
                    const parsed = JSON.parse(res.data.value);
                    setData(parsed);
                } catch {
                    // Fallback
                }
            }
        } catch (e) {
            console.error("Failed to load terms content:", e);
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

            const res = await callUpdateSetting('PAGE_TERMS', JSON.stringify(payload, null, 2), 'Nội dung trang Điều khoản dịch vụ');
            if (res) {
                message.success('Cập nhật Điều Khoản Dịch Vụ thành công!');
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
                                background: '#2563eb',
                                fontWeight: 600
                            }}
                        >
                            ✏️ Sửa điều khoản (Admin)
                        </Button>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <FileTextOutlined style={{ fontSize: 28, color: '#2563eb' }} />
                        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
                            {data.title}
                        </Title>
                    </div>
                    <Text style={{ color: '#64748b', fontSize: 14 }}>
                        Cập nhật lần cuối: <strong>{data.updatedAt}</strong>
                    </Text>
                    <Paragraph style={{ color: '#475569', fontSize: 15, marginTop: 12, lineHeight: 1.7 }}>
                        Chào mừng bạn đến với <strong>JobHunter</strong>. Khi đăng ký tài khoản hoặc sử dụng bất kỳ dịch vụ nào trên hệ thống của chúng tôi, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý với các điều khoản dưới đây.
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
                                <CheckCircleOutlined style={{ color: '#2563eb', fontSize: 18 }} />
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
                title="Chỉnh sửa Điều Khoản Dịch Vụ (Admin)"
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
                                    Các mục điều khoản:
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
                                    Thêm mục điều khoản mới
                                </Button>
                            </>
                        )}
                    </Form.List>

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

export default TermsPage;
