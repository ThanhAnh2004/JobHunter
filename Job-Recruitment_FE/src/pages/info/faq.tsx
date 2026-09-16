import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Modal, Form, Input, message, notification, Spin, Collapse, Tag, Tabs } from 'antd';
import { QuestionCircleOutlined, EditOutlined, PlusOutlined, DeleteOutlined, UserOutlined, BankOutlined, BulbOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/redux/hooks';
import { callFetchSettingByKey, callUpdateSetting } from '@/config/api';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const DEFAULT_FAQ = {
    title: "Câu Hỏi Thường Gặp (FAQ)",
    subtitle: "Giải đáp nhanh các thắc mắc phổ biến của ứng viên và nhà tuyển dụng",
    faqs: [
        { category: "Dành cho Ứng viên", question: "Làm thế nào để ứng tuyển vào một vị trí trên JobHunter?", answer: "Bạn chỉ cần đăng nhập tài khoản, tìm kiếm công việc phù hợp và bấm nút 'Nộp CV' để tải lên hồ sơ của mình." },
        { category: "Dành cho Ứng viên", question: "Tôi có thể nhắn tin trực tiếp với Nhà tuyển dụng không?", answer: "Có, JobHunter hỗ trợ tính năng chat trực tiếp real-time với HR ngay trên trang tin tuyển dụng hoặc trang chi tiết công ty." },
        { category: "Dành cho Ứng viên", question: "Làm sao để biết khi nào có lịch phỏng vấn?", answer: "Hệ thống sẽ gửi thông báo real-time lên icon quả chuông, gửi email thông báo chi tiết và cập nhật trong mục 'Lịch phỏng vấn' ở trang tài khoản." },
        { category: "Dành cho Nhà tuyển dụng", question: "Làm thế nào để đặt lịch phỏng vấn cho ứng viên?", answer: "Tại trang Quản lý hồ sơ ứng viên (CV), bạn bấm vào icon lịch 'Đặt lịch phỏng vấn' tại hồ sơ mong muốn, chọn ngày giờ và gửi lời mời đến ứng viên." },
        { category: "Dành cho Nhà tuyển dụng", question: "Tôi có thể chỉnh sửa thông tin công ty sau khi tạo không?", answer: "Hoàn toàn được, HR có thể vào mục 'Hồ sơ doanh nghiệp' để cập nhật mô tả, logo, địa chỉ và quy mô bất kỳ lúc nào." }
    ]
};

const FaqPage: React.FC = () => {
    const user = useAppSelector(state => state.account.user);
    const isSuperAdmin = user?.email === 'admin@gmail.com' || user?.role?.name === 'SUPER_ADMIN';

    const [data, setData] = useState<any>(DEFAULT_FAQ);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState<string>('ALL');

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await callFetchSettingByKey('PAGE_FAQ');
            if (res && res.data && res.data.value) {
                try {
                    const parsed = JSON.parse(res.data.value);
                    setData(parsed);
                } catch {
                    // Fallback
                }
            }
        } catch (e) {
            console.error("Failed to load FAQ content:", e);
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
            faqs: data.faqs || []
        });
        setIsModalOpen(true);
    };

    const handleSave = async (values: any) => {
        setIsSubmitting(true);
        try {
            const payload = {
                title: values.title,
                subtitle: values.subtitle,
                faqs: values.faqs || []
            };

            const res = await callUpdateSetting('PAGE_FAQ', JSON.stringify(payload, null, 2), 'Nội dung trang Câu hỏi thường gặp');
            if (res) {
                message.success('Cập nhật Câu Hỏi Thường Gặp thành công!');
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

    const faqsList: any[] = data.faqs || [];
    const filteredFaqs = activeTab === 'ALL'
        ? faqsList
        : faqsList.filter(f => f.category?.toLowerCase()?.includes(activeTab.toLowerCase()));

    const collapseItems = filteredFaqs.map((faq, index) => ({
        key: String(index),
        label: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: '#1e293b' }}>
                    {faq.question}
                </span>
                {faq.category && (
                    <Tag color={faq.category.includes('Ứng viên') ? 'blue' : 'green'} style={{ borderRadius: 6 }}>
                        {faq.category}
                    </Tag>
                )}
            </div>
        ),
        children: (
            <Paragraph style={{ color: '#475569', fontSize: 14.5, lineHeight: 1.8, margin: 0 }}>
                {faq.answer}
            </Paragraph>
        )
    }));

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
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    borderRadius: 24,
                    padding: '50px 36px',
                    color: '#ffffff',
                    textAlign: 'center',
                    marginBottom: 36,
                    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
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
                            ✏️ Sửa FAQ (Admin)
                        </Button>
                    )}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'rgba(59, 130, 246, 0.2)',
                        padding: '6px 18px',
                        borderRadius: 30,
                        fontSize: 14,
                        fontWeight: 600,
                        marginBottom: 16,
                        color: '#60a5fa'
                    }}>
                        <QuestionCircleOutlined /> TRUNG TÂM TRỢ GIÚP & HỎI ĐÁP
                    </div>
                    <h1 style={{ fontSize: '34px', fontWeight: 800, color: '#ffffff', margin: '0 0 12px 0' }}>
                        {data.title}
                    </h1>
                    <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
                        {data.subtitle}
                    </p>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            { key: 'ALL', label: 'Tất cả câu hỏi' },
                            { key: 'Ứng viên', label: 'Dành cho Ứng viên', icon: <UserOutlined /> },
                            { key: 'tuyển dụng', label: 'Dành cho Nhà tuyển dụng', icon: <BankOutlined /> }
                        ]}
                    />
                </div>

                {/* FAQ List */}
                <Card style={{ borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <Collapse
                        items={collapseItems}
                        defaultActiveKey={['0', '1']}
                        size="large"
                        bordered={false}
                        style={{ background: 'transparent' }}
                    />
                </Card>
            </div>

            {/* Admin Edit Modal */}
            <Modal
                title="Chỉnh sửa Câu Hỏi Thường Gặp (Admin)"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
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
                    <Form.Item label="Tiêu đề phụ" name="subtitle" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.List name="faqs">
                        {(fields, { add, remove }) => (
                            <>
                                <div style={{ fontWeight: 600, marginBottom: 12, color: '#1e293b' }}>
                                    Danh sách câu hỏi & câu trả lời:
                                </div>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                            <span style={{ fontWeight: 600 }}>Câu hỏi #{name + 1}</span>
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)}>
                                                Xóa câu hỏi
                                            </Button>
                                        </div>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'category']}
                                            label="Phân loại (Ứng viên / Nhà tuyển dụng...)"
                                            rules={[{ required: true, message: 'Nhập phân loại' }]}
                                        >
                                            <Input placeholder="Dành cho Ứng viên hoặc Dành cho Nhà tuyển dụng" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'question']}
                                            label="Câu hỏi"
                                            rules={[{ required: true, message: 'Nhập câu hỏi' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'answer']}
                                            label="Câu trả lời"
                                            rules={[{ required: true, message: 'Nhập câu trả lời' }]}
                                        >
                                            <TextArea rows={3} />
                                        </Form.Item>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginBottom: 20 }}>
                                    Thêm câu hỏi mới
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

export default FaqPage;
