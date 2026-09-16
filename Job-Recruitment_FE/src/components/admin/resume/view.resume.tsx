import { callUpdateResumeStatus } from "@/config/api";
import { IResume } from "@/types/backend";
import { Button, Descriptions, Drawer, Form, Select, message, notification, Space } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
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
    onScheduleInterview?: (resume: IResume) => void;
}

const ViewDetailResume = (props: IProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { onClose, open, dataInit, setDataInit, reloadTable, onScheduleInterview } = props;
    const [form] = Form.useForm();

    const handleChangeStatus = async () => {
        setIsSubmit(true);

        const status = form.getFieldValue('status');
        const res = await callUpdateResumeStatus(dataInit?.id, status);
        if (res.data) {
            message.success("Cập nhật trạng thái Resume thành công!");
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
    };

    useEffect(() => {
        if (dataInit) {
            form.setFieldValue("status", dataInit.status);
        }
        return () => form.resetFields();
    }, [dataInit]);

    return (
        <>
            <Drawer
                title="Thông Tin Hồ Sơ Ứng Tuyển"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null); }}
                open={open}
                width={"40vw"}
                maskClosable={false}
                destroyOnClose
                extra={
                    <Space>
                        {onScheduleInterview && (
                            <Button
                                icon={<CalendarOutlined />}
                                style={{ background: '#10b981', color: '#fff', borderColor: '#10b981' }}
                                onClick={() => {
                                    if (dataInit) {
                                        onScheduleInterview(dataInit);
                                    }
                                }}
                            >
                                Đặt lịch phỏng vấn
                            </Button>
                        )}
                        <Button loading={isSubmit} type="primary" onClick={handleChangeStatus}>
                            Cập nhật trạng thái
                        </Button>
                    </Space>
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
                </Descriptions>
            </Drawer>
        </>
    );
};

export default ViewDetailResume;