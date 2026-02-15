// File: src/Pages/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axiosInstance from "../../config/apiConfig.js";
import {toast} from "react-toastify";
import {useNavigate, Link, useSearchParams} from "react-router-dom";
import DataProvider from '../../context/DataProvider.jsx';
import { useSignIn, useClerk, useUser } from '@clerk/clerk-react';

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
  const { isSignedIn} = useUser();
  const { signIn , isLoaded} = useSignIn();
  const {setActive} = useClerk();
  const [loading, setLoading] = useState(false);
  
  // 2FA States
  const [needs2FA, setNeeds2FA] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [secondFactorStrategy, setSecondFactorStrategy] = useState(null);

  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);

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

 const handleLogin = async () => {
  if (!isLoaded || isSignedIn) {
    toast.info(isLoaded ? "You are already signed in" : "Clerk has not loaded yet, try again");
    return;
  }

  setLoading(true);

  try {
    const result = await signIn.create({
      identifier: user.email,
      password: user.password,
    });

    console.log("=== FULL LOGIN RESULT ===");
    console.log("Status:", result.status);
    console.log("Supported second factors:", result.supportedSecondFactors);
    console.log("First factor verification:", result.firstFactorVerification);
    console.log("Second factor verification:", result.secondFactorVerification);
    console.log("Complete result object:", result);
    console.log("========================");

    // Check if 2FA is required
    if (result.status === "needs_second_factor") {
      console.log("🚨 TRIGGERING 2FA SCREEN");
      const strategy = result.supportedSecondFactors?.[0]?.strategy;
      console.log("Selected strategy:", strategy);
      setSecondFactorStrategy(strategy);
      setNeeds2FA(true);
      toast.info("Please enter your 2FA code from your authenticator app");
      setLoading(false);
      return;
    }

    // If login is complete (no 2FA enabled)
    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      toast.success("Logged in successfully!");
      navigate(redirectPath);
    }

  } catch (err) {
    console.error("Login error:", err);
    toast.error(err.errors?.[0]?.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  const handleVerify2FA = async () => {
    if (!totpCode || totpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: secondFactorStrategy,
        code: totpCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("2FA verified! Logged in successfully!");
        navigate(redirectPath);
      }

    } catch (err) {
      console.error("2FA verification error:", err);
      toast.error(err.errors?.[0]?.message || "Invalid 2FA code");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setNeeds2FA(false);
    setTotpCode("");
  };

  // If 2FA is needed, show 2FA input screen
  if (needs2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg space-y-6 shadow-blue-500">
          <h2 className="text-2xl font-semibold text-center">Two-Factor Authentication</h2>
          
          <p className="text-sm text-gray-400 text-center">
            Enter the 6-digit code from your authenticator app
          </p>

          <div>
            <label htmlFor="totpCode" className="block text-sm font-medium mb-1">
              Authentication Code <span className="text-red-500">*</span>
            </label>
            <input
              id="totpCode"
              name="totpCode"
              type="text"
              placeholder="000000"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full p-2 rounded bg-black border border-gray-500 text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              maxLength={6}
              autoComplete="off"
              required
            />
          </div>

          <button
            onClick={handleVerify2FA}
            disabled={loading || totpCode.length !== 6}
            className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            onClick={handleBack}
            className="w-full bg-transparent border border-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Regular login screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg space-y-6 shadow-blue-500">
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        {/* Email */}
        <div>
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
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={user.password}
              onChange={handleChange}
              className="w-full p-2 pr-10 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className={`text-sm mt-1 ${errors.password.includes("Strong") ? "text-green-500" : "text-red-500"}`}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link 
            to="/forgot-password" 
            className="text-sm text-blue-500 hover:text-blue-400 transition"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-4 bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-center">
          Don't have an account? <Link className="text-blue-500" to={"/signup"}>Click here to Signup!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;