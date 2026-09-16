import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IResume } from "@/types/backend";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Space, message, notification, Segmented, Card, Tag, Badge, Popconfirm, Tooltip, Button } from "antd";
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { callDeleteResume, callUpdateResumeStatus } from "@/config/api";
import queryString from 'query-string';
import { fetchResume } from "@/redux/slice/resumeSlide";
import ViewDetailResume from "@/components/admin/resume/view.resume";
import ModalInterview from "@/components/admin/interview/modal.interview";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { withBackendUrl } from "@/config/runtime";
import Access from "@/components/share/access";
import { sfIn } from "spring-filter-query-builder";
import { EditOutlined, DeleteOutlined, MessageOutlined, CalendarOutlined } from "@ant-design/icons";

const ResumePage = () => {
    const tableRef = useRef<ActionType>();
    const navigate = useNavigate();
    const location = useLocation();

    const isFetching = useAppSelector(state => state.resume.isFetching);
    const meta = useAppSelector(state => state.resume.meta);
    const resumes = useAppSelector(state => state.resume.result);
    const currentUser = useAppSelector(state => state.account.user);
    const isSuperAdmin = currentUser.email === 'admin@gmail.com' || currentUser.role?.name === 'SUPER_ADMIN';
    const isHR = !isSuperAdmin && Boolean(currentUser?.company?.id);

    const dispatch = useAppDispatch();

    const [dataInit, setDataInit] = useState<IResume | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
    const [dragOverCol, setDragOverCol] = useState<string | null>(null);

    // Modal Interview state
    const [openModalInterview, setOpenModalInterview] = useState<boolean>(false);
    const [dataInitInterview, setDataInitInterview] = useState<any>(null);

    useEffect(() => {
        if (viewMode === 'kanban') {
            dispatch(fetchResume({ query: 'page=1&size=100&sort=updatedAt,desc' }));
        } else {
            reloadTable();
        }
    }, [viewMode]);

    const handleDeleteResume = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteResume(id);
            if (res && (+res.statusCode === 200 || +res.statusCode === 204)) {
                message.success('Xóa Resume thành công');
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
        if (viewMode === 'table') {
            tableRef?.current?.reload();
        } else {
            dispatch(fetchResume({ query: 'page=1&size=100&sort=updatedAt,desc' }));
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        const res = await callUpdateResumeStatus(id, status);
        if (res.data) {
            message.success("Cập nhật trạng thái CV thành công!");
            reloadTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    };

    const handleOpenInterviewModal = (entity: IResume) => {
        const candidateId = entity?.user?.id || (entity as any)?.userId;
        const candidateName = entity?.user?.name || entity?.email;
        const jobId = entity?.job?.id || (typeof entity?.jobId === 'object' ? entity?.jobId?.id : entity?.jobId);
        const jobName = entity?.job?.name || (typeof entity?.jobId === 'object' ? entity?.jobId?.name : '');

        setDataInitInterview({
            candidateId: candidateId,
            candidateName: candidateName,
            candidateEmail: entity?.email,
            jobId: jobId,
            jobName: jobName,
            title: `Phỏng vấn vị trí ${jobName || ''} - Ứng viên ${candidateName || ''}`.trim(),
        });
        setOpenModalInterview(true);
    };

    const columns: ProColumns<IResume>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 50,
            render: (text, record, index, action) => {
                return (
                    <a href="#" onClick={() => {
                        setOpenViewDetail(true);
                        setDataInit(record);
                    }}>
                        {record.id}
                    </a>
                );
            },
            hideInSearch: true,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            sorter: true,
            renderFormItem: (item, props, form) => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        PENDING: 'PENDING',
                        REVIEWING: 'REVIEWING',
                        APPROVED: 'APPROVED',
                        REJECTED: 'REJECTED',
                    }}
                    placeholder="Chọn level"
                />
            ),
        },

        {
            title: 'Job',
            dataIndex: ["job", "name"],
            hideInSearch: true,
        },
        {
            title: 'Company',
            dataIndex: "companyName",
            hideInSearch: true,
            hideInTable: isHR,
        },
        {
            title: 'File CV',
            dataIndex: 'url',
            hideInSearch: true,
            render: (text, record, index, action) => {
                return (
                    <a href={withBackendUrl(`/storage/resume/${record.url}`)} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                        {record.url}
                    </a>
                );
            }
        },

        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 170,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                );
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 170,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                );
            },
            hideInSearch: true,
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 130,
            render: (_value, entity, _index, _action) => (
                <Space size="middle">
                    <Tooltip title="Đặt lịch phỏng vấn với ứng viên">
                        <CalendarOutlined
                            style={{
                                fontSize: 19,
                                color: '#10b981',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleOpenInterviewModal(entity)}
                        />
                    </Tooltip>

                    <Tooltip title="Nhắn tin với ứng viên">
                        <MessageOutlined
                            style={{
                                fontSize: 19,
                                color: '#2563eb',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                const candidateId = entity?.user?.id || (entity as any)?.userId;
                                const jobId = entity?.job?.id || (typeof entity?.jobId === 'object' ? entity?.jobId?.id : entity?.jobId);
                                if (candidateId) {
                                    const targetUrl = location.pathname.startsWith('/hr')
                                        ? `/hr/chat?candidateId=${candidateId}${jobId ? `&jobId=${jobId}` : ''}`
                                        : `/hr/chat?candidateId=${candidateId}`;
                                    navigate(targetUrl);
                                } else {
                                    navigate('/hr/chat');
                                }
                            }}
                        />
                    </Tooltip>

                    <Tooltip title="Xem và sửa hồ sơ">
                        <EditOutlined
                            style={{
                                fontSize: 19,
                                color: '#ffa500',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                setOpenViewDetail(true);
                                setDataInit(entity);
                            }}
                        />
                    </Tooltip>

                    <Access
                        permission={ALL_PERMISSIONS.RESUMES.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa resume"}
                            description={"Bạn có chắc chắn muốn xóa resume này ?"}
                            onConfirm={() => handleDeleteResume(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 4px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 19,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),

        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };

        if (clone?.status?.length) {
            clone.filter = sfIn("status", clone.status).toString();
            delete clone.status;
        }

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.status) {
            sortBy = sort.status === 'ascend' ? "sort=status,asc" : "sort=status,desc";
        }

        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    };

    // Phân loại resume theo trạng thái
    const pendingResumes = resumes.filter(r => r.status === 'PENDING');
    const reviewingResumes = resumes.filter(r => r.status === 'REVIEWING');
    const approvedResumes = resumes.filter(r => r.status === 'APPROVED');
    const rejectedResumes = resumes.filter(r => r.status === 'REJECTED');

    const kanbanColumns = [
        { title: 'Chờ xử lý (PENDING)', status: 'PENDING', list: pendingResumes, color: '#faad14' },
        { title: 'Đang đánh giá (REVIEWING)', status: 'REVIEWING', list: reviewingResumes, color: '#1890ff' },
        { title: 'Đạt yêu cầu (APPROVED)', status: 'APPROVED', list: approvedResumes, color: '#52c41a' },
        { title: 'Từ chối (REJECTED)', status: 'REJECTED', list: rejectedResumes, color: '#ff4d4f' },
    ];

    const renderKanbanBoard = () => {
        return (
            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 0' }}>
                {kanbanColumns.map(col => {
                    const isDragOver = dragOverCol === col.status;
                    return (
                        <div
                            key={col.status}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={() => setDragOverCol(col.status)}
                            onDragLeave={() => setDragOverCol(null)}
                            onDrop={async (e) => {
                                setDragOverCol(null);
                                const id = e.dataTransfer.getData("resumeId");
                                if (id) {
                                    await handleStatusChange(id, col.status);
                                }
                            }}
                            style={{
                                flex: 1,
                                minWidth: '280px',
                                background: isDragOver ? '#e6f7ff' : '#f5f5f5',
                                border: isDragOver ? '2px dashed #1890ff' : '1px solid #e8e8e8',
                                borderRadius: '8px',
                                padding: '15px 12px',
                                minHeight: '600px',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Column Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '15px',
                                borderBottom: `2px solid ${col.color}`,
                                paddingBottom: '8px'
                            }}>
                                <span style={{ fontWeight: 600, fontSize: '15px', color: '#262626' }}>
                                    {col.title}
                                </span>
                                <Badge
                                    count={col.list.length}
                                    style={{
                                        backgroundColor: col.color,
                                        boxShadow: 'none'
                                    }}
                                />
                            </div>

                            {/* Column Body / Cards */}
                            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '550px' }}>
                                {col.list.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        color: '#bfbfbf',
                                        padding: '40px 0',
                                        fontSize: '13px',
                                        border: '1px dashed #d9d9d9',
                                        borderRadius: '6px',
                                        background: '#fafafa'
                                    }}>
                                        Kéo thả CV vào đây
                                    </div>
                                ) : (
                                    col.list.map(item => (
                                        <Card
                                            key={item.id}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData("resumeId", item.id || "");
                                            }}
                                            hoverable
                                            bodyStyle={{ padding: '12px' }}
                                            style={{
                                                marginBottom: '10px',
                                                cursor: 'move',
                                                borderRadius: '6px',
                                                border: '1px solid #f0f0f0',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                                            }}
                                        >
                                            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: '#262626' }}>
                                                {item.job?.name}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#595959', marginBottom: '4px' }}>
                                                <strong>Công ty:</strong> {item.companyName}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <strong>Email:</strong> {item.email}
                                            </div>
                                            <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                                                <a href={withBackendUrl(`/storage/resume/${item.url}`)} target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: '#1890ff' }}>
                                                    Xem CV ứng viên
                                                </a>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                borderTop: '1px solid #f0f0f0',
                                                paddingTop: '8px',
                                                fontSize: '12px',
                                            }}>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleOpenInterviewModal(item);
                                                    }}
                                                    style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                                                >
                                                    <CalendarOutlined /> Đặt lịch phỏng vấn
                                                </a>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setOpenViewDetail(true);
                                                        setDataInit(item);
                                                    }}
                                                    style={{ color: '#1890ff' }}
                                                >
                                                    Xem chi tiết
                                                </a>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#262626' }}>
                        Quản lý Hồ sơ ứng tuyển (CV){isHR ? ` - ${currentUser?.company?.name || ''}` : ''}
                    </div>
                    <Segmented
                        value={viewMode}
                        onChange={(value) => setViewMode(value as any)}
                        options={[
                            { label: 'Dạng Bảng', value: 'table' },
                            { label: 'Dạng Kanban', value: 'kanban' }
                        ]}
                    />
                </div>

                {viewMode === 'table' ? (
                    <DataTable<IResume>
                        actionRef={tableRef}
                        headerTitle={isHR ? `Danh sách CV ứng tuyển - ${currentUser?.company?.name || ''}` : "Danh sách Resumes"}
                        rowKey="id"
                        loading={isFetching}
                        columns={columns}
                        dataSource={resumes}
                        request={async (params, sort, filter): Promise<any> => {
                            const query = buildQuery(params, sort, filter);
                            dispatch(fetchResume({ query }));
                        }}
                        scroll={{ x: true }}
                        pagination={
                            {
                                current: meta.page,
                                pageSize: meta.pageSize,
                                showSizeChanger: true,
                                total: meta.total,
                                showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>); }
                            }
                        }
                        rowSelection={false}
                        toolBarRender={(_action, _rows): any => {
                            return (
                                <></>
                            );
                        }}
                    />
                ) : (
                    renderKanbanBoard()
                )}
            </Access>
            <ViewDetailResume
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
                onScheduleInterview={(resume) => {
                    setOpenViewDetail(false);
                    handleOpenInterviewModal(resume);
                }}
            />
            <ModalInterview
                open={openModalInterview}
                onClose={() => {
                    setOpenModalInterview(false);
                    setDataInitInterview(null);
                }}
                dataInit={dataInitInterview}
                setDataInit={setDataInitInterview}
                reloadTable={reloadTable}
            />
        </div>
    );
};

export default ResumePage;