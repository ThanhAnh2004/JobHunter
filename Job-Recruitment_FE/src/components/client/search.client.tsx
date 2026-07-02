import { Button, Col, Form, Row, Select, notification } from 'antd';
import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { LOCATION_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { callFetchAllSkill } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const SearchClient = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const optionsLocations = LOCATION_LIST;
    const [form] = Form.useForm();
    const [optionsSkills, setOptionsSkills] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (location.search) {
            const queryLocation = searchParams.get("location");
            const querySkills = searchParams.get("skills")
            if (queryLocation) {
                form.setFieldValue("location", queryLocation.split(","))
            }
            if (querySkills) {
                form.setFieldValue("skills", querySkills.split(","))
            }
        }
    }, [location.search])

    useEffect(() => {
        fetchSkill();
    }, [])

    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;

        const res = await callFetchAllSkill(query);
        if (res && res.data) {
            const arr = res?.data?.result?.map(item => {
                return {
                    label: item.name as string,
                    value: item.id + "" as string
                }
            }) ?? [];
            setOptionsSkills(arr);
        }
    }

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
            notification.error({
                message: 'Có lỗi xảy ra',
                description: "Vui lòng chọn tiêu chí để search"
            });
            return;
        }
        navigate(`/job?${query}`);
    }

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={
                {
                    render: () => <></>
                }
            }
        >
            <Row gutter={[15, 15]} align="middle">
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
                                    <MonitorOutlined style={{ marginRight: 8 }} /> Tìm theo kỹ năng (Java, React, Node.js...)...
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
                                    <EnvironmentOutlined style={{ marginRight: 8 }} /> Địa điểm...
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
                        onClick={() => form.submit()} 
                        size="large"
                        style={{ 
                            width: '100%', 
                            height: '40px',
                            background: '#3b82f6', 
                            borderColor: '#3b82f6', 
                            fontWeight: 600,
                            borderRadius: '6px',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>
        </ProForm>
    )
}
export default SearchClient;