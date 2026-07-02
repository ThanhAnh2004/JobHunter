import { useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, ConfigProvider, Divider, Modal, Row, Upload, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import enUS from 'antd/lib/locale/en_US';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { callCreateResume, callUploadSingleFile } from "@/config/api";
import { useState } from 'react';
import type { UploadFile } from "antd/es/upload/interface";

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    jobDetail: IJob | null;
}

const ApplyModal = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, jobDetail } = props;
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [urlCV, setUrlCV] = useState<string>("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleOkButton = async () => {
        if (!isAuthenticated) {
            setIsModalOpen(false);
            navigate(`/login?callback=${window.location.href}`)
            return;
        }

        // Upload only on submit to avoid orphan files
        if (fileList.length === 0) {
            message.error("Vui lòng chọn CV!");
            return;
        }

        if (!jobDetail?.id) {
            message.error("Không tìm thấy job. Vui lòng tải lại trang.");
            return;
        }

        const jobIdNum = Number(jobDetail.id);
        const userIdNum = Number(user.id);
        if (!Number.isFinite(jobIdNum) || jobIdNum <= 0) {
            message.error("Job id không hợp lệ. Vui lòng tải lại trang.");
            return;
        }
        if (!Number.isFinite(userIdNum) || userIdNum <= 0) {
            message.error("User id không hợp lệ. Vui lòng đăng nhập lại.");
            return;
        }

        const rawFile = fileList[0]?.originFileObj as File | undefined;
        if (!rawFile) {
            message.error("File CV không hợp lệ. Vui lòng chọn lại.");
            return;
        }

        setIsSubmitting(true);
        try {
            const uploadRes = await callUploadSingleFile(rawFile, "resume");
            if (!uploadRes?.data?.fileName) {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: uploadRes?.message ?? "Upload CV thất bại."
                });
                return;
            }

            const uploadedFileName = uploadRes.data.fileName;
            setUrlCV(uploadedFileName);

            const res = await callCreateResume(uploadedFileName, jobIdNum, user.email, userIdNum);
            if (res?.data) {
                message.success("Rải CV thành công!");
                setIsModalOpen(false);
                setFileList([]);
                setUrlCV("");
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res?.message ?? "Tạo resume thất bại."
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const propsUpload: UploadProps = {
        maxCount: 1,
        multiple: false,
        accept: "application/pdf,application/msword, .doc, .docx, .pdf",
        fileList,
        beforeUpload: (file) => {
            setFileList([file]);
            setUrlCV("");
            return false;
        },
        onRemove: () => {
            setFileList([]);
            setUrlCV("");
            return true;
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            setFileList(info.fileList.slice(-1));
        },
    };


    return (
        <>
            <Modal title="Ứng Tuyển Job"
                open={isModalOpen}
                onOk={() => handleOkButton()}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                confirmLoading={isSubmitting}
                okText={isAuthenticated ? "Rải CV Nào " : "Đăng Nhập Nhanh"}
                cancelButtonProps={
                    { style: { display: "none" } }
                }
                destroyOnClose={true}
            >
                <Divider />
                {isAuthenticated ?
                    <div>
                        <ConfigProvider locale={enUS}>
                            <ProForm
                                submitter={{
                                    render: () => <></>
                                }}
                            >
                                <Row gutter={[10, 10]}>
                                    <Col span={24}>
                                        <div>
                                            Bạn đang ứng tuyển công việc <b>{jobDetail?.name} </b>tại  <b>{jobDetail?.company?.name}</b>
                                        </div>
                                    </Col>
                                    <Col span={24}>
                                        <ProFormText
                                            fieldProps={{
                                                type: "email"
                                            }}
                                            label="Email"
                                            name={"email"}
                                            labelAlign="right"
                                            disabled
                                            initialValue={user?.email}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <ProForm.Item
                                            label={"Upload file CV"}
                                            rules={[{ required: true, message: 'Vui lòng upload file!' }]}
                                        >

                                            <Upload {...propsUpload}>
                                                <Button icon={<UploadOutlined />}>Tải lên CV của bạn ( Hỗ trợ *.doc, *.docx, *.pdf, and &lt; 5MB )</Button>
                                            </Upload>
                                        </ProForm.Item>
                                    </Col>
                                </Row>

                            </ProForm>
                        </ConfigProvider>
                    </div>
                    :
                    <div>
                        Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể "Rải CV" bạn nhé -.-
                    </div>
                }
                <Divider />
            </Modal>
        </>
    )
}
export default ApplyModal;
