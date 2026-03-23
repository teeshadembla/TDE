import { useContext } from "react";
import DataProvider from "../context/DataProvider";
import { Navigate, useLocation } from "react-router-dom";

/**
 * AdminRoute
 * Requires the user to be logged in AND have role 'admin' or 'core'.
 * Redirects to /login if not authenticated.
 * Redirects to /user/profile if authenticated but not admin/core.
 */
const AdminRoute = ({ children }) => {
    const { account } = useContext(DataProvider.DataContext);
    const location = useLocation();

    // Still loading auth state — don't redirect yet
    if (account._id === undefined) {
        return <div>Loading...</div>;
    }

    // Not logged in → send to login
    if (!account._id) {
        return (
            <Navigate
                to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
                replace
            />
        );
    }

    // Logged in but wrong role → send to user profile
    const isAdminOrCore = account.role === 'admin' || account.role === 'core';
    if (!isAdminOrCore) {
        return <Navigate to="/user/profile" replace />;
    }

    return children;
};

export default AdminRoute;