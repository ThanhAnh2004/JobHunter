import { Button, Col, Form, Row, Select, notification, Tag, Space } from 'antd';
import { EnvironmentOutlined, MonitorOutlined, FireOutlined, SearchOutlined } from '@ant-design/icons';
import { LOCATION_LIST, getCategoryById } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { callFetchAllSkill } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const HOT_KEYWORDS = [
    { label: 'Java', type: 'skill', value: 'Java' },
    { label: 'ReactJS', type: 'skill', value: 'ReactJS' },
    { label: 'NodeJS', type: 'skill', value: 'NodeJS' },
    { label: 'Python', type: 'skill', value: 'Python' },
    { label: 'Golang', type: 'skill', value: 'Golang' },
    { label: 'DevOps', type: 'skill', value: 'DevOps' },
    { label: 'Tester / QA', type: 'skill', value: 'Tester' },
    { label: 'Flutter', type: 'skill', value: 'Flutter' },
    { label: 'Hà Nội', type: 'location', value: 'HANOI' },
    { label: 'Hồ Chí Minh', type: 'location', value: 'HOCHIMINH' },
    { label: 'Đà Nẵng', type: 'location', value: 'DANANG' },
    { label: 'Cần Thơ', type: 'location', value: 'CANTHO' },
    { label: 'Hải Phòng', type: 'location', value: 'HAIPHONG' },
];

const SearchClient = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const optionsLocations = LOCATION_LIST;
    const [form] = Form.useForm();
    const [optionsSkills, setOptionsSkills] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchSkill();
    }, []);

    useEffect(() => {
        const queryLocation = searchParams.get("location");
        const querySkills = searchParams.get("skills");
        const queryCategory = searchParams.get("category");

        if (queryLocation) {
            form.setFieldValue("location", queryLocation.split(","));
        } else {
            form.setFieldValue("location", undefined);
        }

        if (querySkills) {
            form.setFieldValue("skills", querySkills.split(","));
        } else if (queryCategory) {
            const catDef = getCategoryById(queryCategory);
            if (catDef && catDef.skills) {
                form.setFieldValue("skills", catDef.skills);
            }
        } else {
            form.setFieldValue("skills", undefined);
        }
    }, [location.search, optionsSkills]);

    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;

        const res = await callFetchAllSkill(query);
        if (res && res.data) {
            const arr = res?.data?.result?.map(item => {
                return {
                    label: item.name as string,
                    value: item.name as string
                };
            }) ?? [];
            setOptionsSkills(arr);
        }
    };

    const onFinish = async (values: any) => {
        let query = "";
        if (values?.location?.length) {
            query = `location=${values?.location?.join(",")}`;
        }
        if (values?.skills?.length) {
            query = values.location?.length ? query + `&skills=${values?.skills?.join(",")}`
                :
                `skills=${values?.skills?.join(",")}`;
        }

        if (!query) {
            navigate(`/job`);
            return;
        }
        navigate(`/job?${query}`);
    };

    const handleQuickKeywordClick = (kw: typeof HOT_KEYWORDS[0]) => {
        if (kw.type === 'location' && kw.value) {
            navigate(`/job?location=${kw.value}`);
            return;
        }

        if (kw.type === 'skill' && kw.value) {
            navigate(`/job?skills=${kw.value}`);
            return;
        }

        navigate(`/job`);
    };

    return (
        <div style={{ width: '100%' }}>
            <ProForm
                form={form}
                onFinish={onFinish}
                submitter={{
                    render: () => <></>
                }}
            >
                <Row gutter={[12, 12]} align="middle">
                    <Col span={24} md={14}>
                        <ProForm.Item
                            name="skills"
                            style={{ marginBottom: 0 }}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <span style={{ color: '#94a3b8' }}>
                                        <MonitorOutlined style={{ marginRight: 8 }} /> Tìm theo kỹ năng (Java, React, Node.js, Python...)...
                                    </span>
                                }
                                optionLabelProp="label"
                                options={optionsSkills}
                                size="large"
                            />
                        </ProForm.Item>
                    </Col>
                    <Col span={24} sm={16} md={6}>
                        <ProForm.Item
                            name="location"
                            style={{ marginBottom: 0 }}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <span style={{ color: '#94a3b8' }}>
                                        <EnvironmentOutlined style={{ marginRight: 8 }} /> Địa điểm làm việc...
                                    </span>
                                }
                                optionLabelProp="label"
                                options={optionsLocations}
                                size="large"
                            />
                        </ProForm.Item>
                    </Col>
                    <Col span={24} sm={8} md={4}>
                        <Button 
                            type='primary' 
                            icon={<SearchOutlined />}
                            onClick={() => form.submit()} 
                            size="large"
                            style={{ 
                                width: '100%', 
                                height: '40px',
                                background: '#3b82f6', 
                                borderColor: '#3b82f6', 
                                fontWeight: 700,
                                borderRadius: '8px',
                                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </Col>
                </Row>
            </ProForm>

            {/* Quick Hot Keywords */}
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                <span style={{ fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginRight: 4, fontWeight: 500 }}>
                    <FireOutlined style={{ color: '#f59e0b' }} /> Tìm kiếm phổ biến:
                </span>
                {HOT_KEYWORDS.map((kw, idx) => (
                    <Tag
                        key={idx}
                        onClick={() => handleQuickKeywordClick(kw)}
                        style={{
                            cursor: 'pointer',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#e2e8f0',
                            borderRadius: 14,
                            padding: '2px 10px',
                            fontSize: 12,
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                            margin: 0
                        }}
                    >
                        {kw.label}
                    </Tag>
                ))}
            </div>
        </div>
    )
}
export default SearchClient;