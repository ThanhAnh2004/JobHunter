import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IJob } from "@/types/backend";
import { callFetchJobById } from "@/config/api";
import { withBackendUrl } from "@/config/runtime";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag, Button } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined, MessageOutlined } from "@ant-design/icons";
import { getLocationName, cleanHtmlDescription, formatRelativeTime } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
import { useAppSelector } from "@/redux/hooks";
dayjs.extend(relativeTime)


const ClientJobDetailPage = (props: any) => {
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const routeParams = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    let targetId = searchParams.get("id");
    if (!targetId && routeParams.id) {
        if (/^\d+$/.test(routeParams.id)) {
            targetId = routeParams.id;
        } else {
            const parts = routeParams.id.split("-");
            const lastPart = parts[parts.length - 1];
            if (/^\d+$/.test(lastPart)) {
                targetId = lastPart;
            }
        }
    }

    useEffect(() => {
        const init = async () => {
            if (targetId) {
                setIsLoading(true)
                const res = await callFetchJobById(targetId);
                if (res?.data) {
                    setJobDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [targetId]);

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {jobDetail && jobDetail.id &&
                        <>
                            <Col span={24} md={16}>
                                <div className={styles["header"]}>
                                    {jobDetail.name}
                                </div>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={styles["btn-apply"]}
                                    >Apply Now</button>
                                    <Button
                                        size="large"
                                        icon={<MessageOutlined style={{ color: '#2563eb' }} />}
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                navigate('/login');
                                                return;
                                            }
                                            navigate(`/chat?companyId=${jobDetail.company?.id}&jobId=${jobDetail.id}`);
                                        }}
                                        style={{
                                            borderRadius: 8,
                                            height: 40,
                                            borderColor: '#2563eb',
                                            color: '#2563eb',
                                            fontWeight: 600,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6
                                        }}
                                    >
                                        Nhắn tin với NTD
                                    </Button>
                                </div>
                                <Divider />
                                <div className={styles["skills"]}>
                                    {jobDetail?.skills?.map((item, index) => {
                                        return (
                                            <Tag key={`${index}-key`} color="gold" >
                                                {item.name}
                                            </Tag>
                                        )
                                    })}
                                </div>
                                <div className={styles["salary"]}>
                                    <DollarOutlined />
                                    <span>&nbsp;{(jobDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                                </div>
                                <div className={styles["location"]}>
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(jobDetail.location)}
                                </div>
                                <div>
                                    <HistoryOutlined /> {formatRelativeTime(jobDetail.updatedAt || jobDetail.createdAt)}
                                </div>
                                <Divider />
                                {parse(cleanHtmlDescription(jobDetail.description))}
                            </Col>

                            <Col span={24} md={8}>
                                <div className={styles["company"]}>
                                    <div>
                                        <img
                                            width={"200px"}
                                            alt="example"
                                    src={withBackendUrl(`/storage/company/${jobDetail.company?.logo}`)}
                                        />
                                    </div>
                                    <div>
                                        {jobDetail.company?.name}
                                    </div>
                                </div>
                            </Col>
                        </>
                    }
                </Row>
            }
            <ApplyModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                jobDetail={jobDetail}
            />
        </div>
    )
}
export default ClientJobDetailPage;
