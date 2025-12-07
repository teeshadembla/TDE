import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import QRCode from 'qrcode';

const Setup2FA = () => {
  const { user, isLoaded } = useUser();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);

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
      await user.verifyTOTP({ code: verificationCode });
      
      toast.success('2FA enabled successfully!');
      setTotpEnabled(true);
      
      // Clear the form
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
    if (!window.confirm('Are you sure you want to disable 2FA?')) {
      return;
    }

    setLoading(true);
    try {
      await user.disableTOTP();
      toast.success('2FA disabled successfully');
      setTotpEnabled(false);
    } catch (err) {
      console.error('Error disabling TOTP:', err);
      toast.error(err.errors?.[0]?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
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