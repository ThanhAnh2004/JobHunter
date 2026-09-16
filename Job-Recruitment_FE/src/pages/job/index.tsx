import SearchClient from '@/components/client/search.client';
import { Col, Divider, Row, Select, Tag } from 'antd';
import { 
    FilterOutlined, 
    UndoOutlined, 
    EnvironmentOutlined, 
    DollarOutlined, 
    RiseOutlined, 
    AppstoreOutlined,
    SortAscendingOutlined
} from '@ant-design/icons';
import styles from 'styles/client.module.scss';
import JobCard from '@/components/client/card/job.card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CATEGORY_LIST, LOCATION_LIST } from '@/config/utils';

const LEVEL_OPTIONS = [
    { label: 'Thực tập sinh (Intern)', value: 'INTERN' },
    { label: 'Mới đi làm (Fresher)', value: 'FRESHER' },
    { label: 'Junior (1-2 năm)', value: 'JUNIOR' },
    { label: 'Middle (2-4 năm)', value: 'MIDDLE' },
    { label: 'Senior (4+ năm)', value: 'SENIOR' },
];

const SALARY_OPTIONS = [
    { label: 'Dưới 15 triệu', value: 'under15' },
    { label: '15 - 25 triệu', value: '15to25' },
    { label: '25 - 40 triệu', value: '25to40' },
    { label: 'Trên 40 triệu', value: 'over40' },
];

const ClientJobPage = (props: any) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const currentLevel = searchParams.get('level') || '';
    const currentLocation = searchParams.get('location') || '';
    const currentSalary = searchParams.get('salary') || '';
    const currentCategory = searchParams.get('category') || '';
    const currentSort = searchParams.get('sort') || 'updatedAt,desc';

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (params.get(key) === value || !value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        navigate(`/job?${params.toString()}`);
    };

    const handleResetAll = () => {
        navigate('/job');
    };

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', value);
        navigate(`/job?${params.toString()}`);
    };

    return (
        <div className={styles["container"]} style={{ marginTop: 24, marginBottom: 50 }}>
            {/* 1. TOP SEARCH BAR */}
            <div style={{
                background: '#0f172a',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                marginBottom: 24
            }}>
                <SearchClient />
            </div>

            {/* 2. MAIN 2-COLUMN LAYOUT: SIDEBAR FILTER + 20 JOBS SCROLL LIST */}
            <Row gutter={[24, 24]}>
                {/* LEFT SIDEBAR: BỘ LỌC NÂNG CAO */}
                <Col span={24} md={8} lg={6}>
                    <div className={styles["filter-sidebar-panel"]}>
                        <div className={styles["filter-header"]}>
                            <h3 className={styles["filter-title"]}>
                                <FilterOutlined style={{ color: '#2563eb' }} /> Lọc Nâng Cao
                            </h3>
                            <button
                                onClick={handleResetAll}
                                className={styles["btn-reset-filter"]}
                                title="Xóa tất cả bộ lọc"
                            >
                                <UndoOutlined /> Xóa lọc
                            </button>
                        </div>

                        {/* 1. LỌC THEO CẤP BẬC / KINH NGHIỆM */}
                        <div className={styles["filter-section"]}>
                            <div className={styles["section-label"]}>
                                <span><RiseOutlined style={{ marginRight: 6, color: '#64748b' }} /> Cấp bậc / Level</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {LEVEL_OPTIONS.map(lvl => {
                                    const isActive = currentLevel.split(',').includes(lvl.value);
                                    return (
                                        <div
                                            key={lvl.value}
                                            onClick={() => handleFilterChange('level', lvl.value)}
                                            className={`${styles["option-item"]} ${isActive ? styles["active"] : ""}`}
                                        >
                                            <span>{lvl.label}</span>
                                            {isActive && <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>✓</Tag>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <Divider style={{ margin: '14px 0' }} />

                        {/* 2. LỌC THEO MỨC LƯƠNG */}
                        <div className={styles["filter-section"]}>
                            <div className={styles["section-label"]}>
                                <span><DollarOutlined style={{ marginRight: 6, color: '#64748b' }} /> Khoảng Mức Lương</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {SALARY_OPTIONS.map(sal => {
                                    const isActive = currentSalary === sal.value;
                                    return (
                                        <div
                                            key={sal.value}
                                            onClick={() => handleFilterChange('salary', sal.value)}
                                            className={`${styles["option-item"]} ${isActive ? styles["active"] : ""}`}
                                        >
                                            <span>{sal.label}</span>
                                            {isActive && <Tag color="green" style={{ margin: 0, fontSize: 10 }}>✓</Tag>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <Divider style={{ margin: '14px 0' }} />

                        {/* 3. LỌC THEO ĐỊA ĐIỂM */}
                        <div className={styles["filter-section"]}>
                            <div className={styles["section-label"]}>
                                <span><EnvironmentOutlined style={{ marginRight: 6, color: '#64748b' }} /> Địa Điểm Làm Việc</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {LOCATION_LIST.map(loc => {
                                    const isActive = currentLocation.split(',').includes(loc.value);
                                    return (
                                        <div
                                            key={loc.value}
                                            onClick={() => handleFilterChange('location', loc.value)}
                                            className={`${styles["option-item"]} ${isActive ? styles["active"] : ""}`}
                                        >
                                            <span>{loc.label}</span>
                                            {isActive && <Tag color="purple" style={{ margin: 0, fontSize: 10 }}>✓</Tag>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <Divider style={{ margin: '14px 0' }} />

                        {/* 4. LỌC THEO DANH MỤC NGHỀ */}
                        <div className={styles["filter-section"]} style={{ marginBottom: 0 }}>
                            <div className={styles["section-label"]}>
                                <span><AppstoreOutlined style={{ marginRight: 6, color: '#64748b' }} /> Danh Mục Ngành Nghề</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {CATEGORY_LIST.slice(0, 6).map(cat => {
                                    const isActive = currentCategory === cat.id;
                                    return (
                                        <div
                                            key={cat.id}
                                            onClick={() => handleFilterChange('category', cat.id)}
                                            className={`${styles["option-item"]} ${isActive ? styles["active"] : ""}`}
                                            title={cat.name}
                                        >
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {cat.name.split('(')[0].trim()}
                                            </span>
                                            {isActive && <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>✓</Tag>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Col>

                {/* RIGHT COLUMN: DANH SÁCH CUỘN 20 VIỆC LÀM */}
                <Col span={24} md={16} lg={18}>
                    {/* TOP SORT & STATUS BAR */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#ffffff',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        marginBottom: 16,
                        flexWrap: 'wrap',
                        gap: 12
                    }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                            Danh Sách Việc Làm IT Tuyển Dụng
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <SortAscendingOutlined /> Sắp xếp theo:
                            </span>
                            <Select
                                value={currentSort}
                                onChange={handleSortChange}
                                style={{ width: 180 }}
                                options={[
                                    { label: '🕒 Mới cập nhật nhất', value: 'updatedAt,desc' },
                                    { label: '💰 Mức lương cao nhất', value: 'salary,desc' },
                                    { label: '🏢 Theo tên công việc (A-Z)', value: 'name,asc' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* DANH SÁCH 20 VIỆC LÀM CUỘN DỌC */}
                    <JobCard showPagination={true} />
                </Col>
            </Row>
        </div>
    );
};

export default ClientJobPage;