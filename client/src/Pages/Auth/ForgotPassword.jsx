import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { Eye, EyeOff, Smartphone, Key } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const navigate = useNavigate();

  // Step states: 'email' -> 'code' -> 'reset' -> '2fa' -> 'success'
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);

  // Form data
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secondFactorCode, setSecondFactorCode] = useState('');

  // Error handling
  const [error, setError] = useState('');

  // Visibility states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Store available second factors and selected method
  const [availableSecondFactors, setAvailableSecondFactors] = useState([]);
  const [selectedFactorStrategy, setSelectedFactorStrategy] = useState(null);

  // --------------------------------------------
  // STEP 1 — REQUEST RESET CODE
  // --------------------------------------------
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) return setError('Please enter your email');

    setLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      toast.success("Reset code sent to your email!");
      setStep("code");
    } catch (err) {
      console.error("Reset request error:", err);
      const msg = err.errors?.[0]?.message || "Failed to send reset code";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------
  // STEP 2 — VERIFY EMAIL CODE
  // --------------------------------------------
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (code.length < 6) return setError("Enter a valid 6-digit code");

    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });

      console.log("Verification result:", result);

      if (result?.status === "needs_new_password") {
        setStep("reset");
      } else {
        setError("Unexpected Clerk state. Try again.");
      }

    } catch (err) {
      console.error("Code verification error:", err);
      const msg = err.errors?.[0]?.message || "Invalid verification code";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------
  // STEP 3 — RESET PASSWORD
  // --------------------------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8)
      return setError("Password must be at least 8 characters long");

    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    const complexity = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!complexity.test(newPassword))
      return setError("Password must include letters, numbers & symbols");

    setLoading(true);

    try {
      const result = await signIn.resetPassword({
        password: newPassword,
      });

      console.log("Reset password result:", result);

      if (result.status === "complete") {
        // No 2FA required, sign in directly
        await setActive({ session: result.createdSessionId });
        toast.success("Password reset successfully!");
        navigate("/dashboard");
      } else if (result.status === "needs_second_factor") {
        // User has 2FA enabled
        const factors = result.supportedSecondFactors;
        setAvailableSecondFactors(factors);
        
        console.log("Available second factors:", factors);
        
        if (factors && factors.length > 0) {
          // Default to TOTP if available, otherwise use the first factor
          const totpFactor = factors.find(f => f.strategy === "totp");
          setSelectedFactorStrategy(totpFactor ? "totp" : factors[0].strategy);
          setStep("2fa");
        } else {
          setError("Two-factor authentication is required but not configured properly.");
        }
      } else {
        toast.success("Password reset successfully!");
        setStep("success");
      }

    } catch (err) {
      console.error("Password reset error:", err);
      const msg = err.errors?.[0]?.message || "Failed to reset password";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------
  // STEP 4 — HANDLE SECOND FACTOR (2FA)
  // --------------------------------------------
  const handleSecondFactor = async (e) => {
    e.preventDefault();
    setError('');

    if (!secondFactorCode) return setError("Please enter the verification code");

    setLoading(true);

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: selectedFactorStrategy,
        code: secondFactorCode,
      });

      console.log("Second factor result:", result);

      if (result.status === "complete") {
        // Sign in complete!
        await setActive({ session: result.createdSessionId });
        toast.success("Password reset and sign-in successful!");
        navigate("/");
      } else {
        setError("Unexpected state after second factor verification");
      }

    } catch (err) {
      console.error("Second factor error:", err);
      const msg = err.errors?.[0]?.message || "Invalid verification code";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get factor display info
  const getFactorInfo = (strategy) => {
    switch (strategy) {
      case "totp":
        return {
          icon: <Smartphone className="w-5 h-5" />,
          title: "Authenticator App",
          description: "Enter the 6-digit code from your authenticator app"
        };
      case "backup_code":
        return {
          icon: <Key className="w-5 h-5" />,
          title: "Backup Code",
          description: "Enter one of your backup codes"
        };
      default:
        return {
          icon: <Key className="w-5 h-5" />,
          title: "Verification Code",
          description: "Enter your verification code"
        };
    }
  };

  // --------------------------------------------
  // UI RENDERING
  // --------------------------------------------
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-8">
      <div className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg border border-blue-700 space-y-6">

        {error && (
          <div className="bg-red-900/30 border border-red-500 p-3 rounded">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* STEP 1: EMAIL */}
        {step === "email" && (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <h2 className="text-2xl text-center font-semibold">Forgot Password?</h2>

            <div>
              <label className="block text-sm mb-1">Email *</label>
              <input
                className="w-full p-2 rounded bg-black border border-gray-500"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-2 rounded"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>

            <Link to="/login" className="text-blue-500 text-sm text-center block">
              ← Back to Login
            </Link>
          </form>
        )}

        {/* STEP 2: CODE */}
        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <h2 className="text-2xl text-center font-semibold">Enter Code</h2>

            <input
              className="w-full p-2 rounded bg-black border border-gray-500 text-center text-xl"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-2 rounded"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-6">

            <h2 className="text-2xl text-center font-semibold">Set New Password</h2>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full p-2 pr-10 rounded bg-black border border-gray-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-2 pr-10 rounded bg-black border border-gray-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-2 rounded"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* STEP 4: TWO-FACTOR AUTHENTICATION */}
        {step === "2fa" && (
          <div className="space-y-6">
            <h2 className="text-2xl text-center font-semibold">Two-Factor Authentication</h2>
            
            {/* Method Selection Buttons */}
            <div className="flex gap-3">
              {availableSecondFactors.map((factor) => {
                const info = getFactorInfo(factor.strategy);
                const isSelected = selectedFactorStrategy === factor.strategy;
                
                return (
                  <button
                    key={factor.strategy}
                    type="button"
                    onClick={() => {
                      setSelectedFactorStrategy(factor.strategy);
                      setSecondFactorCode('');
                      setError('');
                    }}
                    className={`flex-1 p-3 rounded border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-900/30'
                        : 'border-gray-600 bg-black hover:border-gray-500'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {info.icon}
                      <span className="text-xs">
                        {factor.strategy === "totp" ? "Authenticator" : "Backup Code"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Instructions based on selected method */}
            <p className="text-sm text-gray-400 text-center">
              {getFactorInfo(selectedFactorStrategy).description}
            </p>

            {/* Code Input Form */}
            <form onSubmit={handleSecondFactor} className="space-y-4">
              <input
                className="w-full p-2 rounded bg-black border border-gray-500 text-center text-xl"
                placeholder={selectedFactorStrategy === "backup_code" ? "Enter backup code" : "000000"}
                value={secondFactorCode}
                onChange={(e) => setSecondFactorCode(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-2 rounded"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>
            </form>

            {/* Help Text */}
            <div className="text-xs text-gray-500 text-center space-y-1">
              {selectedFactorStrategy === "totp" && (
                <p>Open your authenticator app to get the code</p>
              )}
              {selectedFactorStrategy === "backup_code" && (
                <p>Use one of the backup codes you saved when setting up 2FA</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === "success" && (
          <div className="text-center space-y-6">
            <h2 className="text-green-400 text-2xl font-semibold">
              Password Reset Successful!
            </h2>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-white text-black py-2 rounded font-semibold"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;