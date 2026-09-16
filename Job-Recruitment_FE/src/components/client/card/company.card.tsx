import { callFetchCompany } from '@/config/api';
import { withBackendUrl } from '@/config/runtime';
import { convertSlug } from '@/config/utils';
import { ICompany } from '@/types/backend';
import { Button, Card, Col, Empty, Pagination, Row, Spin, Tag } from 'antd';
import { CheckCircleFilled, BankOutlined, EnvironmentOutlined, ArrowRightOutlined, TeamOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from 'styles/client.module.scss';

interface IProps {
    showPagination?: boolean;
}

const CompanyCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(showPagination ? 20 : 4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchCompany();
    }, [current, pageSize, filter, sortQuery, searchParams.toString()]);

    const fetchCompany = async () => {
        setIsLoading(true);
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const nameParam = searchParams.get("name");
        if (nameParam) {
            query += `&filter=name~'${nameParam}'`;
        }

        const res = await callFetchCompany(query);
        if (res && res.data) {
            setDisplayCompany(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
            window.scrollTo({ top: 180, behavior: 'smooth' });
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const handleViewDetailCompany = (item: ICompany) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/company/${slug}?id=${item.id}`);
        }
    };

    return (
        <div className={`${styles["company-section"]}`} style={{ margin: showPagination ? '10px 0 40px 0' : '40px 0' }}>
            <div className={styles["company-content"]} style={{ paddingTop: showPagination ? 0 : 40 }}>
                <Spin spinning={isLoading} tip="Đang tải danh sách công ty...">
                    <Row gutter={[16, 16]}>
                        {!showPagination && (
                            <Col span={24}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <BankOutlined style={{ color: '#2563eb' }} /> Doanh Nghiệp Hàng Đầu & Tiêu Biểu
                                        </h2>
                                        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                                            Khám phá cơ hội làm việc tại các công ty công nghệ và tập đoàn uy tín
                                        </p>
                                    </div>
                                    <Link 
                                        to="/company" 
                                        style={{ 
                                            fontWeight: 600, 
                                            color: '#3b82f6', 
                                            fontSize: '15px', 
                                            transition: 'color 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4
                                        }}
                                    >
                                        Xem tất cả công ty &rarr;
                                    </Link>
                                </div>
                            </Col>
                        )}

                        {/* NẾU Ở TRANG /company (showPagination = true): HIỂN THỊ DẠNG DANH SÁCH CUỘN 20 CÔNG TY */}
                        {showPagination ? (
                            displayCompany?.map(item => (
                                <Col span={24} md={12} key={item.id}>
                                    <Card
                                        onClick={() => handleViewDetailCompany(item)}
                                        className={styles["company-card-horizontal"]}
                                        bodyStyle={{ padding: '18px 20px' }}
                                        hoverable
                                        style={{ cursor: 'pointer', height: '100%' }}
                                    >
                                        <div className={styles["company-body-horiz"]}>
                                            <div className={styles["logo-box"]}>
                                                <img
                                                    alt={item.name}
                                                    src={withBackendUrl(`/storage/company/${item?.logo}`)}
                                                />
                                            </div>
                                            <div className={styles["company-info"]}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                                    <Tag color="success" style={{ margin: 0, fontSize: 10, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3, padding: '1px 6px' }}>
                                                        <CheckCircleFilled /> Xác thực
                                                    </Tag>
                                                </div>
                                                <h3 className={styles["name"]} title={item.name}>
                                                    {item.name}
                                                </h3>
                                                {item.address && (
                                                    <p className={styles["address"]} title={item.address}>
                                                        <EnvironmentOutlined style={{ color: '#64748b' }} /> {item.address}
                                                    </p>
                                                )}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                                                    <Tag color="blue" style={{ borderRadius: 4, fontSize: 11, fontWeight: 500 }}>
                                                        Đang tuyển dụng IT
                                                    </Tag>
                                                    <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        Khám phá <ArrowRightOutlined style={{ fontSize: 10 }} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            /* Ở TRANG CHỦ: HIỂN THỊ GRID 4 CỘT */
                            displayCompany?.map(item => (
                                <Col span={24} sm={12} md={6} key={item.id}>
                                    <Card
                                        onClick={() => handleViewDetailCompany(item)}
                                        className={styles["company-card-new"]}
                                        bodyStyle={{ padding: '16px' }}
                                        hoverable
                                        cover={
                                            <div className={styles["logo-container"]} style={{ position: 'relative' }}>
                                                <img
                                                    alt={item.name}
                                                    src={withBackendUrl(`/storage/company/${item?.logo}`)}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 10,
                                                    right: 10
                                                }}>
                                                    <Tag color="success" style={{ margin: 0, fontSize: 11, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <CheckCircleFilled /> Đã xác thực
                                                    </Tag>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <h3 style={{ 
                                            fontSize: '16px', 
                                            fontWeight: 700, 
                                            color: '#0f172a', 
                                            textAlign: 'center', 
                                            margin: '0 0 6px 0',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {item.name}
                                        </h3>
                                        {item.address && (
                                            <p style={{
                                                fontSize: '12px',
                                                color: '#64748b',
                                                textAlign: 'center',
                                                margin: 0,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 4
                                            }}>
                                                <EnvironmentOutlined /> {item.address}
                                            </p>
                                        )}
                                        <div style={{ marginTop: 12, textAlign: 'center' }}>
                                            <Tag color="blue" style={{ borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 500 }}>
                                                Đang tuyển dụng
                                            </Tag>
                                        </div>
                                    </Card>
                                </Col>
                            ))
                        )}

                        {(!displayCompany || (displayCompany && displayCompany.length === 0)) && !isLoading && (
                            <div className={styles["empty"]}>
                                <Empty description="Hiện chưa có dữ liệu công ty" />
                            </div>
                        )}
                    </Row>

                    {showPagination && (
                        <>
                            <div style={{ marginTop: 30 }}></div>
                            <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 30 }}>
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    showTotal={(total, range) => `Hiển thị ${range[0]}-${range[1]} trên tổng số ${total} công ty`}
                                    responsive
                                    onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                                />
                            </Row>
                        </>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default CompanyCard;
