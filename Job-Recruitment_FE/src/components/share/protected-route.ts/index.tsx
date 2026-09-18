import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import NotPermitted from "./not-permitted";
import Loading from "../loading";

interface IProps {
    children: React.ReactNode;
    adminOnly?: boolean;
    hrOnly?: boolean;
}

const RoleBaseRoute = (props: IProps) => {
    const user = useAppSelector(state => state.account.user);
    const roleName = (user?.role?.name ?? "").toUpperCase();
    const isSuperAdmin = user?.email === 'admin@gmail.com' || roleName === 'SUPER_ADMIN' || roleName.includes('ADMIN');
    const isHR = roleName === 'HR' || roleName.includes('HR');

    // Nếu yêu cầu quyền Admin (/admin/*)
    if (props.adminOnly) {
        if (isSuperAdmin) {
            return <>{props.children}</>;
        }
        if (isHR) {
            // HR truy cập nhầm trang /admin -> chuyển hướng sang /hr
            return <Navigate to="/hr" replace />;
        }
        return <NotPermitted />;
    }

    // Nếu yêu cầu quyền HR (/hr/*)
    if (props.hrOnly) {
        if (isSuperAdmin || isHR) {
            return <>{props.children}</>;
        }
        return <NotPermitted />;
    }

    // Mặc định cho các route chung
    return <>{props.children}</>;
};

const ProtectedRoute = (props: IProps) => {
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const isLoading = useAppSelector(state => state.account.isLoading);

    return (
        <>
            {isLoading === true ? (
                <Loading />
            ) : (
                <>
                    {isAuthenticated === true ? (
                        <RoleBaseRoute {...props}>
                            {props.children}
                        </RoleBaseRoute>
                    ) : (
                        <Navigate to='/login' replace />
                    )}
                </>
            )}
        </>
    );
};

export default ProtectedRoute;