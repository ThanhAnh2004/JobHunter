import { useLocation, useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICompany, IJob } from "@/types/backend";
import { callFetchCompanyById, callFetchJob } from "@/config/api";
import { withBackendUrl, DEFAULT_COMPANY_LOGO, getCompanyLogoUrl } from "@/config/runtime";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag, Button, Card, Breadcrumb, Empty } from "antd";
import { 
    EnvironmentOutlined, 
    BankOutlined, 
    CheckCircleFilled, 
    MessageOutlined, 
    HomeOutlined, 
    DollarOutlined, 
    HistoryOutlined, 
    ArrowRightOutlined 
} from "@ant-design/icons";
import { cleanHtmlDescription, getLocationName, formatRelativeTime, convertSlug } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";

const ClientCompanyDetailPage = () => {
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [companyJobs, setCompanyJobs] = useState<IJob[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const routeParams = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    // Trích xuất ID công ty từ query param hoặc path param
    let targetId = searchParams.get("id");
    if (!targetId && routeParams.id) {
        if (/^\d+$/.test(routeParams.id)) {
            targetId = routeParams.id;
        } else {
            const parts = routeParams.id.split("-");
            const lastPart = parts[parts.length - 1];
            if (/^\d+$/.test(lastPart)) {
                targetId = lastPart;
            }
        }
    }

    useEffect(() => {
        const init = async () => {
            if (targetId) {
                setIsLoading(true);
                try {
                    const res = await callFetchCompanyById(targetId);
                    if (res?.data) {
                        setCompanyDetail(res.data);
                    }

                    // Tải danh sách công việc của công ty này
                    const resJobs = await callFetchJob(`filter=company.id : ${targetId}&page=1&size=20&sort=updatedAt,desc`);
                    if (resJobs?.data?.result) {
                        setCompanyJobs(resJobs.data.result);
                    }
                } catch (err) {
                    console.error("Lỗi khi tải thông tin công ty:", err);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        init();
    }, [targetId]);

    const handleChatWithCompany = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (companyDetail?.id) {
            navigate(`/chat?companyId=${companyDetail.id}`);
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 100px)', padding: '24px 0 60px 0' }}>
            <div className={styles["container"]}>
                {/* Breadcrumb */}
                <div style={{ marginBottom: 16 }}>
                    <Breadcrumb
                        items={[
                            {
                                title: <Link to="/"><HomeOutlined /> Trang chủ</Link>,
                            },
                            {
                                title: <Link to="/company">Top Công ty IT</Link>,
                            },
                            {
                                title: companyDetail?.name || 'Chi tiết công ty',
                            },
                        ]}
                    />
                </div>

                {isLoading ? (
                    <Card style={{ borderRadius: 16, padding: 24 }}>
                        <Skeleton active avatar paragraph={{ rows: 8 }} />
                    </Card>
                ) : companyDetail && companyDetail.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Hero Header Card */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: 16,
                            padding: '32px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 24
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                                    <div style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 16,
                                        background: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        padding: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                                        flexShrink: 0
                                    }}>
                                        <img
                                            src={getCompanyLogoUrl(companyDetail.logo)}
                                            alt={companyDetail.name}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (target.src !== DEFAULT_COMPANY_LOGO) {
                                                    target.src = DEFAULT_COMPANY_LOGO;
                                                }
                                            }}
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                                            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
                                                {companyDetail.name}
                                            </h1>
                                            <Tag color="success" style={{ borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                <CheckCircleFilled /> Doanh nghiệp đã xác thực
                                            </Tag>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#64748b', fontSize: 14, flexWrap: 'wrap' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                <EnvironmentOutlined style={{ color: '#2563eb' }} /> {companyDetail.address || 'Chưa cập nhật địa chỉ'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<MessageOutlined />}
                                        onClick={handleChatWithCompany}
                                        style={{
                                            background: '#2563eb',
                                            borderRadius: 10,
                                            fontWeight: 700,
                                            height: 44,
                                            padding: '0 24px',
                                            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                                        }}
                                    >
                                        Nhắn tin với Nhà tuyển dụng
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid: Giới thiệu & Việc làm đang tuyển */}
                        <Row gutter={[24, 24]}>
                            {/* Cột trái (16 phần): Giới thiệu chi tiết & Jobs */}
                            <Col span={24} lg={16}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    {/* Card Giới thiệu */}
                                    <Card
                                        title={<span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Giới thiệu công ty</span>}
                                        style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.02)' }}
                                        bodyStyle={{ padding: 24 }}
                                    >
                                        {companyDetail.description ? (
                                            <div style={{ fontSize: 15, lineHeight: 1.8, color: '#334155' }}>
                                                {parse(cleanHtmlDescription(companyDetail.description))}
                                            </div>
                                        ) : (
                                            <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                                                Doanh nghiệp chưa cập nhật thông tin giới thiệu chi tiết.
                                            </div>
                                        )}
                                    </Card>

                                    {/* Card Việc làm đang tuyển dụng */}
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                                                    Vị trí tuyển dụng ({companyJobs.length})
                                                </span>
                                            </div>
                                        }
                                        style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.02)' }}
                                        bodyStyle={{ padding: '16px 20px' }}
                                    >
                                        {companyJobs.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                                {companyJobs.map((job) => (
                                                    <div
                                                        key={job.id}
                                                        onClick={() => {
                                                            const slug = convertSlug(job.name);
                                                            navigate(`/job/${slug}?id=${job.id}`);
                                                        }}
                                                        style={{
                                                            padding: '16px 20px',
                                                            borderRadius: 12,
                                                            border: '1px solid #e2e8f0',
                                                            background: '#ffffff',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            flexWrap: 'wrap',
                                                            gap: 12
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.borderColor = '#93c5fd';
                                                            e.currentTarget.style.background = '#f8faff';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                                            e.currentTarget.style.background = '#ffffff';
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                                                                {job.name}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', color: '#64748b', fontSize: 13, marginBottom: 8 }}>
                                                                <span style={{ color: '#059669', fontWeight: 600 }}>
                                                                    <DollarOutlined /> {(job.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                                                </span>
                                                                <span>
                                                                    <EnvironmentOutlined /> {getLocationName(job.location)}
                                                                </span>
                                                                <Tag color="blue" style={{ borderRadius: 4, margin: 0 }}>
                                                                    {job.level}
                                                                </Tag>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                                {job.skills?.slice(0, 4).map((skill, sIdx) => (
                                                                    <Tag key={sIdx} color="gold" style={{ borderRadius: 4, margin: 0, fontSize: 11 }}>
                                                                        {skill.name}
                                                                    </Tag>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb', fontWeight: 600, fontSize: 13 }}>
                                                            Xem chi tiết <ArrowRightOutlined style={{ fontSize: 11 }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Empty description="Công ty hiện chưa có tin tuyển dụng nào đang mở" style={{ padding: '24px 0' }} />
                                        )}
                                    </Card>
                                </div>
                            </Col>

                            {/* Cột phải (8 phần): Thông tin tóm tắt */}
                            <Col span={24} lg={8}>
                                <Card
                                    title={<span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Thông tin liên hệ</span>}
                                    style={{ borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.02)' }}
                                    bodyStyle={{ padding: 20 }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        <div>
                                            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
                                                Trụ sở chính
                                            </div>
                                            <div style={{ fontSize: 14, color: '#1e293b', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                                                <EnvironmentOutlined style={{ color: '#2563eb', marginTop: 3 }} />
                                                <span>{companyDetail.address || 'Chưa cập nhật'}</span>
                                            </div>
                                        </div>

                                        <Divider style={{ margin: '4px 0' }} />

                                        <div>
                                            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
                                                Trạng thái hoạt động
                                            </div>
                                            <div>
                                                <Tag color="green" style={{ fontWeight: 600 }}>Đang hoạt động</Tag>
                                            </div>
                                        </div>

                                        <Divider style={{ margin: '4px 0' }} />

                                        <div>
                                            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
                                                Cơ hội nghề nghiệp
                                            </div>
                                            <div style={{ fontSize: 14, color: '#1e293b', fontWeight: 600 }}>
                                                {companyJobs.length} vị trí đang tuyển
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <Card style={{ borderRadius: 16, textAlign: 'center', padding: '60px 20px' }}>
                        <BankOutlined style={{ fontSize: 60, color: '#94a3b8', marginBottom: 16 }} />
                        <h3>Không tìm thấy thông tin công ty</h3>
                        <p style={{ color: '#64748b' }}>Hồ sơ công ty không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
                        <Button type="primary" onClick={() => navigate('/company')} style={{ marginTop: 12 }}>
                            Quay lại danh sách công ty
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ClientCompanyDetailPage;
