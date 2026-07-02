import { callFetchJob, callFetchSubscriberSkills } from '@/config/api';
import { withBackendUrl } from '@/config/runtime';
import { convertSlug, getLocationName } from '@/config/utils';
import { IJob } from '@/types/backend';
import { EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Pagination, Row, Spin, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import { sfIn } from "spring-filter-query-builder";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


interface IProps {
    showPagination?: boolean;
    isRecommended?: boolean;
}

const JobCard = (props: IProps) => {
    const { showPagination = false, isRecommended = false } = props;

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        fetchJob();
    }, [current, pageSize, filter, sortQuery, location]);

    const fetchJob = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        let recommendedFilter = "";
        if (isRecommended) {
            try {
                const subRes = await callFetchSubscriberSkills();
                if (subRes && subRes.data && subRes.data.skills) {
                    const skillIds = subRes.data.skills.map((s: any) => s.id);
                    if (skillIds.length > 0) {
                        recommendedFilter = sfIn("skills", skillIds).toString();
                    } else {
                        setDisplayJob([]);
                        setTotal(0);
                        setIsLoading(false);
                        return;
                    }
                } else {
                    setDisplayJob([]);
                    setTotal(0);
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                console.error("Error fetching recommended jobs: ", err);
            }
        }

        //check query string
        const queryLocation = searchParams.get("location");
        const querySkills = searchParams.get("skills")
        if (queryLocation || querySkills || recommendedFilter) {
            let q = recommendedFilter || "";
            if (queryLocation) {
                const locPart = sfIn("location", queryLocation.split(",")).toString();
                q = q ? q + " and " + locPart : locPart;
            }

            if (querySkills) {
                const skillsPart = sfIn("skills", querySkills.split(",")).toString();
                q = q ? q + " and " + skillsPart : skillsPart;
            }

            query += `&filter=${encodeURIComponent(q)}`;
        }

        const res = await callFetchJob(query);
        if (res && res.data) {
            setDisplayJob(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false);
    }



    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item.id}`)
    }

    return (
        <div className={`${styles["card-job-section"]}`}>
            <div className={`${styles["job-content"]}`}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[24, 24]}>
                        <Col span={24}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                                <div>
                                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                                        Cơ Hội Việc Làm Mới Nhất
                                    </h2>
                                    <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                                        Tìm kiếm cơ hội việc làm phù hợp nhất với kỹ năng của bạn
                                    </p>
                                </div>
                                {!showPagination &&
                                    <Link 
                                        to="job" 
                                        style={{ 
                                            fontWeight: 600, 
                                            color: '#3b82f6', 
                                            fontSize: '15px', 
                                            transition: 'color 0.2s' 
                                        }}
                                    >
                                        Xem tất cả &rarr;
                                    </Link>
                                }
                            </div>
                        </Col>

                        {displayJob?.map(item => {
                            return (
                                <Col span={24} md={12} key={item.id}>
                                    <Card 
                                        className={styles["job-card-new"]}
                                        bodyStyle={{ padding: '16px' }}
                                        hoverable
                                        onClick={() => handleViewDetailJob(item)}
                                    >
                                        <div className={styles["card-body"]}>
                                            <div className={styles["logo-left"]}>
                                                <img
                                                    alt={item.company?.name}
                                                    src={withBackendUrl(`/storage/company/${item?.company?.logo}`)}
                                                />
                                            </div>
                                            <div className={styles["content-right"]}>
                                                <div className={styles["job-name"]} title={item.name}>
                                                    {item.name}
                                                </div>
                                                <div className={styles["company-name"]} title={item.company?.name}>
                                                    {item.company?.name}
                                                </div>
                                                <div className={styles["info-row"]}>
                                                    <span>
                                                        <EnvironmentOutlined style={{ color: '#64748b' }} /> 
                                                        {getLocationName(item.location)}
                                                    </span>
                                                    <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                                                        <ThunderboltOutlined style={{ color: '#f59e0b' }} />
                                                        {(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                                    </span>
                                                    <Tag color="orange" style={{ border: 'none', borderRadius: '4px', fontSize: '11px', margin: 0 }}>
                                                        {item.level}
                                                    </Tag>
                                                    {item.compatibilityScore !== undefined && item.compatibilityScore > 0 && (
                                                        <Tag color="green" style={{ border: 'none', borderRadius: '4px', fontSize: '11px', margin: 0, fontWeight: 'bold', background: '#ecfdf5', color: '#047857' }}>
                                                            {item.compatibilityScore}% Match
                                                        </Tag>
                                                    )}
                                                </div>

                                                {/* Skill Tags */}
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                                                    {item.skills?.map(skill => (
                                                        <Tag key={skill.id} color="blue" style={{ border: 'none', borderRadius: '4px', fontSize: '11px', margin: 0, background: '#eff6ff', color: '#1d4ed8' }}>
                                                            {skill.name}
                                                        </Tag>
                                                    ))}
                                                </div>

                                                <div style={{ 
                                                    textAlign: 'right', 
                                                    fontSize: '12px', 
                                                    color: '#94a3b8', 
                                                    marginTop: '10px',
                                                    borderTop: '1px solid #f1f5f9',
                                                    paddingTop: '8px'
                                                }}>
                                                    {item.updatedAt ? dayjs(item.updatedAt).locale('en').fromNow() : dayjs(item.createdAt).locale('en').fromNow()}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            )
                        })}


                        {(!displayJob || displayJob && displayJob.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>
                    {showPagination && <>
                        <div style={{ marginTop: 30 }}></div>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>
    )
}

export default JobCard;
