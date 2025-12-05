{/* import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import axiosInstance from "../../config/apiConfig.js";
import Step1 from "../../components/Auth/Step1.jsx";
import Step2 from "../../components/Auth/Step2.jsx";
import Step3 from "../../components/Auth/Step3.jsx";

const sampleUser = {
  FullName: "",
  email: "",
  password: "",
  role: "",
  profilePicture: null, // Add this
  socialLinks: {
    twitter: "",
    LinkedIn: "",
    Instagram: "",
  },
  followedTopics: [],
  isSubscribedToNewsletter: false,
  location: "",
  title: "",
  department: "",
  company: "",
  expertise: [],
  discoverySource: "",
};

const Signup = () => {
  const methods = useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(sampleUser);
  const [stepValid, setStepValid] = useState(false);
  const [triedToContinue, setTriedToContinue] = useState(false);
  const navigate = useNavigate();

  const next = () => {
    if (stepValid) {
      setStep((s) => s + 1);
      setTriedToContinue(false);
    } else {
      setTriedToContinue(true);
    }
  };

  const prev = () => setStep((s) => s - 1);

 
  const onSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append all text fields
      formData.append('FullName', userData.FullName);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.role);
      
      // Append profile picture if exists
      if (userData.profilePicture) {
        formData.append('profilePicture', userData.profilePicture);
      }
      
      // Append social links as JSON string
      formData.append('socialLinks', JSON.stringify(userData.socialLinks));
      
      // Append arrays as JSON strings
      formData.append('followedTopicsArray', JSON.stringify(userData.followedTopics));
      formData.append('expertiseArray', JSON.stringify(userData.expertise));
      
      // Append other fields
      formData.append('isSubscribedToNewsletter', userData.isSubscribedToNewsletter);
      formData.append('location', userData.location || '');
      formData.append('title', userData.title || '');
      formData.append('department', userData.department || '');
      formData.append('company', userData.company || '');
      formData.append('discoverySource', userData.discoverySource);
      
      // Send FormData to backend
      const res = await axiosInstance.post("/api/user/signup", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if(res.status === 200) {
        await axiosInstance.post("/api/user/login", {
          email: userData.email,
          password: userData.password
        });
        navigate("/");
        toast.success("You are successfully a part of The Digital Economist Community!");
      }

    } catch(err) {
      if (err.response?.status === 402) {
        toast.error("An account with this email ID already exists, please sign up with a different email!");
      } else {
        toast.error(err.response?.data?.msg || "An error occurred during signup");
        console.error("Signup error:", err);
      }
      console.log("This error occurred in frontend in signup.jsx while trying to signup ----> ", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="bg-black min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-2xl text-white bg-neutral-900 shadow-md p-8 rounded-xl space-y-6 border border-blue-700 shadow-blue-700"
        >
          <h2 className="text-2xl font-semibold text-center">Signup - Step {step}</h2>

          
          {step === 1 && (
            <Step1
              formData={userData}
              formFunction={setUserData}
              setStepValid={setStepValid}
            />
          )}
          {step === 2 && (
            <Step2
              formData={userData}
              formFunction={setUserData}
              setStepValid={setStepValid}
            />
          )}
          {step === 3 && (
            <Step3
              formData={userData}
              formFunction={setUserData}
              setStepValid={setStepValid}
            />
          )}

         
          <div className="flex flex-col items-end space-y-2">
            <div className="flex justify-between w-full items-center">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prev}
                  className="text-sm text-gray-300 hover:text-white transition"
                >
                  ← Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={methods.handleSubmit(next)}
                  disabled={loading}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition disabled:opacity-50"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>

            {triedToContinue && !stepValid && (
              <p className="text-sm text-red-400 text-right">
                Please fill in all required fields correctly before continuing.
              </p>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default Signup;
 */}

// ============================================
// Signup.jsx - Main Signup Component
// ============================================
import { useSignUp, useAuth } from '@clerk/clerk-react';
import { useForm, FormProvider } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../config/apiConfig.js";
import Step1 from "../../components/Auth/Step1Clerk.jsx";
import Step2 from "../../components/Auth/Step2.jsx";
import Step3 from "../../components/Auth/Step3.jsx";

const sampleUser = {
  FullName: "",
  email: "",
  password: "",
  role: "",
  profilePicture: null,
  socialLinks: {
    twitter: "",
    LinkedIn: "",
    Instagram: "",
  },
  followedTopics: [],
  isSubscribedToNewsletter: false,
  location: "",
  title: "",
  department: "",
  company: "",
  expertise: [],
  discoverySource: "",
};

const Signup = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const methods = useForm();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(sampleUser);
  const [stepValid, setStepValid] = useState(false);
  const [triedToContinue, setTriedToContinue] = useState(false);
  
  // Email verification state
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [clerkUserId, setClerkUserId] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Redirect if already signed in (but NOT during signup flow)
  useEffect(() => {
    if (authLoaded && isSignedIn && !isSigningUp && step === 1 && !verifying) {
      navigate("/");
      toast.info("You are already signed in");
    }
  }, [isSignedIn, authLoaded, navigate, isSigningUp, step, verifying]);

  const next = () => {
    if (stepValid) {
      setStep((s) => s + 1);
      setTriedToContinue(false);
    } else {
      setTriedToContinue(true);
    }
  };

  const prev = () => setStep((s) => s - 1);

  // Handle Clerk signup (Step 1 completion)
  const handleClerkSignup = async () => {
    if (!isLoaded || isSignedIn) return;

    setLoading(true);
    setIsSigningUp(true);

    try {
      // Check if user already exists by email
      if (!userData.email || !userData.password) {
        toast.error('Please enter email and password');
        setLoading(false);
        setIsSigningUp(false);
        return;
      }

      // Create user in Clerk with email and password
      const result = await signUp.create({
        emailAddress: userData.email,
        password: userData.password,
      });

      console.log("This is result after creating user in clerk--->", result);
      

      // Prepare email verification
      await result.prepareEmailAddressVerification({
        strategy: 'email_code'
      });

      // Show verification step
      setVerifying(true);
      toast.info("Verification code sent to your email!");
    } catch (err) {
      console.error('Clerk signup error:', err);
      const errorMessage = err.errors?.[0]?.message || err.message || 'An error occurred during signup';
      
      // Handle common errors
      if (errorMessage.includes('already exists')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else if (errorMessage.includes('session')) {
        toast.error('There was a session error. Please refresh and try again.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setIsSigningUp(false);
    }
  };

  // Handle email verification
  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (!isLoaded) return;

    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log("This is signup completion after verification--->", completeSignUp);
      if (completeSignUp.status === 'complete') {
        // Set the session as active
        await setActive({ session: completeSignUp.createdSessionId });
        setClerkUserId(completeSignUp.createdUserId);
        
        // Move to next step WITHOUT closing signup flow
        setVerifying(false);
        setStep(2); // Go directly to Step 2
        toast.success("Email verified successfully!");
      } else {
        toast.error('Verification incomplete. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error(err.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Prepare TOTP setup with QR code
  const prepareTOTPSetup = async (userId) => {
    try {
      console.log("=== Starting TOTP Setup ===");
      console.log("SignUp object:", signUp);
      console.log("isLoaded:", isLoaded);
      
      // Create TOTP factor in Clerk
      // Note: Must be called after email verification is complete
      console.log("Attempting to create TOTP factor...");
      
      const totpFactor = await signUp.createTOTPFactor();
      
      console.log("✅ TOTP Factor created successfully:", totpFactor);
      
      if (totpFactor) {
        console.log("Setting secret and QR code...");
        setTotpSecret(totpFactor.secret);
        setQrCode(totpFactor.uri);
        
        console.log("✅ TOTP Setup UI will now be displayed");
        toast.info("Scan the QR code with your authenticator app");
      } else {
        console.error("❌ totpFactor is null or undefined");
        toast.error("Failed to generate QR code. Please try again.");
      }
    } catch (err) {
      console.error('❌ Error preparing TOTP:', err);
      console.error('Error details:', err.errors);
      console.error('Full error object:', JSON.stringify(err, null, 2));
      
      // More detailed error messages
      const errorMsg = err.errors?.[0]?.message || err.message || 'Failed to setup MFA';
      console.error(`MFA Setup Error Details: ${errorMsg}`);
      
      toast.error(`MFA Setup Error: ${errorMsg}`);
    }
  };

  // Verify TOTP code and complete MFA setup
  const handleTOTPVerification = async (e) => {
    e.preventDefault();
    
    if (!isLoaded || !totpCode) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.attemptTOTPFactor({
        code: totpCode,
      });

      console.log("TOTP Verification result:", result);

      if (result.status === 'complete') {
        setMfaVerified(true);
        setSetupMFA(false);
        setStep(2); // Move to Step 2 after MFA setup
        toast.success("MFA setup complete! Please continue with your profile.");
        setTotpCode("");
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (err) {
      console.error('TOTP verification error:', err);
      toast.error(err.errors?.[0]?.message || 'Invalid TOTP code');
    } finally {
      setLoading(false);
    }
  };

  // Submit all additional data to your backend
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData object
      const formData = new FormData();

      // Append all text fields
      formData.append('FullName', userData.FullName);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.role);
      formData.append('clerkUserId', clerkUserId); // Add Clerk user ID

      // Append profile picture if exists
      if (userData.profilePicture) {
        formData.append('profilePicture', userData.profilePicture);
      }

      // Append social links as JSON string
      formData.append('socialLinks', JSON.stringify(userData.socialLinks));

      // Append arrays as JSON strings
      formData.append('followedTopicsArray', JSON.stringify(userData.followedTopicsArray || []));
      formData.append('expertiseArray', JSON.stringify(userData.expertiseArray || []));

      // Append other fields
      formData.append('isSubscribedToNewsletter', userData.isSubscribedToNewsletter);
      formData.append('location', userData.location || '');
      formData.append('title', userData.title || '');
      formData.append('department', userData.department || '');
      formData.append('company', userData.company || '');
      formData.append('discoverySource', userData.discoverySource);

      // Send FormData to backend
      const res = await axiosInstance.post("/api/user/signup", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.status === 200) {
        navigate("/");
        toast.success("You are successfully a part of The Digital Economist Community!");
      }

    } catch (err) {
      if (err.response?.status === 402) {
        toast.error("An error occurred. Please try again.");
      } else {
        toast.error(err.response?.data?.msg || "An error occurred during signup");
        console.error("Signup error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // If Clerk is not loaded
  if (!isLoaded || !authLoaded) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If already signed in AND not currently in signup flow, redirect
  if (isSignedIn && !isSigningUp && step === 1 && !verifying) {
    return null;
  }

  // Email Verification UI
  if (verifying) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-white bg-neutral-900 shadow-md p-8 rounded-xl space-y-6 border border-blue-700 shadow-blue-700">
          <h2 className="text-2xl font-semibold text-center">Verify Your Email</h2>
          <p className="text-center text-gray-300">
            We sent a verification code to <strong>{userData.email}</strong>
          </p>

          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <label htmlFor="code" className="block mb-2 font-medium">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full p-3 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <button
            onClick={() => setVerifying(false)}
            className="w-full text-sm text-gray-400 hover:text-white transition"
          >
            ← Back to signup
          </button>
        </div>
      </div>
    );
  }

  // MFA (TOTP) Setup UI
  if (setupMFA) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-white bg-neutral-900 shadow-md p-8 rounded-xl space-y-6 border border-blue-700 shadow-blue-700">
          <h2 className="text-2xl font-semibold text-center">Set Up Two-Factor Authentication</h2>
          <p className="text-center text-gray-300 text-sm">
            Secure your account by enabling two-factor authentication. This is required for all users.
          </p>

          {/* QR Code Display */}
          {qrCode && (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-sm text-gray-400">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
              <div className="bg-white p-4 rounded">
                <img 
                  src={qrCode} 
                  alt="QR Code" 
                  className="w-48 h-48"
                />
              </div>
              
              {totpSecret && (
                <div className="w-full p-3 bg-black border border-gray-600 rounded text-center">
                  <p className="text-xs text-gray-400 mb-2">Manual Entry Key (if QR doesn't work):</p>
                  <p className="font-mono text-sm break-all">{totpSecret}</p>
                </div>
              )}
            </div>
          )}

          {/* TOTP Code Verification */}
          <form onSubmit={handleTOTPVerification} className="space-y-4">
            <div>
              <label htmlFor="totpCode" className="block mb-2 font-medium">
                Enter 6-digit Code from Authenticator
              </label>
              <input
                id="totpCode"
                type="text"
                maxLength="6"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full p-3 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                required
              />
              <p className="text-xs text-gray-400 mt-2">Wait for the code to update in your app before submitting</p>
            </div>

            <button
              type="submit"
              disabled={loading || totpCode.length !== 6}
              className="w-full bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          <div className="bg-blue-900 border border-blue-600 p-3 rounded text-sm">
            <p className="text-blue-200">
              <strong>⚠️ Important:</strong> Save your backup codes in a safe place. You'll need them if you lose access to your authenticator app.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="bg-black min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-2xl text-white bg-neutral-900 shadow-md p-8 rounded-xl space-y-6 border border-blue-700 shadow-blue-700"
        >
          <h2 className="text-2xl font-semibold text-center">
            Signup - Step {step}
          </h2>

          {/* Step Sections */}
          {step === 1 && (
            <Step1
              formData={userData}
              formFunction={setUserData}
              setStepValid={setStepValid}
            />
          )}
          {step === 2 && (
            <Step2
              formData={userData}
              formFunction={setUserData}
              setStepValid={setStepValid}
            />
          )}
          {step === 3 && (
            <Step3
              formData={userData}
              formFunction={setUserData}
              setStepValid={setStepValid}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col items-end space-y-2">
            <div className="flex justify-between w-full items-center">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prev}
                  className="text-sm text-gray-300 hover:text-white transition"
                >
                  ← Back
                </button>
              )}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleClerkSignup}
                  disabled={loading || !stepValid}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Continue →"}
                </button>
              ) : step < 3 ? (
                <button
                  type="button"
                  onClick={methods.handleSubmit(next)}
                  disabled={loading}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition disabled:opacity-50"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !stepValid}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>

            {triedToContinue && !stepValid && (
              <p className="text-sm text-red-400 text-right">
                Please fill in all required fields correctly before continuing.
              </p>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default Signup;