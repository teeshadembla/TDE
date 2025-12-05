import React, { useState, useContext } from 'react';
import axiosInstance from "../../config/apiConfig.js";
import {toast} from "react-toastify";
import {useNavigate, Link, useSearchParams} from "react-router-dom";
import DataProvider from '../../context/DataProvider.jsx';

const sampleUser = {
  email: "",
  password: "",
};

const Login = () => {
  const [user, setUser] = useState(sampleUser);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const {account, setAccount} = useContext(DataProvider.DataContext);
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value) return "Email is required";
      const emailRegex = /^[\w.-]+@(?:gmail|yahoo|outlook|[\w-]+)\.com$/i;
      return emailRegex.test(value) ? "Valid email!" : "Invalid email address";
    } else if (name === "password") {
      if (!value) return "Password is required";
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
      return passwordRegex.test(value)
        ? "Strong password!"
        : "Must be 8+ chars, include letters, numbers & symbols";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(user);
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    const validationMessage = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: validationMessage,
    }));
  };


  const handleLogin = async() =>{
    try{
        const res = await axiosInstance.post("/api/user/login", user);
        console.log(res.data.userData);

        const userRes = await axiosInstance.get("/api/user/me");
        console.log("User data after login-->", userRes.data.user);
        setAccount(userRes.data.user);
        console.log(redirectPath);
        navigate(redirectPath, { replace: true });
        toast.success("User logged in successfully");
    }catch(err){
        console.log("This error has occurred while trying to log in in the frontend-->", err);
        toast.error(err.response?.data?.msg || "Something went wrong");
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg space-y-6  shadow-blue-500">
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        {/* Email */}
        <div >
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="abc@gmail.com"
            value={user.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          {errors.email && (
            <p className={`text-sm mt-1 ${errors.email.includes("Valid") ? "text-green-500" : "text-red-500"}`}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            value={user.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          {errors.password && (
            <p className={`text-sm mt-1 ${errors.password.includes("Strong") ? "text-green-500" : "text-red-500"}`}>
              {errors.password}
            </p>
          )}
        </div>

        <button
            onClick={handleLogin}
          className="w-full mt-4 bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-300 transition"
        >
          Log In
        </button>

        <p>Don't have an account already? <Link className='text-blue-500' to={"/signup"}>Click here to Signup!</Link></p>
      </div>
    </div>
  );
};

export default Login;
