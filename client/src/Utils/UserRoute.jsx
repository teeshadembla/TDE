import { useContext } from "react";
import DataProvider from "../context/DataProvider";
import { Navigate } from "react-router-dom";

const UserRoute = ({children}) =>{
    const isUser = useContext(DataProvider.DataContext).account.role === 'user';
    return isUser ? children : <Navigate to="/admin/profile" />;
}

export default UserRoute;