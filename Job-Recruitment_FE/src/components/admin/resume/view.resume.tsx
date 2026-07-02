import { callUpdateResumeStatus, callGetAIMatchResume } from "@/config/api";
import { IResume } from "@/types/backend";
import { Badge, Button, Descriptions, Drawer, Form, Select, message, notification, Progress, Alert, Spin } from "antd";
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { withBackendUrl } from "@/config/runtime";
const { Option } = Select;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IResume | null | any;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}
const ViewDetailResume = (props: IProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [isAILoading, setIsAILoading] = useState<boolean>(false);
    const [aiMatch, setAiMatch] = useState<any>(null);
    const { onClose, open, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();

    const handleAIMatch = async () => {
        setIsAILoading(true);
        const res = await callGetAIMatchResume(dataInit?.id);
        if (res.data) {
            setAiMatch(res.data);
            message.success("Phân tích CV bằng AI thành công!");
        } else {
            notification.error({
                message: 'Có lỗi xảy ra khi phân tích bằng AI',
                description: res.message
            });
        }
        setIsAILoading(false);
    }

    const handleChangeStatus = async () => {
        setIsSubmit(true);

        const status = form.getFieldValue('status');
        const res = await callUpdateResumeStatus(dataInit?.id, status)
        if (res.data) {
            message.success("Update Resume status thành công!");
            setDataInit(null);
            onClose(false);
            reloadTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }

        setIsSubmit(false);
    }

    useEffect(() => {
        if (dataInit) {
            form.setFieldValue("status", dataInit.status);
            setAiMatch(null);
        }
        return () => form.resetFields();
    }, [dataInit])

    return (
        <>
            <Drawer
                title="Thông Tin Resume"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
                destroyOnClose
                extra={

                    <Button loading={isSubmit} type="primary" onClick={handleChangeStatus}>
                        Change Status
                    </Button>

                }
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Email">{dataInit?.email}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Form
                            form={form}
                        >
                            <Form.Item name={"status"}>
                                <Select
                                    // placeholder="Select a option and change input text above"
                                    // onChange={onGenderChange}
                                    // allowClear
                                    style={{ width: "100%" }}
                                    defaultValue={dataInit?.status}
                                >
                                    <Option value="PENDING">PENDING</Option>
                                    <Option value="REVIEWING">REVIEWING</Option>
                                    <Option value="APPROVED">APPROVED</Option>
                                    <Option value="REJECTED">REJECTED</Option>
                                </Select>
                            </Form.Item>
                        </Form>

                    </Descriptions.Item>
                    <Descriptions.Item label="Tên Job">
                        {dataInit?.job?.name}

                    </Descriptions.Item>
                    <Descriptions.Item label="Tên Công Ty">
                        {dataInit?.companyName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="File CV" span={2}>
                        {dataInit?.url ? (
                            <a 
                                href={withBackendUrl(`/storage/resume/${dataInit.url}`)} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{ fontWeight: 600, color: '#1890ff' }}
                            >
                                Xem / Tải xuống CV ứng viên
                            </a>
                        ) : (
                            <span style={{ color: '#d9d9d9' }}>Không có file CV</span>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="AI Match Score (Beta)" span={2}>
                        {!aiMatch ? (
                            <Button type="primary" ghost loading={isAILoading} onClick={handleAIMatch}>
                                Đánh giá mức độ phù hợp với Job (AI)
                            </Button>
                        ) : (
                            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                                <Progress 
                                    type="circle" 
                                    percent={aiMatch.score} 
                                    strokeColor={aiMatch.score >= 70 ? '#52c41a' : aiMatch.score >= 40 ? '#faad14' : '#ff4d4f'}
                                    format={percent => <span style={{fontSize: 20, fontWeight: 'bold'}}>{percent}%</span>}
                                    size={80}
                                />
                                <Alert 
                                    message="AI Nhận xét" 
                                    description={aiMatch.reasoning} 
                                    type={aiMatch.score >= 70 ? 'success' : aiMatch.score >= 40 ? 'warning' : 'error'} 
                                    showIcon 
                                    style={{ flex: 1 }}
                                />
                                <Button type="default" onClick={handleAIMatch} loading={isAILoading}>Đánh giá lại</Button>
                            </div>
                        )}
                    </Descriptions.Item>

                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailResume;