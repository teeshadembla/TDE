import { useContext } from "react";
import DataProvider from "../context/DataProvider";
import { Navigate } from "react-router-dom";

const AdminRoute = ({children}) =>{
    const { account } = useContext(DataProvider.DataContext);
    
    console.log("AdminRoute rendering, account:", account);
    
    // Don't redirect until account data is loaded
    if (!account._id) {
        console.log("AdminRoute: No account ID, showing loading...");
        return <div>Loading...</div>;
    }
    
    const isAdmin = account.role === 'admin' || account.role === 'core';
    console.log("AdminRoute: isAdmin =", isAdmin, "role =", account.role);
    
    if (!isAdmin) {
        console.log("AdminRoute: User is not admin, redirecting to /user/profile");
        return <Navigate to="/user/profile" />;
    }
    
    console.log("AdminRoute: Rendering children");
    return children;
}

export default AdminRoute;