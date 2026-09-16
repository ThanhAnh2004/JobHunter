import { Button, Col, Input, Row } from 'antd';
import { SearchOutlined, BankOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from 'styles/client.module.scss';
import CompanyCard from '@/components/client/card/company.card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ClientCompanyPage = (props: any) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState(searchParams.get("name") || "");

    useEffect(() => {
        setKeyword(searchParams.get("name") || "");
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (keyword.trim()) {
            params.set("name", keyword.trim());
        } else {
            params.delete("name");
        }
        navigate(`/company?${params.toString()}`);
    };

    return (
        <div className={styles["container"]} style={{ marginTop: 24, marginBottom: 50 }}>
            {/* SEARCH HEADER */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '36px 30px',
                borderRadius: '16px',
                color: '#ffffff',
                marginBottom: 24,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
            }}>
                <div style={{ maxWidth: 800 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <BankOutlined style={{ color: '#3b82f6' }} /> Danh Sách Doanh Nghiệp & Công Ty IT Hàng Đầu
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
                        Tra cứu thông tin, môi trường làm việc và các cơ hội nghề nghiệp tại hơn hàng trăm công ty công nghệ uy tín
                    </p>
                    <div style={{ display: 'flex', gap: 10, maxWidth: 600 }}>
                        <Input
                            placeholder="Nhập tên công ty cần tìm (FPT, Viettel, VNG, MoMo...)..."
                            size="large"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onPressEnter={handleSearch}
                            allowClear
                            prefix={<SearchOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
                            style={{ borderRadius: 8 }}
                        />
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSearch}
                            style={{
                                background: '#3b82f6',
                                borderColor: '#3b82f6',
                                fontWeight: 700,
                                borderRadius: 8,
                                padding: '0 24px'
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </div>

            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <CompanyCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default ClientCompanyPage;