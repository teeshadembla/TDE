// File: src/Pages/Auth/Setup2FA.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import QRCode from 'qrcode';
import DataProvider from "../../context/DataProvider.jsx";
import axiosInstance from '../../config/apiConfig.js';

const Setup2FA = () => {
  const { user, isLoaded } = useUser();
  const {account} = useContext(DataProvider.DataContext);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  
  // Backup codes state
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [savedBackupCodes, setSavedBackupCodes] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      // Check if TOTP is already enabled
      const totpFactor = user.twoFactorEnabled;
      setTotpEnabled(totpFactor);
    }
  }, [isLoaded, user]);

  const generateTOTP = async () => {
    setLoading(true);
    try {
      // Create TOTP secret
      const totpResponse = await user.createTOTP();
      
      // Get the secret and URI for QR code
      setSecret(totpResponse.secret);
      const uri = totpResponse.uri;

      // Generate QR code
      const qrCode = await QRCode.toDataURL(uri);
      setQrCodeUrl(qrCode);

      toast.success('QR code generated! Scan it with your authenticator app.');
    } catch (err) {
      console.error('Error generating TOTP:', err);
      toast.error(err.errors?.[0]?.message || 'Failed to generate 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnableTOTP = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // Verify the TOTP code
      const result = await user.verifyTOTP({ code: verificationCode });
      
      console.log("TOTP verification result: ", result);
      
      // Get backup codes from Clerk
      const codes = result.backupCodes || [];
      console.log("These are the backup codes generated: ", codes);
      setBackupCodes(codes);
      
      // Notify backend that MFA is enabled
      await axiosInstance.post("/api/user/enabledMFA", {accountId : account._id});

      toast.success('2FA enabled successfully!');
      setTotpEnabled(true);
      setShowBackupCodes(true);
      
      // Clear the setup form
      setQrCodeUrl('');
      setSecret('');
      setVerificationCode('');
    } catch (err) {
      console.error('Error verifying TOTP:', err);
      toast.error(err.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const disableTOTP = async () => {
    if (!window.confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    setLoading(true);
    try {
      await user.disableTOTP();
      toast.success('2FA disabled successfully');
      setTotpEnabled(false);
      setBackupCodes([]);
      setShowBackupCodes(false);
      setSavedBackupCodes(false);
    } catch (err) {
      console.error('Error disabling TOTP:', err);
      toast.error(err.errors?.[0]?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([`The Digital Economist - Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${codesText}\n\nKeep these codes safe! You can use them to access your account if you lose your authenticator device.`], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TDE-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded!');
  };

  const handleCopyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    toast.success('Backup codes copied to clipboard!');
  };

  const handleConfirmSaved = () => {
    setSavedBackupCodes(true);
    setShowBackupCodes(false);
    toast.info('Great! You can now use your backup codes if needed.');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Show backup codes screen after enabling 2FA
  if (showBackupCodes && backupCodes.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg space-y-6 shadow-blue-500">
          <div className="text-center">
            <div className="text-4xl mb-3">🔐</div>
            <h2 className="text-2xl font-semibold">Save Your Backup Codes</h2>
            <p className="text-sm text-gray-400 mt-2">
              These codes can be used to access your account if you lose your authenticator device
            </p>
          </div>

          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <p className="text-red-400 font-semibold text-sm">⚠️ Important!</p>
            <p className="text-sm text-gray-300 mt-1">
              Save these codes in a secure location. Each code can only be used once.
            </p>
          </div>

          <div className="bg-black border border-gray-600 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2 text-center font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="p-2 bg-neutral-800 rounded">
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadBackupCodes}
              className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Download
            </button>
            <button
              onClick={handleCopyBackupCodes}
              className="flex-1 bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition"
            >
              Copy
            </button>
          </div>

          <button
            onClick={handleConfirmSaved}
            className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-300 transition"
          >
            I've Saved My Codes
          </button>

          <p className="text-xs text-center text-gray-400">
            You won't be able to see these codes again after closing this window
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg space-y-6 shadow-blue-500">
        <h2 className="text-2xl font-semibold text-center">Two-Factor Authentication</h2>

        {totpEnabled ? (
          <div className="space-y-4">
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
              <p className="text-green-400 font-semibold">✓ 2FA is enabled</p>
              <p className="text-sm text-gray-400 mt-2">
                Your account is protected with two-factor authentication
              </p>
            </div>

            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <strong>Reminder:</strong> If you lose access to your authenticator app, you can use your backup codes to sign in.
              </p>
            </div>

            <button
              onClick={disableTOTP}
              disabled={loading}
              className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Disabling...' : 'Disable 2FA'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {!qrCodeUrl ? (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>

                <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">What you'll need:</h3>
                  <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                    <li>An authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>Your phone to scan the QR code</li>
                  </ul>
                </div>

                <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-yellow-400">You'll receive backup codes</h3>
                  <p className="text-sm text-gray-400">
                    After setup, you'll get backup codes to access your account if you lose your device. Save them securely!
                  </p>
                </div>

                <button
                  onClick={generateTOTP}
                  disabled={loading}
                  className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-300 transition disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Set Up 2FA'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-neutral-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-center">Step 1: Scan QR Code</h3>
                  <div className="flex justify-center mb-4">
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                  
                  <div className="bg-black p-3 rounded border border-gray-600">
                    <p className="text-xs text-gray-400 mb-1">Or enter this code manually:</p>
                    <p className="font-mono text-sm break-all text-center">{secret}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Step 2: Verify Code</h3>
                  <label htmlFor="verificationCode" className="block text-sm font-medium mb-1">
                    Enter 6-digit code from your app
                  </label>
                  <input
                    id="verificationCode"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full p-2 rounded bg-black border border-gray-500 text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    maxLength={6}
                    autoComplete="off"
                  />
                </div>

                <button
                  onClick={verifyAndEnableTOTP}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Enable 2FA'}
                </button>

                <button
                  onClick={() => {
                    setQrCodeUrl('');
                    setSecret('');
                    setVerificationCode('');
                  }}
                  className="w-full bg-transparent border border-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Setup2FA;