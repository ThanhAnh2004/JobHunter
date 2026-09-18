import React from 'react';
import { Divider, Tabs } from 'antd';
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
import HotCategories from '@/components/client/home/hot-categories';
import CareerToolkit from '@/components/client/home/career-toolkit';
import StatsCounter from '@/components/client/home/stats-counter';
import CareerBlog from '@/components/client/home/career-blog';
import { useAppSelector } from '@/redux/hooks';
import { FireFilled, ThunderboltFilled, StarFilled } from '@ant-design/icons';

const HomePage = () => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
            {/* 1. HERO SECTION */}
            <div className={styles["hero-banner"]}>
                <div className={styles["container"]}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 16px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(96, 165, 250, 0.3)',
                        borderRadius: 20,
                        fontSize: 13,
                        color: '#60a5fa',
                        fontWeight: 600,
                        marginBottom: 16,
                        backdropFilter: 'blur(8px)'
                    }}>
                        <ThunderboltFilled style={{ color: '#fbbf24' }} /> CỔNG THÔNG TIN TUYỂN DỤNG IT CHẤT LƯỢNG
                    </div>

                    <h1 className={styles["hero-title"]}>
                        Khám Phá Cơ Hội Việc Làm IT Phù Hợp
                    </h1>
                    <p className={styles["hero-subtitle"]}>
                        Kết nối ứng viên tài năng với các nhà tuyển dụng công nghệ uy tín tại Việt Nam.
                    </p>
                    <div className={styles["search-glass-wrapper"]}>
                        <SearchClient />
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className={styles["container"]}>
                {/* 2. TOP NGÀNH NGHỀ NỔI BẬT */}
                <HotCategories />

                <Divider style={{ borderColor: '#e2e8f0', margin: '40px 0' }} />

                {/* 3. VIỆC LÀM TUYỂN GẤP / MỚI NHẤT */}
                {isAuthenticated ? (
                    <Tabs
                        defaultActiveKey="latest"
                        size="large"
                        items={[
                            {
                                key: 'latest',
                                label: (
                                    <span style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <FireFilled style={{ color: '#ef4444' }} /> Việc làm mới nhất
                                    </span>
                                ),
                                children: <JobCard />,
                            },
                            {
                                key: 'recommended',
                                label: (
                                    <span style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <StarFilled style={{ color: '#f59e0b' }} /> Việc làm gợi ý theo kỹ năng
                                    </span>
                                ),
                                children: <JobCard isRecommended={true} />,
                            },
                        ]}
                    />
                ) : (
                    <JobCard />
                )}

                <Divider style={{ borderColor: '#e2e8f0', margin: '40px 0' }} />

                {/* 4. BỘ TIỆN ÍCH DÀNH CHO ỨNG VIÊN (TÍNH LƯƠNG GROSS-NET, LỘ TRÌNH IT, BÁO CÁO LƯƠNG, PHỎNG VẤN) */}
                <CareerToolkit />

                <Divider style={{ borderColor: '#e2e8f0', margin: '40px 0' }} />

                {/* 5. DOANH NGHIỆP TIÊU BIỂU */}
                <CompanyCard />

                {/* 6. SỐ LIỆU THỐNG KÊ UY TÍN */}
                <StatsCounter />

                {/* 7. CẨM NANG NGHỀ NGHIỆP & PHỎNG VẤN */}
                <CareerBlog />
            </div>
        </div>
    );
};

export default HomePage;