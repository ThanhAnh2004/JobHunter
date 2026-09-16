import { useEffect, useRef, useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import NotFound from 'components/share/not.found';
import Loading from 'components/share/loading';
import LoginPage from 'pages/auth/login';
import RegisterPage from 'pages/auth/register';
import LayoutAdmin from 'components/admin/layout.admin';
import LayoutHR from 'components/hr/layout.hr';
import ProtectedRoute from 'components/share/protected-route.ts';
import Header from 'components/client/header.client';
import Footer from 'components/client/footer.client';
import HomePage from 'pages/home';
import styles from 'styles/app.module.scss';
import DashboardPage from './pages/admin/dashboard';
import HrDashboardPage from './pages/hr/dashboard.hr';
import CompanyPage from './pages/admin/company';
import PermissionPage from './pages/admin/permission';
import ResumePage from './pages/admin/resume';
import InterviewPage from './pages/admin/interview';
import RolePage from './pages/admin/role';
import UserPage from './pages/admin/user';
import { fetchAccount } from './redux/slice/accountSlide';
import LayoutApp from './components/share/layout.app';
import ViewUpsertJob from './components/admin/job/upsert.job';
import ClientJobPage from './pages/job';
import ClientJobDetailPage from './pages/job/detail';
import ClientCompanyPage from './pages/company';
import ClientCompanyDetailPage from './pages/company/detail';
import JobTabs from './pages/admin/job/job.tabs';
import ClientChatPage from './pages/chat';
import HrChatPage from './pages/hr/chat.hr';
import AdminChatPage from './pages/admin/chat.admin';
import AboutPage from './pages/info/about';
import TermsPage from './pages/info/terms';
import PrivacyPage from './pages/info/privacy';
import FaqPage from './pages/info/faq';
import SiteSettingsPage from './pages/admin/settings';

const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [location]);

  return (
    <div className='layout-app' ref={rootRef}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles['content-app']}>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);


  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;
    dispatch(fetchAccount())
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: (<LayoutApp><LayoutClient /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "job", element: <ClientJobPage /> },
        { path: "job/:id", element: <ClientJobDetailPage /> },
        { path: "company", element: <ClientCompanyPage /> },
        { path: "company/:id", element: <ClientCompanyDetailPage /> },
        { path: "chat", element: <ClientChatPage /> },
        { path: "about", element: <AboutPage /> },
        { path: "terms", element: <TermsPage /> },
        { path: "privacy", element: <PrivacyPage /> },
        { path: "faq", element: <FaqPage /> },
      ],
    },

    // Quản trị dành riêng cho Admin (/admin/*)
    {
      path: "/admin",
      element: (<ProtectedRoute adminOnly={true}><LayoutApp><LayoutAdmin /></LayoutApp></ProtectedRoute>),
      errorElement: <NotFound />,
      children: [
        {
          index: true, element: <DashboardPage />
        },
        {
          path: "company",
          element: <CompanyPage />
        },
        {
          path: "user",
          element: <UserPage />
        },

        {
          path: "job",
          children: [
            {
              index: true,
              element: <JobTabs />
            },
            {
              path: "upsert", element: <ViewUpsertJob />
            }
          ]
        },

        {
          path: "resume",
          element: <ResumePage />
        },
        {
          path: "interview",
          element: <InterviewPage />
        },
        {
          path: "chat",
          element: <AdminChatPage />
        },
        {
          path: "permission",
          element: <PermissionPage />
        },
        {
          path: "role",
          element: <RolePage />
        },
        {
          path: "settings",
          element: <SiteSettingsPage />
        }
      ],
    },

    // Cổng thông tin & tuyển dụng dành riêng cho HR (/hr/*)
    {
      path: "/hr",
      element: (<ProtectedRoute hrOnly={true}><LayoutApp><LayoutHR /></LayoutApp></ProtectedRoute>),
      errorElement: <NotFound />,
      children: [
        {
          index: true, element: <HrDashboardPage />
        },
        {
          path: "job",
          children: [
            {
              index: true,
              element: <JobTabs />
            },
            {
              path: "upsert", element: <ViewUpsertJob />
            }
          ]
        },
        {
          path: "resume",
          element: <ResumePage />
        },
        {
          path: "interview",
          element: <InterviewPage />
        },
        {
          path: "company",
          element: <CompanyPage />
        },
        {
          path: "chat",
          element: <HrChatPage />
        }
      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}