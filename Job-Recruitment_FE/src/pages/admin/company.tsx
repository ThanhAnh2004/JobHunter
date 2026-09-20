import ModalCompany from "@/components/admin/company/modal.company";
import ViewDetailCompany from "@/components/admin/company/view.company";
import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCompany } from "@/redux/slice/companySlide";
import { ICompany } from "@/types/backend";
import { 
    DeleteOutlined, 
    EditOutlined, 
    EyeOutlined, 
    PlusOutlined, 
    BankOutlined, 
    EnvironmentOutlined, 
    GlobalOutlined, 
    ReloadOutlined,
    CalendarOutlined,
    CheckCircleFilled,
    FileTextOutlined,
    PlusCircleOutlined,
    MessageOutlined
} from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification, Card, Row, Col, Tag, Image, Skeleton, Typography, Divider, Tooltip } from "antd";
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { callDeleteCompany, callFetchCompanyById, callCreateOrGetConversation } from "@/config/api";
import { withBackendUrl, DEFAULT_COMPANY_LOGO, getCompanyLogoUrl } from "@/config/runtime";
import queryString from 'query-string';
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import parse from 'html-react-parser';
import { cleanHtmlDescription } from "@/config/utils";

const { Title, Text, Paragraph } = Typography;

const CompanyPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openViewDrawer, setOpenViewDrawer] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ICompany | null>(null);

    // Dành riêng cho HR profile view
    const [hrCompany, setHrCompany] = useState<ICompany | null>(null);
    const [loadingHrCompany, setLoadingHrCompany] = useState<boolean>(false);

    const tableRef = useRef<ActionType>();
    const location = useLocation();
    const navigate = useNavigate();

    const user = useAppSelector(state => state.account.user);
    const roleName = (user?.role?.name ?? "").toUpperCase();
    const isSuperAdmin = user?.email === 'admin@gmail.com' || roleName === 'SUPER_ADMIN' || roleName.includes('ADMIN');
    const isHR = location.pathname.startsWith('/hr') || (!isSuperAdmin && (Boolean(user?.company?.id) || roleName === 'HR'));

    const isFetching = useAppSelector(state => state.company.isFetching);
    const meta = useAppSelector(state => state.company.meta);
    const companies = useAppSelector(state => state.company.result);
    const dispatch = useAppDispatch();

    // Fetch thông tin chi tiết công ty của HR
    const loadHrCompanyProfile = useCallback(async () => {
        const companyId = user?.company?.id;
        if (companyId) {
            setLoadingHrCompany(true);
            try {
                const res = await callFetchCompanyById(String(companyId));
                if (res?.data) {
                    setHrCompany(res.data);
                }
            } catch (err) {
                console.error("Lỗi khi tải hồ sơ công ty:", err);
            } finally {
                setLoadingHrCompany(false);
            }
        }
    }, [user?.company?.id]);

    useEffect(() => {
        if (isHR) {
            loadHrCompanyProfile();
        }
    }, [isHR, loadHrCompanyProfile]);

    const handleDeleteCompany = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteCompany(id);
            if (res && (+res.statusCode === 200 || +res.statusCode === 204)) {
                message.success('Xóa Company thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    };

    const reloadTable = () => {
        tableRef?.current?.reload();
        if (isHR) {
            loadHrCompanyProfile();
        }
    };

    const handleChatWithCompany = async (company: ICompany) => {
        if (!company?.id) return;
        try {
            const res = await callCreateOrGetConversation({
                companyId: +company.id
            });
            if (res?.data) {
                navigate(`/admin/chat?conversationId=${res.data.id}`);
            }
        } catch (error) {
            console.error("Lỗi khi mở cuộc trò chuyện với HR:", error);
            notification.error({
                message: 'Không thể mở tin nhắn',
                description: 'Đã có lỗi xảy ra khi tạo cuộc hội thoại với nhà tuyển dụng.'
            });
        }
    };

    const columns: ProColumns<ICompany>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: "center",
            render: (_text, _record, index) => {
                return (
                    <span style={{ fontWeight: 600, color: '#64748b' }}>
                        {(index + 1) + (meta.page - 1) * (meta.pageSize)}
                    </span>
                );
            },
            hideInSearch: true,
        },
        {
            title: 'Logo',
            dataIndex: 'logo',
            width: 80,
            align: 'center',
            hideInSearch: true,
            render: (_text, record) => {
                return (
                    <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        padding: 2
                    }}>
                        <img
                            src={getCompanyLogoUrl(record.logo)}
                            alt={record.name}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src !== DEFAULT_COMPANY_LOGO) {
                                    target.src = DEFAULT_COMPANY_LOGO;
                                }
                            }}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    </div>
                );
            }
        },
        {
            title: 'Tên Công Ty',
            dataIndex: 'name',
            sorter: true,
            render: (_text, record) => {
                return (
                    <a
                        style={{ fontWeight: 700, color: '#2563eb' }}
                        onClick={() => {
                            setDataInit(record);
                            setOpenViewDrawer(true);
                        }}
                    >
                        {record.name}
                    </a>
                );
            }
        },
        {
            title: 'Địa Chỉ Trụ Sở',
            dataIndex: 'address',
            sorter: true,
            render: (_text, record) => (
                <span style={{ color: '#475569' }}>
                    <EnvironmentOutlined style={{ color: '#2563eb', marginRight: 6 }} />
                    {record.address}
                </span>
            )
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            width: 170,
            sorter: true,
            render: (_text, record) => {
                return (
                    <span style={{ color: '#64748b', fontSize: 13 }}>
                        {record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : "—"}
                    </span>
                );
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày Sửa',
            dataIndex: 'updatedAt',
            width: 170,
            sorter: true,
            render: (_text, record) => {
                return (
                    <span style={{ color: '#64748b', fontSize: 13 }}>
                        {record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : "—"}
                    </span>
                );
            },
            hideInSearch: true,
        },
        {
            title: 'Hành Động',
            hideInSearch: true,
            width: 140,
            align: 'center',
            render: (_value, entity) => (
                <Space size="middle">
                    <Tooltip title="Nhắn tin với HR">
                        <MessageOutlined
                            style={{
                                fontSize: 18,
                                color: '#10b981',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleChatWithCompany(entity)}
                        />
                    </Tooltip>
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined
                            style={{
                                fontSize: 18,
                                color: '#2563eb',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setDataInit(entity);
                                setOpenViewDrawer(true);
                            }}
                        />
                    </Tooltip>
                    <Access
                        permission={ALL_PERMISSIONS.COMPANIES.UPDATE}
                        hideChildren
                    >
                        <Tooltip title="Chỉnh sửa">
                            <EditOutlined
                                style={{
                                    fontSize: 18,
                                    color: '#f59e0b',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setOpenModal(true);
                                    setDataInit(entity);
                                }}
                            />
                        </Tooltip>
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.COMPANIES.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title="Xác nhận xóa công ty"
                            description="Bạn có chắc chắn muốn xóa công ty này?"
                            onConfirm={() => handleDeleteCompany(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Tooltip title="Xóa">
                                <DeleteOutlined
                                    style={{
                                        fontSize: 18,
                                        color: '#ef4444',
                                        cursor: 'pointer'
                                    }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        };

        if (clone.name) q.filter = `${sfLike("name", clone.name)}`;
        if (clone.address) {
            q.filter = clone.name ?
                q.filter + " and " + `${sfLike("address", clone.address)}`
                : `${sfLike("address", clone.address)}`;
        }

        // Nếu là HR, chỉ lọc duy nhất công ty của mình
        if (isHR && user?.company?.id) {
            const hrCompanyFilter = `id : ${user.company.id}`;
            q.filter = q.filter ? `${q.filter} and ${hrCompanyFilter}` : hrCompanyFilter;
        } else if (isHR && user?.company?.name) {
            const hrCompanyFilter = `name ~ '${user.company.name}'`;
            q.filter = q.filter ? `${q.filter} and ${hrCompanyFilter}` : hrCompanyFilter;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }
        if (sort && sort.address) {
            sortBy = sort.address === 'ascend' ? "sort=address,asc" : "sort=address,desc";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    };

    // View Profile dành riêng cho HR
    const currentCompany = hrCompany || (companies && companies.length > 0 ? companies[0] : null);

    return (
        <div style={{ padding: isHR ? '8px 0 24px 0' : 0 }}>
            {isHR ? (
                /* =================== HR DEDICATED COMPANY PROFILE VIEW =================== */
                <Access permission={ALL_PERMISSIONS.COMPANIES.GET_PAGINATE}>
                    {loadingHrCompany ? (
                        <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0', padding: 24 }}>
                            <Skeleton active avatar paragraph={{ rows: 8 }} />
                        </Card>
                    ) : currentCompany ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Hero Header Banner */}
                            <div style={{
                                position: 'relative',
                                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
                                borderRadius: 16,
                                padding: '32px 28px',
                                color: '#ffffff',
                                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.2)',
                                overflow: 'hidden'
                            }}>
                                {/* Background subtle decorative glow */}
                                <div style={{
                                    position: 'absolute',
                                    top: -40,
                                    right: -40,
                                    width: 220,
                                    height: 220,
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    pointerEvents: 'none'
                                }} />

                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 20,
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                        {/* Company Logo with hover preview */}
                                        <div style={{
                                            width: 96,
                                            height: 96,
                                            borderRadius: 16,
                                            background: '#ffffff',
                                            padding: 6,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                                            border: '2px solid rgba(255, 255, 255, 0.8)',
                                            flexShrink: 0
                                        }}>
                                            <Image
                                                src={getCompanyLogoUrl(currentCompany.logo)}
                                                fallback={DEFAULT_COMPANY_LOGO}
                                                alt={currentCompany.name}
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            />
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                                                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#ffffff' }}>
                                                    {currentCompany.name}
                                                </h1>
                                                <Tag color="success" style={{ borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    <CheckCircleFilled /> Doanh nghiệp đã xác thực
                                                </Tag>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', color: 'rgba(255, 255, 255, 0.9)', fontSize: 14 }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                    <EnvironmentOutlined /> {currentCompany.address || 'Chưa cập nhật địa chỉ'}
                                                </span>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                                    <CalendarOutlined /> Ngày tham gia: {currentCompany.createdAt ? dayjs(currentCompany.createdAt).format('DD/MM/YYYY') : '—'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                        <Access permission={ALL_PERMISSIONS.COMPANIES.UPDATE} hideChildren>
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<EditOutlined />}
                                                onClick={() => {
                                                    setDataInit(currentCompany);
                                                    setOpenModal(true);
                                                }}
                                                style={{
                                                    background: '#ffffff',
                                                    color: '#2563eb',
                                                    border: 'none',
                                                    fontWeight: 700,
                                                    borderRadius: 10,
                                                    height: 42,
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                                }}
                                            >
                                                Chỉnh sửa hồ sơ
                                            </Button>
                                        </Access>

                                        <Button
                                            ghost
                                            size="large"
                                            icon={<GlobalOutlined />}
                                            onClick={() => window.open(`/company/${currentCompany.id}`, '_blank')}
                                            style={{
                                                borderColor: 'rgba(255, 255, 255, 0.6)',
                                                color: '#ffffff',
                                                fontWeight: 600,
                                                borderRadius: 10,
                                                height: 42
                                            }}
                                        >
                                            Xem trang công khai
                                        </Button>

                                        <Button
                                            ghost
                                            size="large"
                                            icon={<ReloadOutlined />}
                                            onClick={loadHrCompanyProfile}
                                            style={{
                                                borderColor: 'rgba(255, 255, 255, 0.6)',
                                                color: '#ffffff',
                                                fontWeight: 600,
                                                borderRadius: 10,
                                                height: 42
                                            }}
                                            title="Tải lại dữ liệu"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Information Grid */}
                            <Row gutter={[20, 20]}>
                                {/* Cột trái: Mô tả chi tiết */}
                                <Col span={24} lg={16}>
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <FileTextOutlined style={{ color: '#2563eb', fontSize: 18 }} />
                                                <span style={{ fontWeight: 700, fontSize: 16 }}>Giới thiệu & Mô tả doanh nghiệp</span>
                                            </div>
                                        }
                                        extra={
                                            <Access permission={ALL_PERMISSIONS.COMPANIES.UPDATE} hideChildren>
                                                <Button
                                                    type="link"
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        setDataInit(currentCompany);
                                                        setOpenModal(true);
                                                    }}
                                                    style={{ fontWeight: 600 }}
                                                >
                                                    Chỉnh sửa mô tả
                                                </Button>
                                            </Access>
                                        }
                                        style={{
                                            borderRadius: 16,
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
                                        }}
                                        headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 24px' }}
                                        bodyStyle={{ padding: 24 }}
                                    >
                                        {currentCompany.description ? (
                                            <div style={{
                                                fontSize: 15,
                                                lineHeight: 1.8,
                                                color: '#334155'
                                            }}>
                                                {parse(cleanHtmlDescription(currentCompany.description))}
                                            </div>
                                        ) : (
                                            <div style={{
                                                textAlign: 'center',
                                                padding: '40px 20px',
                                                background: '#f8fafc',
                                                borderRadius: 12,
                                                border: '1px dashed #cbd5e1'
                                            }}>
                                                <BankOutlined style={{ fontSize: 40, color: '#94a3b8', marginBottom: 12 }} />
                                                <div style={{ color: '#64748b', fontSize: 15, marginBottom: 16 }}>
                                                    Chưa có mô tả chi tiết cho doanh nghiệp của bạn.
                                                </div>
                                                <Button
                                                    type="primary"
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        setDataInit(currentCompany);
                                                        setOpenModal(true);
                                                    }}
                                                    style={{ borderRadius: 8 }}
                                                >
                                                    Thêm thông tin giới thiệu
                                                </Button>
                                            </div>
                                        )}
                                    </Card>
                                </Col>

                                {/* Cột phải: Thông tin tóm tắt & Lối tắt nhanh */}
                                <Col span={24} lg={8}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        {/* Card Thông tin chung */}
                                        <Card
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <BankOutlined style={{ color: '#2563eb', fontSize: 18 }} />
                                                    <span style={{ fontWeight: 700, fontSize: 16 }}>Thông tin công ty</span>
                                                </div>
                                            }
                                            style={{
                                                borderRadius: 16,
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
                                            }}
                                            headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 20px' }}
                                            bodyStyle={{ padding: 20 }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                                <div>
                                                    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
                                                        Tên doanh nghiệp
                                                    </div>
                                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                                                        {currentCompany.name}
                                                    </div>
                                                </div>

                                                <Divider style={{ margin: '4px 0' }} />

                                                <div>
                                                    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
                                                        Trụ sở chính
                                                    </div>
                                                    <div style={{ fontSize: 14, color: '#334155', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                                                        <EnvironmentOutlined style={{ color: '#2563eb', marginTop: 3 }} />
                                                        <span>{currentCompany.address || 'Chưa thiết lập'}</span>
                                                    </div>
                                                </div>

                                                <Divider style={{ margin: '4px 0' }} />

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                    <div>
                                                        <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
                                                            Mã công ty
                                                        </div>
                                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#2563eb' }}>
                                                            #{currentCompany.id}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
                                                            Trạng thái
                                                        </div>
                                                        <Tag color="green" style={{ margin: 0, fontWeight: 600 }}>Hoạt động</Tag>
                                                    </div>
                                                </div>

                                                <Divider style={{ margin: '4px 0' }} />

                                                <div>
                                                    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
                                                        Lần cập nhật gần nhất
                                                    </div>
                                                    <div style={{ fontSize: 13, color: '#64748b' }}>
                                                        {currentCompany.updatedAt ? dayjs(currentCompany.updatedAt).format('DD/MM/YYYY HH:mm') : dayjs(currentCompany.createdAt).format('DD/MM/YYYY HH:mm')}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Card Lối tắt nhanh tuyển dụng */}
                                        <Card
                                            style={{
                                                borderRadius: 16,
                                                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                                border: '1px solid #bfdbfe',
                                                padding: 8
                                            }}
                                            bodyStyle={{ padding: 16 }}
                                        >
                                            <div style={{ fontWeight: 800, fontSize: 15, color: '#1e3a8a', marginBottom: 6 }}>
                                                🚀 Tuyển dụng nhân tài ngay
                                            </div>
                                            <div style={{ fontSize: 13, color: '#3b82f6', marginBottom: 14 }}>
                                                Tạo tin đăng tuyển dụng mới dưới tên công ty <strong>{currentCompany.name}</strong> để tiếp cận hàng ngàn ứng viên tiềm năng.
                                            </div>
                                            <Button
                                                type="primary"
                                                block
                                                icon={<PlusCircleOutlined />}
                                                onClick={() => navigate('/hr/job/upsert')}
                                                style={{
                                                    background: '#2563eb',
                                                    borderRadius: 10,
                                                    fontWeight: 700,
                                                    height: 40
                                                }}
                                            >
                                                Đăng tin tuyển dụng mới
                                            </Button>
                                        </Card>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        /* Chưa có thông tin công ty */
                        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '60px 20px', border: '1px solid #e2e8f0' }}>
                            <BankOutlined style={{ fontSize: 60, color: '#94a3b8', marginBottom: 16 }} />
                            <Title level={4}>Chưa tìm thấy thông tin công ty</Title>
                            <Paragraph type="secondary">
                                Tài khoản HR của bạn hiện chưa được liên kết với hồ sơ doanh nghiệp nào. Vui lòng liên hệ Quản trị viên để được hỗ trợ.
                            </Paragraph>
                        </Card>
                    )}
                </Access>
            ) : (
                /* =================== ADMIN FULL DATA TABLE VIEW =================== */
                <Access permission={ALL_PERMISSIONS.COMPANIES.GET_PAGINATE}>
                    <DataTable<ICompany>
                        actionRef={tableRef}
                        headerTitle="Danh Sách Doanh Nghiệp"
                        rowKey="id"
                        loading={isFetching}
                        columns={columns}
                        dataSource={companies}
                        request={async (params, sort, filter): Promise<any> => {
                            const query = buildQuery(params, sort, filter);
                            dispatch(fetchCompany({ query }));
                        }}
                        scroll={{ x: true }}
                        pagination={{
                            current: meta.page,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => (
                                <div> {range[0]}-{range[1]} trên {total} doanh nghiệp</div>
                            )
                        }}
                        rowSelection={false}
                        toolBarRender={(): any => {
                            return (
                                <Access
                                    permission={ALL_PERMISSIONS.COMPANIES.CREATE}
                                    hideChildren
                                >
                                    <Button
                                        icon={<PlusOutlined />}
                                        type="primary"
                                        onClick={() => {
                                            setDataInit(null);
                                            setOpenModal(true);
                                        }}
                                        style={{ borderRadius: 8 }}
                                    >
                                        Thêm mới
                                    </Button>
                                </Access>
                            );
                        }}
                    />
                </Access>
            )}

            {/* Modal chỉnh sửa & tạo mới thông tin công ty */}
            <ModalCompany
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            {/* Drawer xem chi tiết doanh nghiệp */}
            <ViewDetailCompany
                open={openViewDrawer}
                onClose={setOpenViewDrawer}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    );
};

export default CompanyPage;