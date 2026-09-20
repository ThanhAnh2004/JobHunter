import { callFetchAllSkill, callFetchJob, callFetchSubscriberSkills } from '@/config/api';
import { withBackendUrl, DEFAULT_COMPANY_LOGO, getCompanyLogoUrl } from '@/config/runtime';
import { convertSlug, formatRelativeTime, getCategoryById, getLocationName } from '@/config/utils';
import { IJob } from '@/types/backend';
import { 
    EnvironmentOutlined, 
    ThunderboltOutlined, 
    HeartOutlined, 
    HeartFilled, 
    ClockCircleOutlined,
    FireFilled,
    CheckCircleOutlined
} from '@ant-design/icons';
import { Card, Col, Empty, Pagination, Row, Spin, Tag, Tooltip, message } from 'antd';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import { sfIn } from "spring-filter-query-builder";
import { useAppSelector } from '@/redux/hooks';

interface IProps {
    showPagination?: boolean;
    isRecommended?: boolean;
}

const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

const resolveSkillIds = (skillTokens: string[], allSkills: { id: number; name: string }[]): number[] => {
    const matchedIds = new Set<number>();

    for (const token of skillTokens) {
        const trimmed = token.trim();
        if (!trimmed) continue;

        // Neu truyen ID so
        if (!isNaN(+trimmed)) {
            const foundById = allSkills.find(s => s.id === +trimmed);
            if (foundById) {
                matchedIds.add(foundById.id);
                continue;
            }
        }

        const normToken = normalize(trimmed);
        if (!normToken) continue;

        for (const skill of allSkills) {
            const normSkillName = normalize(skill.name || '');
            if (normSkillName === normToken || normSkillName.includes(normToken) || normToken.includes(normSkillName)) {
                matchedIds.add(skill.id);
            }
        }
    }

    return Array.from(matchedIds);
};

const JobCard = (props: IProps) => {
    const { showPagination = false, isRecommended = false } = props;

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allSkills, setAllSkills] = useState<{ id: number; name: string }[]>([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(showPagination ? 20 : 6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    // Load tat ca skills de tra cuu
    useEffect(() => {
        const loadSkills = async () => {
            try {
                const res = await callFetchAllSkill('page=1&size=100');
                if (res && res.data && res.data.result) {
                    setAllSkills(res.data.result.map((item: any) => ({
                        id: item.id,
                        name: item.name
                    })));
                }
            } catch (err) {
                console.error("Error loading skills in JobCard:", err);
            }
        };
        loadSkills();
    }, []);

    // Lưu danh sách id job đã bookmark trong localStorage
    const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('BOOKMARKED_JOBS');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const toggleBookmark = (e: React.MouseEvent, jobId: string | undefined) => {
        e.stopPropagation();
        if (!jobId) return;

        // KIỂM TRA ĐĂNG NHẬP: Chưa đăng nhập thì chưa lưu được việc làm!
        if (!isAuthenticated) {
            message.warning('Vui lòng đăng nhập tài khoản để lưu tin tuyển dụng này!');
            navigate('/login');
            return;
        }

        let updated: string[];
        if (bookmarkedIds.includes(jobId)) {
            updated = bookmarkedIds.filter(id => id !== jobId);
            message.info('Đã bỏ lưu tin tuyển dụng');
        } else {
            updated = [...bookmarkedIds, jobId];
            message.success('Đã lưu tin tuyển dụng thành công!');
        }
        setBookmarkedIds(updated);
        localStorage.setItem('BOOKMARKED_JOBS', JSON.stringify(updated));
    };

    useEffect(() => {
        setCurrent(1);
    }, [location.search]);

    useEffect(() => {
        fetchJob();
    }, [current, pageSize, filter, sortQuery, location.search, allSkills.length]);

    const fetchJob = async () => {
        setIsLoading(true);
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        
        const urlSort = searchParams.get("sort");
        if (urlSort) {
            query += `&sort=${urlSort}`;
        } else if (sortQuery) {
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
        const querySkills = searchParams.get("skills");
        const queryCategory = searchParams.get("category");
        const queryLevel = searchParams.get("level");
        const querySalary = searchParams.get("salary");

        let skillTokensToMatch: string[] = [];
        if (queryCategory) {
            const catDef = getCategoryById(queryCategory);
            if (catDef && catDef.skills) {
                skillTokensToMatch.push(...catDef.skills);
            }
        }
        if (querySkills) {
            skillTokensToMatch.push(...querySkills.split(","));
        }

        let hasSkillFilter = skillTokensToMatch.length > 0;
        let matchedSkillIds: number[] = [];

        if (hasSkillFilter) {
            let currentSkills = allSkills;
            if (currentSkills.length === 0) {
                try {
                    const resSkills = await callFetchAllSkill('page=1&size=100');
                    if (resSkills?.data?.result) {
                        currentSkills = resSkills.data.result.map((s: any) => ({ id: s.id, name: s.name }));
                        setAllSkills(currentSkills);
                    }
                } catch (e) {
                    console.error("Error fetching skills on demand:", e);
                }
            }
            matchedSkillIds = resolveSkillIds(skillTokensToMatch, currentSkills);
            if (matchedSkillIds.length === 0) {
                setDisplayJob([]);
                setTotal(0);
                setIsLoading(false);
                return;
            }
        }

        let filterParts: string[] = [];
        if (recommendedFilter) filterParts.push(recommendedFilter);

        if (queryLocation) {
            filterParts.push(sfIn("location", queryLocation.split(",")).toString());
        }

        if (hasSkillFilter && matchedSkillIds.length > 0) {
            filterParts.push(sfIn("skills", matchedSkillIds).toString());
        }

        if (queryLevel) {
            filterParts.push(sfIn("level", queryLevel.split(",")).toString());
        }

        if (querySalary) {
            if (querySalary === 'under15') {
                filterParts.push("salary < 15000000");
            } else if (querySalary === '15to25') {
                filterParts.push("salary >= 15000000 and salary <= 25000000");
            } else if (querySalary === '25to40') {
                filterParts.push("salary >= 25000000 and salary <= 40000000");
            } else if (querySalary === 'over40') {
                filterParts.push("salary >= 40000000");
            }
        }

        if (filterParts.length > 0) {
            const combinedFilter = filterParts.join(" and ");
            query += `&filter=${encodeURIComponent(combinedFilter)}`;
        }

        const res = await callFetchJob(query);
        if (res && res.data) {
            setDisplayJob(res.data.result);
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

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item.id}`);
    };

    const formatSalary = (salary: number | string | undefined) => {
        if (!salary || +salary === 0) return "Thỏa thuận";
        const num = Number(salary);
        if (num >= 1000000) {
            const millions = num / 1000000;
            return `${millions % 1 === 0 ? millions : millions.toFixed(1)} triệu`;
        }
        return `${num.toLocaleString('vi-VN')} đ`;
    };

    const hasFilter = !!(searchParams.get("location") || searchParams.get("skills") || searchParams.get("category") || searchParams.get("level") || searchParams.get("salary"));

    return (
        <div className={`${styles["card-job-section"]}`}>
            <div className={`${styles["job-content"]}`}>
                <Spin spinning={isLoading} tip="Đang tải danh sách việc làm...">
                    <Row gutter={[16, 16]}>
                        {showPagination && hasFilter && (
                            <Col span={24}>
                                <div style={{
                                    marginBottom: 14,
                                    padding: '12px 18px',
                                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                    borderRadius: 10,
                                    border: '1px solid #bfdbfe',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: 10
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                        <span style={{ fontWeight: 600, color: '#1e40af', fontSize: 14 }}>
                                            🎯 Đang lọc:
                                        </span>
                                        {searchParams.get("category") && (
                                            <Tag color="blue" style={{ fontWeight: 600, borderRadius: 6, margin: 0, padding: '2px 8px' }}>
                                                🏷️ {getCategoryById(searchParams.get("category") || "")?.name || searchParams.get("category")}
                                            </Tag>
                                        )}
                                        {searchParams.get("skills") && (
                                            <Tag color="cyan" style={{ fontWeight: 600, borderRadius: 6, margin: 0, padding: '2px 8px' }}>
                                                ⚡ {searchParams.get("skills")}
                                            </Tag>
                                        )}
                                        {searchParams.get("location") && (
                                            <Tag color="green" style={{ fontWeight: 600, borderRadius: 6, margin: 0, padding: '2px 8px' }}>
                                                📍 {getLocationName(searchParams.get("location") || "")}
                                            </Tag>
                                        )}
                                        {searchParams.get("level") && (
                                            <Tag color="purple" style={{ fontWeight: 600, borderRadius: 6, margin: 0, padding: '2px 8px' }}>
                                                ⭐ {searchParams.get("level")}
                                            </Tag>
                                        )}
                                        <span style={{ color: '#475569', fontSize: 13, marginLeft: 4 }}>
                                            — Tìm thấy <strong style={{ color: '#2563eb' }}>{total}</strong> việc làm phù hợp
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/job')}
                                        style={{
                                            border: 'none',
                                            background: '#ef4444',
                                            color: '#ffffff',
                                            padding: '5px 14px',
                                            borderRadius: 6,
                                            fontWeight: 600,
                                            fontSize: 12,
                                            cursor: 'pointer',
                                            transition: 'opacity 0.2s'
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                                    >
                                        ✕ Xóa bộ lọc
                                    </button>
                                </div>
                            </Col>
                        )}

                        {!showPagination && (
                            <Col span={24}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <FireFilled style={{ color: '#ef4444' }} /> Việc Làm IT Tuyển Gấp & Hấp Dẫn
                                        </h2>
                                        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
                                            Các cơ hội việc làm IT mới nhất từ các nhà tuyển dụng hàng đầu
                                        </p>
                                    </div>
                                    <Link 
                                        to="/job" 
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
                                        Xem tất cả việc làm &rarr;
                                    </Link>
                                </div>
                            </Col>
                        )}

                        {displayJob?.map(item => {
                            const isSaved = item.id ? bookmarkedIds.includes(String(item.id)) : false;
                            const isHot = (Number(item.salary) >= 25000000) || (item.level === 'SENIOR');

                            // NẾU Ở TRANG /job (showPagination = true): HIỂN THỊ DẠNG CUỘN TOPCV CARD 1 CỘT (FULL WIDTH)
                            if (showPagination) {
                                return (
                                    <Col span={24} key={item.id}>
                                        <Card
                                            className={styles["job-card-topcv"]}
                                            bodyStyle={{ padding: '16px 20px' }}
                                            hoverable
                                            onClick={() => handleViewDetailJob(item)}
                                        >
                                            {isHot && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                                                    color: '#ffffff',
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    padding: '2px 10px',
                                                    borderBottomLeftRadius: 8,
                                                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
                                                }}>
                                                    🔥 HOT
                                                </div>
                                            )}

                                            <div className={styles["topcv-body"]}>
                                                <div className={styles["topcv-logo-wrapper"]}>
                                                    <img
                                                        alt={item.company?.name || 'Company'}
                                                        src={getCompanyLogoUrl(item?.company?.logo)}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            if (target.src !== DEFAULT_COMPANY_LOGO) {
                                                                target.src = DEFAULT_COMPANY_LOGO;
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <div className={styles["topcv-main-content"]}>
                                                    <div className={styles["topcv-title-row"]}>
                                                        <h3 className={styles["topcv-job-title"]} title={item.name}>
                                                            {item.name}
                                                        </h3>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            <span className={styles["topcv-salary"]}>
                                                                <ThunderboltOutlined style={{ marginRight: 4 }} />
                                                                {formatSalary(item.salary)}
                                                            </span>
                                                            <Tooltip title={isSaved ? "Bỏ lưu tin" : "Lưu tin này"}>
                                                                <span
                                                                    onClick={(e) => toggleBookmark(e, String(item.id))}
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        fontSize: 19,
                                                                        color: isSaved ? '#ef4444' : '#cbd5e1',
                                                                        transition: 'all 0.2s',
                                                                        display: 'flex',
                                                                        alignItems: 'center'
                                                                    }}
                                                                >
                                                                    {isSaved ? <HeartFilled /> : <HeartOutlined />}
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    </div>

                                                    <div className={styles["topcv-company-name"]}>
                                                        <Tag color="orange" style={{ margin: 0, fontSize: 10, borderRadius: 4, fontWeight: 700, padding: '0 4px' }}>
                                                            PRO
                                                        </Tag>
                                                        <span title={item.company?.name}>{item.company?.name}</span>
                                                    </div>

                                                    <div className={styles["topcv-tags-row"]}>
                                                        <Tag color="default" style={{ borderRadius: 4, background: '#f1f5f9', borderColor: '#e2e8f0', color: '#475569', fontSize: 12 }}>
                                                            <EnvironmentOutlined style={{ marginRight: 4 }} />
                                                            {getLocationName(item.location)}
                                                        </Tag>
                                                        {item.level && (
                                                            <Tag color="blue" style={{ borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
                                                                {item.level}
                                                            </Tag>
                                                        )}
                                                        {item.skills?.map((skill: any) => (
                                                            <Tag key={skill.id || skill.name} color="geekblue" style={{ borderRadius: 4, fontSize: 12 }}>
                                                                {skill.name}
                                                            </Tag>
                                                        ))}
                                                    </div>

                                                    <div className={styles["topcv-footer-row"]}>
                                                        <span className={styles["topcv-location-info"]}>
                                                            Số lượng tuyển: <strong style={{ color: '#0f172a' }}>{item.quantity || 1} người</strong>
                                                        </span>
                                                        <span className={styles["topcv-time-info"]}>
                                                            <ClockCircleOutlined /> {formatRelativeTime(item.updatedAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                );
                            }

                            // NẾU Ở TRANG CHỦ (!showPagination): HIỂN THỊ DẠNG GRID 2 CỘT GỌN GÀNG
                            return (
                                <Col span={24} md={12} key={item.id}>
                                    <Card 
                                        className={styles["job-card-new"]}
                                        bodyStyle={{ padding: '18px' }}
                                        hoverable
                                        onClick={() => handleViewDetailJob(item)}
                                        style={{ position: 'relative', overflow: 'hidden' }}
                                    >
                                        {isHot && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                                                color: '#ffffff',
                                                fontSize: 10,
                                                fontWeight: 700,
                                                padding: '2px 10px',
                                                borderBottomLeftRadius: 8,
                                                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
                                            }}>
                                                🔥 HOT
                                            </div>
                                        )}

                                        <div className={styles["card-body"]}>
                                            <div className={styles["logo-left"]}>
                                                <img
                                                    alt={item.company?.name || 'Company'}
                                                    src={getCompanyLogoUrl(item?.company?.logo)}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        if (target.src !== DEFAULT_COMPANY_LOGO) {
                                                            target.src = DEFAULT_COMPANY_LOGO;
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className={styles["content-right"]}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                                                    <div className={styles["job-name"]} title={item.name}>
                                                        {item.name}
                                                    </div>
                                                    <Tooltip title={isSaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}>
                                                        <div 
                                                            onClick={(e) => toggleBookmark(e, String(item.id))}
                                                            style={{
                                                                cursor: 'pointer',
                                                                fontSize: 18,
                                                                color: isSaved ? '#ef4444' : '#94a3b8',
                                                                padding: '0 4px',
                                                                transition: 'transform 0.2s ease',
                                                                flexShrink: 0
                                                            }}
                                                        >
                                                            {isSaved ? <HeartFilled /> : <HeartOutlined />}
                                                        </div>
                                                    </Tooltip>
                                                </div>

                                                <div className={styles["company-name"]} title={item.company?.name}>
                                                    {item.company?.name}
                                                </div>

                                                <div className={styles["info-row"]}>
                                                    <span style={{ fontWeight: 700, color: '#16a34a', fontSize: 14 }}>
                                                        <ThunderboltOutlined style={{ color: '#16a34a' }} />
                                                        {formatSalary(item.salary)}
                                                    </span>
                                                    <span>
                                                        <EnvironmentOutlined style={{ color: '#64748b' }} /> 
                                                        {getLocationName(item.location)}
                                                    </span>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                        {item.level && (
                                                            <Tag color="blue" style={{ margin: 0, fontSize: 11, borderRadius: 4 }}>
                                                                {item.level}
                                                            </Tag>
                                                        )}
                                                        {item.skills?.slice(0, 2).map((skill: any) => (
                                                            <Tag key={skill.id || skill.name} color="default" style={{ margin: 0, fontSize: 11, borderRadius: 4 }}>
                                                                {skill.name}
                                                            </Tag>
                                                        ))}
                                                        {item.skills && item.skills.length > 2 && (
                                                            <Tag color="default" style={{ margin: 0, fontSize: 11, borderRadius: 4 }}>
                                                                +{item.skills.length - 2}
                                                            </Tag>
                                                        )}
                                                    </div>

                                                    <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <ClockCircleOutlined /> {formatRelativeTime(item.updatedAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}

                        {(!displayJob || (displayJob && displayJob.length === 0)) && !isLoading && (
                            <div className={styles["empty"]}>
                                <Empty description="Hiện chưa có việc làm nào phù hợp" />
                            </div>
                        )}
                    </Row>

                    {showPagination && (
                        <>
                            <div style={{ marginTop: 30 }}></div>
                            <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    showTotal={(total, range) => `Hiển thị ${range[0]}-${range[1]} trên tổng số ${total} việc làm`}
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

export default JobCard;
