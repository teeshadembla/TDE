import React, { useState, useContext, useEffect } from 'react';
import { useSignIn, useUser } from '@clerk/clerk-react';
import axiosInstance from "../../config/apiConfig.js";
import {toast} from "react-toastify";
import {useNavigate, Link, useSearchParams} from "react-router-dom";
import DataProvider from '../../context/DataProvider.jsx';


const sampleUser = {
  email: "",
  password: "",
};

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useUser();
  const [user, setUser] = useState(sampleUser);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {account, setAccount} = useContext(DataProvider.DataContext);
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [needsMFA, setNeedsMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState(null);

  //check if already signed in, then redirect
  useEffect(() => {
  if (!isLoaded) return;

  if (needsMFA) return;

  if (isSignedIn) {
    navigate(redirectPath, { replace: true });
  }
}, [isLoaded, isSignedIn, needsMFA]);

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


  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!isLoaded || !signIn) {
      toast.error("Authentication system loading. Please try again.");
      return;
    }

    if (!user.email || !user.password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      // Attempt Clerk sign-in with email and password
      const result = await signIn.create({
        identifier: user.email,
        password: user.password,
      });

      console.log("Clerk sign-in result:", result);

      // Check if TOTP MFA is required
      if (result.status === 'needs_first_factor') {
        // Check available factors
        const totpFactor = result.supportedFirstFactors?.find(f => f.strategy === 'totp');
        if (totpFactor) {
          setMfaFactorId(totpFactor.id);
          setNeedsMFA(true);
          toast.info("Enter your 6-digit authenticator code");
          setLoading(false);
          return;
        }
      }

      if (result.status === 'needs_second_factor') {
        // Check for TOTP as second factor
        const totpFactor = result.supportedSecondFactors?.find(f => f.strategy === 'totp');
        if (totpFactor) {
          setMfaFactorId(totpFactor.id);
          setNeedsMFA(true);
          toast.info("Enter your 6-digit authenticator code");
          setLoading(false);
          return;
        }
      }

      if (result.status === 'complete') {
        // User authenticated successfully
        await setActive({ session: result.createdSessionId });
        
        const userRes = await axiosInstance.get("/api/user/me");
        setAccount(userRes.data.user);
        
        navigate(redirectPath, { replace: true });
        toast.success("User logged in successfully");
      }
    } catch (err) {
      console.log("Login error:", err);
      const errorMessage = err.errors?.[0]?.message || err.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle TOTP verification during login
  const handleTOTPVerification = async (e) => {
    e.preventDefault();

    if (!isLoaded || !signIn) {
      toast.error("Authentication system not ready");
      return;
    }

    if (!mfaCode || mfaCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);

    try {
      // Verify TOTP code
      const result = await signIn.attemptFirstFactor({
        strategy: "totp",
        code: mfaCode,
      });

      console.log("TOTP verification result:", result);

      if (result.status === 'complete') {
        // Successfully authenticated with TOTP
        await setActive({ session: result.createdSessionId });
        
        const userRes = await axiosInstance.get("/api/user/me");
        setAccount(userRes.data.user);

        setNeedsMFA(false);
        navigate(redirectPath, { replace: true });
        toast.success("You have successfully logged in!");
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (err) {
      console.log("TOTP verification error:", err);
      toast.error(err.errors?.[0]?.message || "Invalid authenticator code");
    } finally {
      setLoading(false);
    }
  };

  if(!isLoaded ){
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div>Loading...</div>
      </div>
    );
  }

  // MFA Input Screen
  if (needsMFA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg space-y-6 shadow-blue-500">
          <h2 className="text-2xl font-semibold text-center">Two-Factor Authentication</h2>
          <p className="text-center text-gray-300 text-sm">
            Enter the 6-digit code from your authenticator app
          </p>

          <form onSubmit={handleTOTPVerification} className="space-y-4">
            <div>
              <label htmlFor="mfaCode" className="block text-sm font-medium mb-2">
                Authenticator Code <span className="text-red-500">*</span>
              </label>
              <input
                id="mfaCode"
                type="text"
                maxLength="6"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full p-3 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white text-center text-2xl tracking-widest"
                required
              />
              <p className="text-xs text-gray-400 mt-2">Only numbers are allowed</p>
            </div>

            <button
              type="submit"
              disabled={loading || mfaCode.length !== 6}
              className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <button
            onClick={() => {
              setNeedsMFA(false);
              setMfaCode("");
            }}
            className="w-full text-sm text-gray-400 hover:text-white transition"
          >
            ← Back to login
          </button>

          <div className="bg-yellow-900 border border-yellow-600 p-2 rounded text-xs text-yellow-200">
            Can't access your authenticator? You can use a backup code instead.
          </div>
        </div>
      </div>
    );
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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>Don't have an account already? <Link className='text-blue-500' to={"/signup"}>Click here to Signup!</Link></p>
      </div>
    </div>
  );
};

export default Login;
