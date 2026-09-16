import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, message, notification, Row, Col, Typography, Divider, Spin } from 'antd';
import {
    SettingOutlined,
    SaveOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    FacebookOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    GithubOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    SafetyCertificateOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { callFetchAllSettings, callUpdateSetting } from '@/config/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const SiteSettingsPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [settings, setSettings] = useState<Record<string, string>>({});

    const [footerForm] = Form.useForm();
    const [aboutForm] = Form.useForm();
    const [termsForm] = Form.useForm();
    const [privacyForm] = Form.useForm();
    const [faqForm] = Form.useForm();

    const loadSettings = async () => {
        setLoading(true);
        try {
            const res = await callFetchAllSettings();
            if (res && res.data) {
                const map = res.data;
                setSettings(map);

                // Footer
                if (map['FOOTER_INFO']) {
                    try {
                        footerForm.setFieldsValue(JSON.parse(map['FOOTER_INFO']));
                    } catch { }
                }

                // About
                if (map['PAGE_ABOUT']) {
                    try {
                        const parsed = JSON.parse(map['PAGE_ABOUT']);
                        aboutForm.setFieldsValue({
                            ...parsed,
                            values: Array.isArray(parsed.values) ? parsed.values.join('\n') : parsed.values
                        });
                    } catch { }
                }

                // Terms
                if (map['PAGE_TERMS']) {
                    try {
                        termsForm.setFieldsValue(JSON.parse(map['PAGE_TERMS']));
                    } catch { }
                }

                // Privacy
                if (map['PAGE_PRIVACY']) {
                    try {
                        privacyForm.setFieldsValue(JSON.parse(map['PAGE_PRIVACY']));
                    } catch { }
                }

                // FAQ
                if (map['PAGE_FAQ']) {
                    try {
                        faqForm.setFieldsValue(JSON.parse(map['PAGE_FAQ']));
                    } catch { }
                }
            }
        } catch (e) {
            console.error("Failed to load settings:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSaveFooter = async (values: any) => {
        setSubmitting(true);
        try {
            const res = await callUpdateSetting('FOOTER_INFO', JSON.stringify(values, null, 2), 'Thông tin chân trang Footer');
            if (res) {
                message.success('Cập nhật thông tin Footer thành công!');
            }
        } catch (e: any) {
            notification.error({ message: 'Lỗi', description: e.message || 'Không thể lưu thông tin.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveAbout = async (values: any) => {
        setSubmitting(true);
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
                message.success('Cập nhật trang Về Chúng Tôi thành công!');
            }
        } catch (e: any) {
            notification.error({ message: 'Lỗi', description: e.message || 'Không thể lưu thông tin.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveTerms = async (values: any) => {
        setSubmitting(true);
        try {
            const res = await callUpdateSetting('PAGE_TERMS', JSON.stringify(values, null, 2), 'Nội dung trang Điều khoản dịch vụ');
            if (res) {
                message.success('Cập nhật Điều Khoản Dịch Vụ thành công!');
            }
        } catch (e: any) {
            notification.error({ message: 'Lỗi', description: e.message || 'Không thể lưu thông tin.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSavePrivacy = async (values: any) => {
        setSubmitting(true);
        try {
            const res = await callUpdateSetting('PAGE_PRIVACY', JSON.stringify(values, null, 2), 'Nội dung trang Chính sách bảo mật');
            if (res) {
                message.success('Cập nhật Chính Sách Bảo Mật thành công!');
            }
        } catch (e: any) {
            notification.error({ message: 'Lỗi', description: e.message || 'Không thể lưu thông tin.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveFaq = async (values: any) => {
        setSubmitting(true);
        try {
            const res = await callUpdateSetting('PAGE_FAQ', JSON.stringify(values, null, 2), 'Nội dung trang Câu hỏi thường gặp');
            if (res) {
                message.success('Cập nhật Câu Hỏi Thường Gặp (FAQ) thành công!');
            }
        } catch (e: any) {
            notification.error({ message: 'Lỗi', description: e.message || 'Không thể lưu thông tin.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    const tabItems = [
        {
            key: 'footer',
            label: (
                <span>
                    <SettingOutlined style={{ marginRight: 6 }} />
                    Chân Trang (Footer)
                </span>
            ),
            children: (
                <Card style={{ borderRadius: 16 }}>
                    <Form form={footerForm} layout="vertical" onFinish={handleSaveFooter}>
                        <Title level={4} style={{ color: '#0f172a', marginBottom: 20 }}>
                            Cấu hình thông tin Chân Trang (Footer)
                        </Title>
                        <Row gutter={[20, 16]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Đoạn giới thiệu ngắn về JobHunter"
                                    name="about"
                                    rules={[{ required: true, message: 'Nhập thông tin giới thiệu' }]}
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Địa chỉ trụ sở"
                                    name="address"
                                    rules={[{ required: true, message: 'Nhập địa chỉ' }]}
                                >
                                    <Input prefix={<EnvironmentOutlined style={{ color: '#2563eb' }} />} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Số điện thoại hotline"
                                    name="phone"
                                    rules={[{ required: true, message: 'Nhập số điện thoại' }]}
                                >
                                    <Input prefix={<PhoneOutlined style={{ color: '#2563eb' }} />} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Email liên hệ chính thức"
                                    name="email"
                                    rules={[{ required: true, message: 'Nhập email' }]}
                                >
                                    <Input prefix={<MailOutlined style={{ color: '#2563eb' }} />} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Dòng chữ bản quyền (Copyright)"
                                    name="copyright"
                                    rules={[{ required: true, message: 'Nhập bản quyền' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '16px 0' }} />
                        <Title level={5} style={{ color: '#1e293b', marginBottom: 16 }}>
                            Liên kết mạng xã hội
                        </Title>
                        <Row gutter={[20, 16]}>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Facebook URL" name="facebook">
                                    <Input prefix={<FacebookOutlined style={{ color: '#1877f2' }} />} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="Twitter (X) URL" name="twitter">
                                    <Input prefix={<TwitterOutlined style={{ color: '#1da1f2' }} />} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="LinkedIn URL" name="linkedin">
                                    <Input prefix={<LinkedinOutlined style={{ color: '#0a66c2' }} />} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Form.Item label="GitHub URL" name="github">
                                    <Input prefix={<GithubOutlined style={{ color: '#333' }} />} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting} size="large" style={{ background: '#2563eb' }}>
                                Lưu cấu hình Footer
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )
        },
        {
            key: 'about',
            label: (
                <span>
                    <InfoCircleOutlined style={{ marginRight: 6 }} />
                    Trang Về Chúng Tôi
                </span>
            ),
            children: (
                <Card style={{ borderRadius: 16 }}>
                    <Form form={aboutForm} layout="vertical" onFinish={handleSaveAbout}>
                        <Title level={4} style={{ color: '#0f172a', marginBottom: 20 }}>
                            Quản lý nội dung trang Về Chúng Tôi (/about)
                        </Title>
                        <Form.Item label="Tiêu đề trang" name="title" rules={[{ required: true }]}>
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
                        <Form.Item label="Giá trị cốt lõi (Mỗi dòng một mục)" name="values" rules={[{ required: true }]}>
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting} size="large" style={{ background: '#2563eb' }}>
                                Lưu trang Về Chúng Tôi
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )
        },
        {
            key: 'terms',
            label: (
                <span>
                    <FileTextOutlined style={{ marginRight: 6 }} />
                    Điều Khoản Dịch Vụ
                </span>
            ),
            children: (
                <Card style={{ borderRadius: 16 }}>
                    <Form form={termsForm} layout="vertical" onFinish={handleSaveTerms}>
                        <Title level={4} style={{ color: '#0f172a', marginBottom: 20 }}>
                            Quản lý nội dung trang Điều Khoản Dịch Vụ (/terms)
                        </Title>
                        <Form.Item label="Tiêu đề trang" name="title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Ngày cập nhật" name="updatedAt" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.List name="sections">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                <span style={{ fontWeight: 600 }}>Mục #{name + 1}</span>
                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)}>
                                                    Xóa mục
                                                </Button>
                                            </div>
                                            <Form.Item {...restField} name={[name, 'heading']} label="Tiêu đề mục" rules={[{ required: true }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'content']} label="Nội dung" rules={[{ required: true }]}>
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
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting} size="large" style={{ background: '#2563eb' }}>
                                Lưu trang Điều Khoản
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )
        },
        {
            key: 'privacy',
            label: (
                <span>
                    <SafetyCertificateOutlined style={{ marginRight: 6 }} />
                    Chính Sách Bảo Mật
                </span>
            ),
            children: (
                <Card style={{ borderRadius: 16 }}>
                    <Form form={privacyForm} layout="vertical" onFinish={handleSavePrivacy}>
                        <Title level={4} style={{ color: '#0f172a', marginBottom: 20 }}>
                            Quản lý nội dung trang Chính Sách Bảo Mật (/privacy)
                        </Title>
                        <Form.Item label="Tiêu đề trang" name="title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Ngày cập nhật" name="updatedAt" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.List name="sections">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                <span style={{ fontWeight: 600 }}>Mục #{name + 1}</span>
                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)}>
                                                    Xóa mục
                                                </Button>
                                            </div>
                                            <Form.Item {...restField} name={[name, 'heading']} label="Tiêu đề mục" rules={[{ required: true }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'content']} label="Nội dung" rules={[{ required: true }]}>
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
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting} size="large" style={{ background: '#10b981', borderColor: '#10b981' }}>
                                Lưu trang Chính Sách
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )
        },
        {
            key: 'faq',
            label: (
                <span>
                    <QuestionCircleOutlined style={{ marginRight: 6 }} />
                    Câu Hỏi Thường Gặp (FAQ)
                </span>
            ),
            children: (
                <Card style={{ borderRadius: 16 }}>
                    <Form form={faqForm} layout="vertical" onFinish={handleSaveFaq}>
                        <Title level={4} style={{ color: '#0f172a', marginBottom: 20 }}>
                            Quản lý nội dung trang Câu Hỏi Thường Gặp (/faq)
                        </Title>
                        <Form.Item label="Tiêu đề trang" name="title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Tiêu đề phụ" name="subtitle" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.List name="faqs">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                <span style={{ fontWeight: 600 }}>Câu hỏi #{name + 1}</span>
                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)}>
                                                    Xóa câu hỏi
                                                </Button>
                                            </div>
                                            <Form.Item {...restField} name={[name, 'category']} label="Phân loại" rules={[{ required: true }]}>
                                                <Input placeholder="Dành cho Ứng viên hoặc Dành cho Nhà tuyển dụng" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'question']} label="Câu hỏi" rules={[{ required: true }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'answer']} label="Câu trả lời" rules={[{ required: true }]}>
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
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting} size="large" style={{ background: '#2563eb' }}>
                                Lưu trang FAQ
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                        Quản Lý Thông Tin Chân Trang & Nội Dung Trang
                    </h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
                        Chỉ có tài khoản Quản trị viên (Super Admin) mới có quyền chỉnh sửa các thông tin này.
                    </p>
                </div>
            </div>

            <Tabs
                defaultActiveKey="footer"
                items={tabItems}
                type="card"
                size="large"
            />
        </div>
    );
};

export default SiteSettingsPage;
