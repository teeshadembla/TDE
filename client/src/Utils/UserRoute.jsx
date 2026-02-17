import { useContext } from "react";
import DataProvider from "../context/DataProvider";
import { Navigate } from "react-router-dom";

const UserRoute = ({children}) =>{
    const { account } = useContext(DataProvider.DataContext);
    
    // Don't redirect until account data is loaded
    if (!account._id) {
        return <div>Loading...</div>;
    }
    
    const isUser = account.role === 'user' || account.role === 'chair';
    return isUser ? children : <Navigate to="/admin/profile" />;
}

export default UserRoute;