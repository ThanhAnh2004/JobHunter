import { ICompany } from "@/types/backend";
import { Badge, Descriptions, Drawer, Image, Typography, Divider, Card, Button, notification } from "antd";
import dayjs from 'dayjs';
import { withBackendUrl } from "@/config/runtime";
import parse from 'html-react-parser';
import { cleanHtmlDescription } from "@/config/utils";
import { BankOutlined, EnvironmentOutlined, CalendarOutlined, FileTextOutlined, MessageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { callCreateOrGetConversation } from "@/config/api";
import { useState } from "react";

const { Title, Paragraph } = Typography;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: ICompany | null;
    setDataInit: (v: any) => void;
}

const ViewDetailCompany = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;
    const navigate = useNavigate();
    const [loadingChat, setLoadingChat] = useState<boolean>(false);

    const handleChatWithCompany = async () => {
        if (!dataInit?.id) return;
        try {
            setLoadingChat(true);
            const res = await callCreateOrGetConversation({
                companyId: +dataInit.id
            });
            if (res?.data) {
                onClose(false);
                navigate(`/admin/chat?conversationId=${res.data.id}`);
            }
        } catch (error) {
            console.error("Lỗi khi mở cuộc trò chuyện với HR:", error);
            notification.error({
                message: 'Không thể mở tin nhắn',
                description: 'Đã có lỗi xảy ra khi tạo cuộc hội thoại với nhà tuyển dụng.'
            });
        } finally {
            setLoadingChat(false);
        }
    };

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <BankOutlined style={{ color: '#2563eb', fontSize: 20 }} />
                    <span style={{ fontWeight: 700, fontSize: 16 }}>Chi Tiết Hồ Sơ Doanh Nghiệp</span>
                </div>
            }
            placement="right"
            onClose={() => { onClose(false); setDataInit(null); }}
            open={open}
            width={720}
            maskClosable={true}
        >
            {dataInit && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Header Card */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 20,
                        padding: 16,
                        background: '#f8fafc',
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 260 }}>
                            <div style={{
                                width: 70,
                                height: 70,
                                borderRadius: 12,
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}>
                                {dataInit.logo ? (
                                    <Image
                                        src={withBackendUrl(`/storage/company/${dataInit.logo}`)}
                                        alt={dataInit.name}
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <BankOutlined style={{ fontSize: 32, color: '#94a3b8' }} />
                                )}
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                                    {dataInit.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13 }}>
                                    <EnvironmentOutlined style={{ color: '#2563eb' }} />
                                    <span>{dataInit.address || 'Chưa cập nhật địa chỉ'}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            icon={<MessageOutlined />}
                            loading={loadingChat}
                            onClick={handleChatWithCompany}
                            style={{
                                background: '#10b981',
                                borderColor: '#10b981',
                                borderRadius: 8,
                                fontWeight: 600,
                                height: 38,
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                            }}
                        >
                            Nhắn tin với HR
                        </Button>
                    </div>

                    {/* Metadata Descriptions */}
                    <Descriptions title="Thông tin cơ bản" bordered column={2} size="small">
                        <Descriptions.Item label="Mã công ty">
                            <span style={{ fontWeight: 600, color: '#2563eb' }}>#{dataInit.id}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Badge status="success" text="Đang hoạt động" />
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên công ty" span={2}>
                            <span style={{ fontWeight: 600 }}>{dataInit.name}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ trụ sở" span={2}>
                            {dataInit.address}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Cập nhật lần cuối">
                            {dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : "—"}
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Company Description */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                            <FileTextOutlined style={{ color: '#2563eb' }} />
                            <span>Mô tả & Giới thiệu chi tiết</span>
                        </div>
                        <div style={{
                            padding: 20,
                            background: '#ffffff',
                            borderRadius: 12,
                            border: '1px solid #e2e8f0',
                            lineHeight: 1.7,
                            color: '#334155'
                        }}>
                            {dataInit.description ? (
                                parse(cleanHtmlDescription(dataInit.description))
                            ) : (
                                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có thông tin mô tả chi tiết cho doanh nghiệp.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Drawer>
    );
};

export default ViewDetailCompany;
