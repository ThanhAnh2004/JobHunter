import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm, Tag, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteInterview, callFetchInterview } from "@/config/api";
import DataTable from "@/components/client/data-table";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ModalInterview from '@/components/admin/interview/modal.interview';
import { useAppSelector } from '@/redux/hooks';

const InterviewPage = () => {
    const tableRef = useRef<ActionType>();
    const [isFetching, setIsFetching] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState<any>(null);

    const currentUser = useAppSelector(state => state.account.user);
    const isSuperAdmin = currentUser.email === 'admin@gmail.com' || currentUser.role?.name === 'SUPER_ADMIN';
    const isHR = !isSuperAdmin && Boolean(currentUser?.company?.id);

    const [interviews, setInterviews] = useState<any[]>([]);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const handleDeleteInterview = async (id: string) => {
        const res = await callDeleteInterview(id);
        if (res && res.statusCode === 204) {
            message.success('Xóa lịch phỏng vấn thành công');
            reloadTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    const columns: ProColumns<any>[] = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            sorter: true,
        },
        {
            title: 'Ứng viên',
            dataIndex: ['candidate', 'name'],
            hideInSearch: true,
        },
        {
            title: 'Công việc',
            dataIndex: ['job', 'name'],
            hideInSearch: true,
        },
        {
            title: 'Thời gian',
            dataIndex: 'interviewTime',
            render: (text, record, index, action) => {
                return (
                    <>{record.interviewTime ? dayjs(record.interviewTime).format('DD-MM-YYYY HH:mm') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Địa điểm / Link',
            dataIndex: 'location',
            hideInSearch: true,
            render: (text, record) => {
                if (record.location?.startsWith('http')) {
                    return <a href={record.location} target="_blank" rel="noopener noreferrer">{record.location}</a>;
                }
                return record.location;
            }
        },
        {
            title: 'Phản hồi ứng viên',
            dataIndex: 'status',
            render: (text, record) => {
                let tagColor = 'blue';
                let label = 'Chờ phản hồi';
                if (record.status === 'ACCEPTED') { tagColor = 'success'; label = '✅ Đồng ý'; }
                else if (record.status === 'REJECTED') { tagColor = 'error'; label = '❌ Từ chối'; }
                else if (record.status === 'COMPLETED') { tagColor = 'processing'; label = 'Hoàn thành'; }
                else if (record.status === 'CANCELLED') { tagColor = 'default'; label = 'Đã hủy'; }

                return (
                    <div>
                        <Tag color={tagColor} style={{ marginBottom: record.candidateNote ? 4 : 0 }}>{label}</Tag>
                        {record.candidateNote && (
                            <div style={{
                                background: '#fffbe6',
                                border: '1px solid #ffe58f',
                                borderRadius: 6,
                                padding: '4px 8px',
                                fontSize: 12,
                                color: '#78350f',
                                maxWidth: 200,
                                wordBreak: 'break-word'
                            }}>
                                💬 {record.candidateNote}
                            </div>
                        )}
                    </div>
                );
            },
            hideInSearch: true,
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 100,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <EditOutlined
                        style={{ fontSize: 20, color: '#ffa500' }}
                        onClick={() => {
                            setDataInit(entity);
                            setOpenModal(true);
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa"}
                        description={"Bạn có chắc chắn muốn xóa lịch này ?"}
                        onConfirm={() => handleDeleteInterview(entity.id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                            <DeleteOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
                        </span>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#262626' }}>
                    Quản lý Lịch Phỏng Vấn{isHR ? ` - ${currentUser?.company?.name || ''}` : ''}
                </div>
            </div>

            <DataTable<any>
                actionRef={tableRef}
                headerTitle={isHR ? `Danh sách Lịch phỏng vấn - ${currentUser?.company?.name || ''}` : "Danh sách Lịch phỏng vấn"}
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={interviews}
                request={async (params, sort, filter): Promise<any> => {
                    setIsFetching(true);
                    let query = `page=${params.current}&size=${params.pageSize}`;
                    if (params.title) {
                        query += `&filter=title~'${params.title}'`;
                    }
                    const res = await callFetchInterview(query);
                    setIsFetching(false);
                    if (res && res.data) {
                        setInterviews(res.data.result);
                        setMeta({
                            page: res.data.meta.page,
                            pageSize: res.data.meta.pageSize,
                            total: res.data.meta.total
                        });
                    }
                }}
                scroll={{ x: true }}
                pagination={
                    {
                        current: meta.page,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                rowSelection={false}
                toolBarRender={(_action, _rows): any => {
                    return (
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={() => {
                                setDataInit(null);
                                setOpenModal(true);
                            }}
                        >
                            Thêm mới
                        </Button>
                    );
                }}
            />

            <ModalInterview
                open={openModal}
                onClose={() => setOpenModal(false)}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
        </div>
    )
}

export default InterviewPage;
