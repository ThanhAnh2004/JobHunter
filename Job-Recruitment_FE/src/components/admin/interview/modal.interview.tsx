import { Modal, Form, Input, Button, DatePicker, Select, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { callCreateInterview, callUpdateInterview, callFetchResume } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import dayjs from 'dayjs';

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

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue({
                ...dataInit,
                candidateId: dataInit.candidate?.id,
                jobId: dataInit.job?.id,
                interviewTime: dayjs(dataInit.interviewTime)
            });
        }
    }, [dataInit]);

    useEffect(() => {
        if (open) {
            loadCandidatesAndJobs();
        }
    }, [open]);

    const loadCandidatesAndJobs = async () => {
        // Fetch candidates (via resumes submitted to our company)
        const resResume = await callFetchResume("current=1&pageSize=100");
        if (resResume && resResume.data) {
            const listResumes = resResume.data.result || [];
            // Extract unique candidates
            const uniqueCandidatesMap = new Map();
            const jobMap: any = {};
            listResumes.forEach((item: any) => {
                if (item.user && item.job) {
                    uniqueCandidatesMap.set(item.user.id, {
                        id: item.user.id,
                        name: item.user.name,
                        email: item.email // Fix: use item.email (Resume email) instead of item.user.email
                    });
                    jobMap[item.user.id] = item.job.id;
                }
            });
            setCandidates(Array.from(uniqueCandidatesMap.values()));
            setCandidateJobMap(jobMap);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setDataInit(null);
        onClose();
    };

    const onFinish = async (values: any) => {
        setIsSubmit(true);
        const jobId = candidateJobMap[values.candidateId];
        
        if (!jobId && !dataInit?.id) {
            notification.error({
                message: 'Lỗi tạo lịch phỏng vấn',
                description: 'Không tìm thấy thông tin công việc ứng tuyển của ứng viên này. Vui lòng kiểm tra lại hồ sơ ứng tuyển.'
            });
            setIsSubmit(false);
            return;
        }

        const reqData = {
            ...values,
            jobId: jobId,
            interviewTime: values.interviewTime.toISOString()
        };

        if (dataInit?.id) {
            // Update
            const res = await callUpdateInterview({ ...reqData, id: dataInit.id });
            if (res && res.data) {
                message.success('Cập nhật lịch phỏng vấn thành công');
                handleCancel();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            // Create
            const res = await callCreateInterview(reqData);
            if (res && res.data) {
                message.success('Tạo lịch phỏng vấn thành công');
                handleCancel();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
        setIsSubmit(false);
    };

    return (
        <Modal
            title={dataInit?.id ? "Cập nhật Lịch phỏng vấn" : "Tạo Lịch phỏng vấn"}
            open={open}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose={true}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Thời gian"
                    name="interviewTime"
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
                >
                    <DatePicker showTime style={{ width: '100%' }} format="DD-MM-YYYY HH:mm" />
                </Form.Item>

                <Form.Item
                    label="Địa điểm / Link (Zoom/Meet)"
                    name="location"
                    rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
                >
                    <Input />
                </Form.Item>

                {!dataInit?.id && (
                    <>
                        <Form.Item
                            label="Ứng viên"
                            name="candidateId"
                            rules={[{ required: true, message: 'Vui lòng chọn ứng viên' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn ứng viên (đã nộp CV vào công ty)"
                                optionFilterProp="label"
                                options={candidates.map(c => ({
                                    value: c.id,
                                    label: `${c.name} (${c.email})`
                                }))}
                            />
                        </Form.Item>
                    </>
                )}

                {dataInit?.id && (
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select>
                            <Select.Option value="SCHEDULED">SCHEDULED</Select.Option>
                            <Select.Option value="COMPLETED">COMPLETED</Select.Option>
                            <Select.Option value="CANCELLED">CANCELLED</Select.Option>
                        </Select>
                    </Form.Item>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                        {dataInit?.id ? "Cập nhật" : "Tạo mới"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalInterview;
