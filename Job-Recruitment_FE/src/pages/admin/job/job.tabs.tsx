import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useLocation } from 'react-router-dom';
import JobPage from './job';
import SkillPage from './skill';
import Access from '@/components/share/access';
import { ALL_PERMISSIONS } from '@/config/permissions';
import { useAppSelector } from '@/redux/hooks';

const JobTabs = () => {
    const location = useLocation();
    const currentUser = useAppSelector(state => state.account.user);
    const roleName = (currentUser?.role?.name ?? "").toUpperCase();
    const isSuperAdmin = currentUser?.email === 'admin@gmail.com' || roleName === 'SUPER_ADMIN' || roleName.includes('ADMIN');
    const isHR = location.pathname.startsWith('/hr') || (!isSuperAdmin && (Boolean(currentUser?.company?.id) || roleName === 'HR'));

    if (isHR) {
        return <JobPage />;
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Manage Jobs',
            children: <JobPage />,
        },
        {
            key: '2',
            label: 'Manage Skills',
            children: <SkillPage />,
        },
    ];

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                />
            </Access>
        </div>
    );
}

export default JobTabs;