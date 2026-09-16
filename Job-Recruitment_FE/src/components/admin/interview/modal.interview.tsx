import { Modal, Form, Input, Button, DatePicker, Select, message, notification, Row, Col, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { callCreateInterview, callUpdateInterview, callFetchResume } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import dayjs from 'dayjs';
import { CalendarOutlined, LinkOutlined, UserOutlined, SolutionOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface IProps {
    open: boolean;
    onClose: () => void;
    dataInit: any;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalInterview = (props: IProps) => {
    const { open, onClose, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const user = useAppSelector(state => state.account.user);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [candidateJobMap, setCandidateJobMap] = useState<any>({});
    const [candidateJobDetails, setCandidateJobDetails] = useState<any>({});

    useEffect(() => {
        if (open) {
            loadCandidatesAndJobs();
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;

        if (dataInit?.id) {
            // Edit existing interview
            form.setFieldsValue({
                ...dataInit,
                candidateId: dataInit.candidate?.id,
                jobId: dataInit.job?.id,
                interviewTime: dataInit.interviewTime ? dayjs(dataInit.interviewTime) : null,
                location: dataInit.location,
                title: dataInit.title,
                status: dataInit.status || 'SCHEDULED'
            });
        } else if (dataInit?.candidateId) {
            // Pre-fill from resume
            const candidateId = dataInit.candidateId;
            const jobId = dataInit.jobId;
            const candidateName = dataInit.candidateName || '';
            const jobName = dataInit.jobName || '';
            const title = dataInit.title || (jobName && candidateName ? `Phỏng vấn vị trí ${jobName} - Ứng viên ${candidateName}` : '');

            form.setFieldsValue({
                candidateId: candidateId,
                jobId: jobId,
                title: title,
                location: dataInit.location || '',
                interviewTime: dataInit.interviewTime ? dayjs(dataInit.interviewTime) : null
            });

            // Ensure candidate is present in candidates list
            setCandidates(prev => {
                if (!prev.some(c => c.id === candidateId)) {
                    return [{
                        id: candidateId,
                        name: candidateName,
                        email: dataInit.candidateEmail || ''
                    }, ...prev];
                }
                return prev;
            });

            if (jobId) {
                setCandidateJobMap((prev: any) => ({ ...prev, [candidateId]: jobId }));
                setCandidateJobDetails((prev: any) => ({ ...prev, [candidateId]: { id: jobId, name: jobName } }));
            }
        } else {
            form.resetFields();
        }
    }, [dataInit, open]);

    const loadCandidatesAndJobs = async () => {
        try {
            // Fetch candidates via resumes submitted to our company
            const resResume = await callFetchResume("current=1&pageSize=100");
            if (resResume && resResume.data) {
                const listResumes = resResume.data.result || [];
                const uniqueCandidatesMap = new Map();
                const jobMap: any = {};
                const jobDetailsMap: any = {};

                listResumes.forEach((item: any) => {
                    const candId = item.user?.id || item.userId;
                    const candName = item.user?.name || item.email;
                    const candEmail = item.email || item.user?.email;
                    const jId = item.job?.id || (typeof item.jobId === 'object' ? item.jobId?.id : item.jobId);
                    const jName = item.job?.name || (typeof item.jobId === 'object' ? item.jobId?.name : '');

                    if (candId) {
                        uniqueCandidatesMap.set(candId, {
                            id: candId,
                            name: candName,
                            email: candEmail
                        });
                        if (jId) {
                            jobMap[candId] = jId;
                            jobDetailsMap[candId] = { id: jId, name: jName };
                        }
                    }
                });

                // If dataInit already has candidate info, merge it
                if (dataInit?.candidateId && !uniqueCandidatesMap.has(dataInit.candidateId)) {
                    uniqueCandidatesMap.set(dataInit.candidateId, {
                        id: dataInit.candidateId,
                        name: dataInit.candidateName || 'Ứng viên',
                        email: dataInit.candidateEmail || ''
                    });
                    if (dataInit.jobId) {
                        jobMap[dataInit.candidateId] = dataInit.jobId;
                        jobDetailsMap[dataInit.candidateId] = { id: dataInit.jobId, name: dataInit.jobName || '' };
                    }
                }

                setCandidates(Array.from(uniqueCandidatesMap.values()));
                setCandidateJobMap((prev: any) => ({ ...prev, ...jobMap }));
                setCandidateJobDetails((prev: any) => ({ ...prev, ...jobDetailsMap }));
            }
        } catch (error) {
            console.error("Failed to load candidates and jobs:", error);
        }
    };

    const handleCandidateChange = (selectedCandidateId: any) => {
        const cand = candidates.find(c => c.id === selectedCandidateId);
        const job = candidateJobDetails[selectedCandidateId];
        const jId = candidateJobMap[selectedCandidateId];

        if (jId) {
            form.setFieldValue('jobId', jId);
        }
        if (cand && job?.name) {
            const currentTitle = form.getFieldValue('title');
            if (!currentTitle || currentTitle.startsWith('Phỏng vấn')) {
                form.setFieldValue('title', `Phỏng vấn vị trí ${job.name} - Ứng viên ${cand.name}`);
            }
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setDataInit(null);
        onClose();
    };

    const onFinish = async (values: any) => {
        setIsSubmit(true);
        const candidateId = values.candidateId || dataInit?.candidateId;
        const jobId = values.jobId || candidateJobMap[candidateId] || dataInit?.jobId;

        if (!jobId && !dataInit?.id) {
            notification.error({
                message: 'Lỗi tạo lịch phỏng vấn',
                description: 'Không tìm thấy thông tin công việc ứng tuyển của ứng viên này. Vui lòng kiểm tra lại hồ sơ ứng tuyển.'
            });
            setIsSubmit(false);
            return;
        }

        const reqData = {
            title: values.title,
            location: values.location,
            candidateId: candidateId,
            jobId: jobId,
            interviewTime: values.interviewTime ? values.interviewTime.toISOString() : undefined,
            status: values.status
        };

        if (dataInit?.id) {
            // Update existing interview
            const res = await callUpdateInterview({ ...reqData, id: dataInit.id });
            if (res && res.data) {
                message.success('Cập nhật lịch phỏng vấn thành công!');
                handleCancel();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res?.message || 'Không thể cập nhật lịch phỏng vấn.'
                });
            }
        } else {
            // Create new interview
            const res = await callCreateInterview(reqData);
            if (res && res.data) {
                message.success('Đặt lịch phỏng vấn thành công! Thông báo và email đã được gửi đến ứng viên.');
                handleCancel();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res?.message || 'Không thể tạo lịch phỏng vấn.'
                });
            }
        }
        setIsSubmit(false);
    };

    const selectedCandId = Form.useWatch('candidateId', form) || dataInit?.candidateId;
    const currentJobDetail = selectedCandId ? candidateJobDetails[selectedCandId] : null;

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
                    <CalendarOutlined style={{ color: '#2563eb' }} />
                    <span>{dataInit?.id ? "Cập nhật Lịch Phỏng Vấn" : "Đặt Lịch Phỏng Vấn Mới"}</span>
                </div>
            }
            open={open}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose={true}
            width={580}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: 16 }}
            >
                <Form.Item name="jobId" hidden>
                    <Input />
                </Form.Item>

                {!dataInit?.id && (
                    <Form.Item
                        label={
                            <span>
                                <UserOutlined style={{ marginRight: 6, color: '#2563eb' }} />
                                Ứng viên nhận lịch phỏng vấn
                            </span>
                        }
                        name="candidateId"
                        rules={[{ required: true, message: 'Vui lòng chọn ứng viên' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn ứng viên (đã nộp CV vào công ty)"
                            optionFilterProp="label"
                            onChange={handleCandidateChange}
                            options={candidates.map(c => ({
                                value: c.id,
                                label: `${c.name} (${c.email})`
                            }))}
                            size="large"
                        />
                    </Form.Item>
                )}

                {currentJobDetail?.name && !dataInit?.id && (
                    <div style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: 8,
                        padding: '8px 14px',
                        marginBottom: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 13,
                        color: '#1e40af'
                    }}>
                        <SolutionOutlined style={{ fontSize: 16 }} />
                        <span>Vị trí ứng tuyển: <strong>{currentJobDetail.name}</strong></span>
                    </div>
                )}

                <Form.Item
                    label="Tiêu đề buổi phỏng vấn"
                    name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề buổi phỏng vấn' }]}
                >
                    <Input placeholder="Ví dụ: Phỏng vấn vị trí Java Developer - Vòng 1" size="large" />
                </Form.Item>

                <Form.Item
                    label={
                        <span>
                            <CalendarOutlined style={{ marginRight: 6, color: '#2563eb' }} />
                            Thời gian phỏng vấn
                        </span>
                    }
                    name="interviewTime"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian phỏng vấn' }]}
                >
                    <DatePicker
                        showTime
                        style={{ width: '100%' }}
                        format="DD-MM-YYYY HH:mm"
                        placeholder="Chọn ngày và giờ phỏng vấn"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <span>
                            <LinkOutlined style={{ marginRight: 6, color: '#2563eb' }} />
                            Địa điểm / Link phỏng vấn trực tuyến (Google Meet / Zoom)
                        </span>
                    }
                    name="location"
                    rules={[{ required: true, message: 'Vui lòng nhập địa điểm hoặc đường link họp' }]}
                >
                    <Input
                        placeholder="Ví dụ: https://meet.google.com/xyz-abcd-efg hoặc Tầng 5, Tòa nhà ABC..."
                        size="large"
                    />
                </Form.Item>

                {dataInit?.id && (
                    <Form.Item
                        label="Trạng thái lịch phỏng vấn"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select size="large">
                            <Select.Option value="SCHEDULED">SCHEDULED (Chờ diễn ra / Chờ phản hồi)</Select.Option>
                            <Select.Option value="ACCEPTED">ACCEPTED (Ứng viên đồng ý)</Select.Option>
                            <Select.Option value="REJECTED">REJECTED (Ứng viên từ chối)</Select.Option>
                            <Select.Option value="COMPLETED">COMPLETED (Đã hoàn thành)</Select.Option>
                            <Select.Option value="CANCELLED">CANCELLED (Đã hủy)</Select.Option>
                        </Select>
                    </Form.Item>
                )}

                <div style={{
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: 8,
                    padding: '10px 14px',
                    marginBottom: 20,
                    fontSize: 12,
                    color: '#64748b',
                    lineHeight: 1.5
                }}>
                    💡 <strong>Lưu ý:</strong> Sau khi đặt lịch, hệ thống sẽ tự động gửi <strong>thông báo trực tiếp (In-App notification)</strong> và <strong>Email chi tiết</strong> tới ứng viên kèm đường dẫn / địa điểm phỏng vấn.
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <Button onClick={handleCancel} disabled={isSubmit} size="large">
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmit}
                        size="large"
                        style={{ background: '#2563eb', minWidth: 120 }}
                    >
                        {dataInit?.id ? "Lưu thay đổi" : "Đặt lịch & Gửi thông báo"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalInterview;
