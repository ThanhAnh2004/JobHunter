import { Divider, Tabs } from 'antd';
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
import { useAppSelector } from '@/redux/hooks';

const HomePage = () => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '50px' }}>
            {/* Hero Section */}
            <div className={styles["hero-banner"]}>
                <div className={styles["container"]}>
                    <h1 className={styles["hero-title"]}>Khám Phá Việc Làm IT Đỉnh Cao</h1>
                    <p className={styles["hero-subtitle"]}>
                        Tìm kiếm cơ hội nghề nghiệp mơ ước. Kết nối với hơn 500+ doanh nghiệp công nghệ hàng đầu tại Việt Nam.
                    </p>
                    <div className={styles["search-glass-wrapper"]}>
                        <SearchClient />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles["container"]}>
                <CompanyCard />
                <div style={{ margin: '60px 0' }}></div>
                <Divider style={{ borderColor: '#e2e8f0' }} />
                <div style={{ margin: '60px 0' }}></div>
                {isAuthenticated ? (
                    <Tabs
                        defaultActiveKey="latest"
                        items={[
                            {
                                key: 'latest',
                                label: <span style={{ fontSize: '16px', fontWeight: 600 }}>Việc làm mới nhất</span>,
                                children: <JobCard />,
                            },
                            {
                                key: 'recommended',
                                label: <span style={{ fontSize: '16px', fontWeight: 600 }}>Việc làm gợi ý cho bạn</span>,
                                children: <JobCard isRecommended={true} />,
                            },
                        ]}
                    />
                ) : (
                    <JobCard />
                )}
            </div>
        </div>
    )
}

export default HomePage;