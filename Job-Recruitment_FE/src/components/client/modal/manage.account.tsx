import { Modal, Table, Tabs, Form, Input, Row, Col, Select, Button, message, notification, Skeleton, Avatar, Tag, Typography, Space, Divider } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callFetchResumeByUser, callFetchUserById, callUpdateUser, callChangePassword, callFetchAllSkill, callFetchSubscriberSkills, callCreateSubscriber, callUpdateSubscriber, callFetchInterview, callCandidateRespondInterview } from "@/config/api";
import { withBackendUrl } from "@/config/runtime";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
    defaultKey?: string;
}

const { TextArea } = Input;
const { Text, Title } = Typography;

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'ACCEPTED': return { color: 'success', text: 'Đã đồng ý', bg: '#f6ffed', border: '#b7eb8f', textColor: '#389e0d' };
        case 'REJECTED': return { color: 'error', text: 'Đã từ chối', bg: '#fff1f0', border: '#ffa39e', textColor: '#cf1322' };
        case 'COMPLETED': return { color: 'blue', text: 'Hoàn thành', bg: '#e6f4ff', border: '#91caff', textColor: '#0958d9' };
        case 'CANCELLED': return { color: 'default', text: 'Đã hủy', bg: '#f5f5f5', border: '#d9d9d9', textColor: '#8c8c8c' };
        default: return { color: 'processing', text: 'Chờ xác nhận', bg: '#f0f5ff', border: '#adc6ff', textColor: '#2f54eb' };
    }
};

const UserInterviews = (props: any) => {
    const [listInterviews, setListInterviews] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [respondModal, setRespondModal] = useState<{ open: boolean; interview: any | null }>({ open: false, interview: null });
    const [candidateNote, setCandidateNote] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const fetchData = async () => {
        setIsFetching(true);
        const res = await callFetchInterview("current=1&pageSize=100");
        if (res && res.data) {
            setListInterviews(res.data.result || []);
        }
        setIsFetching(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRespond = async (status: 'ACCEPTED' | 'REJECTED') => {
        if (!respondModal.interview) return;
        setIsSubmitting(true);
        try {
            const res = await callCandidateRespondInterview({
                id: respondModal.interview.id,
                status,
                candidateNote: candidateNote || undefined
            });
            if (res && res.data) {
                message.success(status === 'ACCEPTED' ? 'Bạn đã đồng ý lịch phỏng vấn!' : 'Bạn đã từ chối lịch phỏng vấn.');
                setRespondModal({ open: false, interview: null });
                setCandidateNote('');
                fetchData();
            } else {
                notification.error({ message: 'Có lỗi xảy ra', description: res?.message || 'Vui lòng thử lại.' });
            }
        } catch (error: any) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: error?.response?.data?.message || error?.message || 'Không thể gửi phản hồi. Vui lòng thử lại sau.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendNote = async () => {
        if (!respondModal.interview || !candidateNote.trim()) {
            message.warning('Vui lòng nhập ghi chú/đề xuất trước khi gửi.');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await callCandidateRespondInterview({
                id: respondModal.interview.id,
                candidateNote: candidateNote.trim()
            });
            if (res && res.data) {
                message.success('Đã gửi ghi chú/đề xuất đến nhà tuyển dụng!');
                setRespondModal({ open: false, interview: null });
                setCandidateNote('');
                fetchData();
            } else {
                notification.error({ message: 'Có lỗi xảy ra', description: res?.message || 'Vui lòng thử lại.' });
            }
        } catch (error: any) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: error?.response?.data?.message || error?.message || 'Không thể gửi ghi chú. Vui lòng thử lại sau.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center" as const,
            render: (text: any, record: any, index: number) => index + 1
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            render: (text: string) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        },
        {
            title: 'Thời gian',
            dataIndex: 'interviewTime',
            render: (value: any) => dayjs(value).format('DD-MM-YYYY HH:mm')
        },
        {
            title: 'Địa điểm / Link',
            dataIndex: 'location',
            render: (text: string) => {
                if (text && (text.startsWith("http://") || text.startsWith("https://"))) {
                    return <a href={text} target="_blank" rel="noopener noreferrer" style={{ color: '#2f54eb' }}>{text}</a>;
                }
                return text;
            }
        },
        {
            title: 'Công việc',
            dataIndex: ['job', 'name']
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value: string) => {
                const info = getStatusInfo(value);
                return (
                    <span style={{
                        color: info.textColor,
                        fontWeight: 600,
                        background: info.bg,
                        border: `1px solid ${info.border}`,
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        whiteSpace: 'nowrap'
                    }}>
                        {info.text}
                    </span>
                );
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: any) => {
                const status = record?.status;
                const canRespond = status === 'SCHEDULED';
                return (
                    <Button
                        size="small"
                        type={canRespond ? "primary" : "default"}
                        onClick={() => {
                            setCandidateNote(record?.candidateNote || '');
                            setRespondModal({ open: true, interview: record });
                        }}
                    >
                        {canRespond ? 'Phản hồi' : 'Xem chi tiết'}
                    </Button>
                );
            }
        }
    ];

    const currentInterview = respondModal.interview;
    const canStillRespond = currentInterview?.status === 'SCHEDULED';

    return (
        <div style={{ padding: '16px 0' }}>
            <Table
                columns={columns}
                dataSource={listInterviews}
                loading={isFetching}
                pagination={false}
                rowKey="id"
                locale={{ emptyText: 'Bạn chưa có lịch phỏng vấn nào.' }}
            />

            {/* Modal phản hồi lịch phỏng vấn */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18, fontWeight: 700 }}>📅 Chi tiết lịch phỏng vấn</span>
                    </div>
                }
                open={respondModal.open}
                onCancel={() => { setRespondModal({ open: false, interview: null }); setCandidateNote(''); }}
                footer={null}
                width={600}
                destroyOnClose
            >
                {currentInterview && (
                    <div style={{ padding: '8px 0' }}>
                        <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>{currentInterview.title}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: 14 }}>
                                <div><span style={{ color: '#64748b' }}>📅 Thời gian:</span><br /><strong>{dayjs(currentInterview.interviewTime).format('DD/MM/YYYY HH:mm')}</strong></div>
                                <div><span style={{ color: '#64748b' }}>🏢 Công ty:</span><br /><strong>{currentInterview.job?.company?.name || 'N/A'}</strong></div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <span style={{ color: '#64748b' }}>📍 Địa điểm / Link:</span><br />
                                    {currentInterview.location?.startsWith('http') ?
                                        <a href={currentInterview.location} target="_blank" rel="noopener noreferrer" style={{ color: '#2f54eb', fontWeight: 600 }}>{currentInterview.location}</a>
                                        : <strong>{currentInterview.location}</strong>
                                    }
                                </div>
                                <div><span style={{ color: '#64748b' }}>💼 Vị trí:</span><br /><strong>{currentInterview.job?.name || 'N/A'}</strong></div>
                                <div>
                                    <span style={{ color: '#64748b' }}>Trạng thái:</span><br />
                                    <span style={{ ...(() => { const i = getStatusInfo(currentInterview.status); return { color: i.textColor, background: i.bg, border: `1px solid ${i.border}`, padding: '2px 10px', borderRadius: 6, fontWeight: 600, fontSize: 13 }; })() }}>
                                        {getStatusInfo(currentInterview.status).text}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Ghi chú hiện tại của ứng viên */}
                        {currentInterview.candidateNote && (
                            <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                                <div style={{ fontSize: 13, color: '#92400e', fontWeight: 600, marginBottom: 4 }}>💬 Ghi chú của bạn trước đó:</div>
                                <div style={{ color: '#78350f' }}>{currentInterview.candidateNote}</div>
                            </div>
                        )}

                        <Divider style={{ margin: '12px 0' }} />

                        {/* Ô ghi chú / đề xuất */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: 600, marginBottom: 8, color: '#374151' }}>
                                💬 Ghi chú / Đề xuất gửi đến nhà tuyển dụng:
                            </div>
                            <TextArea
                                rows={4}
                                placeholder="Ví dụ: Tôi muốn đổi sang khung giờ chiều, hoặc tôi bận trong ngày đó và muốn hỏi đổi ngày..."
                                value={candidateNote}
                                onChange={(e) => setCandidateNote(e.target.value)}
                                style={{ borderRadius: 8 }}
                            />
                        </div>

                        {canStillRespond ? (
                            <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button
                                    onClick={handleSendNote}
                                    loading={isSubmitting}
                                    disabled={!candidateNote.trim()}
                                    style={{ borderRadius: 8 }}
                                >
                                    📨 Chỉ gửi ghi chú
                                </Button>
                                <Button
                                    danger
                                    loading={isSubmitting}
                                    onClick={() => handleRespond('REJECTED')}
                                    style={{ borderRadius: 8 }}
                                >
                                    ❌ Từ chối lịch phỏng vấn
                                </Button>
                                <Button
                                    type="primary"
                                    loading={isSubmitting}
                                    onClick={() => handleRespond('ACCEPTED')}
                                    style={{ borderRadius: 8, background: '#22c55e', borderColor: '#22c55e' }}
                                >
                                    ✅ Đồng ý lịch phỏng vấn
                                </Button>
                            </Space>
                        ) : (
                            <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button
                                    onClick={handleSendNote}
                                    loading={isSubmitting}
                                    disabled={!candidateNote.trim()}
                                    style={{ borderRadius: 8 }}
                                >
                                    📨 Gửi ghi chú / Đề xuất
                                </Button>
                            </Space>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};


const UserProfileInfo = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const user = useAppSelector(state => state.account.user);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user.id) {
                setLoading(true);
                const res = await callFetchUserById(user.id);
                if (res && res.data) {
                    setProfile(res.data);
                }
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    if (loading) {
        return <Skeleton active style={{ padding: '20px 0' }} />;
    }

    if (!profile) {
        return <div style={{ padding: '20px 0' }}>Không tìm thấy thông tin tài khoản</div>;
    }

    return (
        <div style={{ padding: '20px 0' }}>
            <Row gutter={[24, 24]}>
                <Col span={24} md={8}>
                    <div style={{ 
                        background: '#f8fafc', 
                        padding: '32px 24px', 
                        borderRadius: '12px', 
                        textAlign: 'center', 
                        border: '1px solid #e2e8f0',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Avatar size={90} style={{ backgroundColor: '#3b82f6', fontSize: '36px', marginBottom: '16px', fontWeight: 600 }}>
                            {profile.name?.substring(0, 2)?.toUpperCase()}
                        </Avatar>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', margin: '0 0 6px 0' }}>{profile.name}</h3>
                        <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '14px' }}>{profile.email}</p>
                        <span style={{ 
                            background: '#eff6ff', 
                            color: '#1d4ed8', 
                            padding: '6px 16px', 
                            borderRadius: '9999px', 
                            fontSize: '13px', 
                            fontWeight: 600 
                        }}>
                            {profile.role?.name || 'USER'}
                        </span>
                    </div>
                </Col>
                <Col span={24} md={16}>
                    <div style={{ 
                        background: '#ffffff', 
                        padding: '24px', 
                        borderRadius: '12px', 
                        border: '1px solid #e2e8f0',
                        height: '100%'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                            Thông tin cá nhân
                        </h3>
                        <Row gutter={[20, 20]}>
                            <Col span={12}>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Họ và tên</div>
                                <div style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b' }}>{profile.name}</div>
                            </Col>
                            <Col span={12}>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Địa chỉ Email</div>
                                <div style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b' }}>{profile.email}</div>
                            </Col>
                            <Col span={12}>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Tuổi</div>
                                <div style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b' }}>{profile.age || 'Chưa cập nhật'}</div>
                            </Col>
                            <Col span={12}>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Giới tính</div>
                                <div style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b' }}>
                                    {profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : profile.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
                                </div>
                            </Col>
                            <Col span={24}>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Địa chỉ</div>
                                <div style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b' }}>{profile.address || 'Chưa cập nhật'}</div>
                            </Col>
                            {profile.company && (
                                <Col span={12}>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Doanh nghiệp</div>
                                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#2563eb' }}>{profile.company.name}</div>
                                </Col>
                            )}
                            <Col span={12}>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Ngày tham gia</div>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>
                                    {profile.createdAt ? dayjs(profile.createdAt).format('DD-MM-YYYY HH:mm:ss') : 'Chưa rõ'}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data.result as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công Ty',
            dataIndex: "companyName",

        },
        {
            title: 'Job title',
            dataIndex: ["job", "name"],

        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
        },
        {
            title: 'Ngày rải CV',
            dataIndex: "createdAt",
            render(value, record, index) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: '',
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a
                                    href={withBackendUrl(`/storage/resume/${record?.url}`)}
                        target="_blank"
                    >Chi tiết</a>
                )
            },
        },
    ];

    return (
        <div>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const UserUpdateInfo = (props: any) => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const user = useAppSelector(state => state.account.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const initUser = async () => {
            if (user && user.id) {
                const res = await callFetchUserById(user.id);
                if (res && res.data) {
                    form.setFieldsValue({
                        id: res.data.id,
                        email: res.data.email,
                        name: res.data.name,
                        age: res.data.age,
                        gender: res.data.gender,
                        address: res.data.address
                    });
                }
            }
        }
        initUser();
    }, [user])

    const onFinish = async (values: any) => {
        const { id, name, email, age, gender, address } = values;
        setIsSubmit(true);
        const res = await callUpdateUser({
            id, name, email, age: +age, gender, address
        } as any);
        setIsSubmit(false);

        if (res && res.data) {
            message.success("Cập nhật thông tin thành công!");
            dispatch(setUserLoginInfo({
                id: res.data.id,
                email: res.data.email,
                name: res.data.name,
                role: user.role
            }));
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    }

    return (
        <div style={{ padding: '20px 0' }}>
            <Form
                form={form}
                name="user-update-info"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item name="id" hidden>
                    <Input />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Tên hiển thị không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Tuổi"
                            name="age"
                            rules={[{ required: true, message: 'Tuổi không được để trống!' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        >
                            <Select
                                options={[
                                    { value: 'MALE', label: 'Nam' },
                                    { value: 'FEMALE', label: 'Nữ' },
                                    { value: 'OTHER', label: 'Khác' }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const UserChangePassword = () => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: any) => {
        const { oldPassword, newPassword } = values;
        setIsSubmit(true);
        const res = await callChangePassword(oldPassword, newPassword);
        setIsSubmit(false);

        if (res && res.statusCode === 200) {
            message.success("Thay đổi mật khẩu thành công!");
            form.resetFields();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            });
        }
    }

    return (
        <div style={{ padding: '20px 0', maxWidth: 400 }}>
            <Form
                form={form}
                name="user-change-password"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                        Xác nhận đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const UserSkills = () => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const [optionsSkills, setOptionsSkills] = useState<{ label: string; value: string }[]>([]);
    const [subscriberId, setSubscriberId] = useState<number | null>(null);
    const user = useAppSelector(state => state.account.user);

    useEffect(() => {
        const initSkills = async () => {
            const resSkills = await callFetchAllSkill(`page=1&size=100&sort=createdAt,desc`);
            if (resSkills && resSkills.data) {
                const arr = resSkills.data.result.map(item => ({
                    label: item.name as string,
                    value: item.id + "" as string
                })) ?? [];
                setOptionsSkills(arr);
            }

            if (user && user.email) {
                const resSub = await callFetchSubscriberSkills();
                if (resSub && resSub.data) {
                    setSubscriberId(resSub.data.id);
                    const userSkills = resSub.data.skills?.map((item: any) => item.id + "") ?? [];
                    form.setFieldsValue({
                        skills: userSkills
                    });
                }
            }
        };
        initSkills();
    }, [user]);

    const onFinish = async (values: any) => {
        const { skills } = values;
        const skillsBody = skills?.map((id: string) => ({ id: +id })) ?? [];
        setIsSubmit(true);
        
        let res;
        if (subscriberId) {
            res = await callUpdateSubscriber(subscriberId, skillsBody);
        } else {
            res = await callCreateSubscriber(user.name, user.email, skillsBody);
            if (res && res.data) {
                setSubscriberId(res.data.id);
            }
        }
        setIsSubmit(false);

        if ((res && res.statusCode === 200) || (res && res.statusCode === 201)) {
            message.success("Đăng ký nhận email thông báo việc làm thành công!");
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            });
        }
    };

    return (
        <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
                    Đăng ký nhận email thông tin việc làm mới
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                    Hệ thống sẽ tự động tìm kiếm các công việc phù hợp với kỹ năng bạn đã chọn và gửi email thông báo định kỳ đến bạn.
                </p>
            </div>
            <Form
                form={form}
                name="user-skills-registration"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Kỹ năng của bạn"
                    name="skills"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một kỹ năng!' }]}
                >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Chọn các kỹ năng bạn có thế mạnh (Java, React, Python...)"
                        options={optionsSkills}
                        allowClear
                    />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                        Lưu thông tin đăng ký
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const ManageAccount = (props: IProps) => {
    const { open, onClose, defaultKey } = props;
    const [activeKey, setActiveKey] = useState<string>("user-profile");

    useEffect(() => {
        if (defaultKey) {
            setActiveKey(defaultKey);
        }
    }, [defaultKey, open]);

    const onChange = (key: string) => {
        setActiveKey(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-profile',
            label: `Thông tin tài khoản`,
            children: <UserProfileInfo />,
        },
        {
            key: 'user-resume',
            label: `Rải CV`,
            children: <UserResume />,
        },
        {
            key: 'user-interview',
            label: `Lịch phỏng vấn`,
            children: <UserInterviews />,
        },
        {
            key: 'user-skills',
            label: `Nhận thông báo việc làm`,
            children: <UserSkills />,
        },
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: <UserChangePassword />,
        },
    ];


    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        activeKey={activeKey}
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )
}

export default ManageAccount;
