import react, {useContext, useEffect} from 'react';
import TemporaryDrawer from './TemporaryDrawer.jsx';
import Logo from "./Logo.jsx";
import {useNavigate} from "react-router-dom";
import DataProvider from "../context/DataProvider.jsx";
import axiosInstance from '../config/apiConfig.js';
import ProfileDrawer from './ProfileDrawer.jsx';

const Header = () =>{
    const {account, setAccount} = useContext(DataProvider.DataContext);
    const navigate = useNavigate();
    const handleClick=()=>{
        navigate("/signup");
    }

    const handleLogin =()=>{
        navigate("/login");
    }

    const handleLogout = async() =>{
        try{
            const res = await axiosInstance.delete("/api/user/logout");
            console.log(res);
            setAccount(null);
            navigate("/", { replace: true });
        }catch(err){
            console.log("Some error has occurred in the frontend while handling log out--->", err);
        }
    }

    return (
        <div className='h-24 font-montserrat w-screen bg-neutral-700 flex'>
            <TemporaryDrawer/>
            <div className='w-full flex justify-between'>
                <Logo/> 
                {account?._id ? 
                <div className='flex w-80'>
                    <button
                    onClick={handleLogout}
                    className="m-3 mt-7 mr-7 bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 text-white w-28 h-10 font-semibold px-6 py-3 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        Log Out
                    </button>
                    
                    <ProfileDrawer/>
                </div>

                :

                <div className='flex '>
                    <button
                    onClick={handleClick}
                    className='border border-white h-10 w-28 rounded-sm mt-7 bg-white text-black font-bold hover:scale-110 hover:shadow-indigo-400 hover:shadow-xs'
                    >
                        Sign Up
                    </button>

                    <button
                    onClick={handleLogin}
                    className="m-3 mt-7 mr-7 bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 text-white w-28 h-10 font-semibold px-6 py-3 rounded-lg  focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        Log In
                    </button>
                </div>
                
                
                }
            </div>

        </div>
    )
}

export default Header;