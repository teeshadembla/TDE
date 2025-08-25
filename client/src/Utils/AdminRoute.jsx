import { useContext } from "react";
import DataProvider from "../context/DataProvider";
import { Navigate } from "react-router-dom";

const AdminRoute = ({children}) =>{
    const isAdmin = useContext(DataProvider.DataContext).account.role === 'core';
    return isAdmin ? children : <Navigate to="/user/profile" />;
}

export default AdminRoute;