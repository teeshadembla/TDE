import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import { AlertCircle, CheckCircle, Lock, Smartphone, Mail, Copy } from 'lucide-react';

export default function MFASettings() {
  const { user } = useUser();
  const [mfaMethods, setMfaMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTotpSetup, setShowTotpSetup] = useState(false);
  const [totpSecret, setTotpSecret] = useState(null);
  const [totpCode, setTotpCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  useEffect(() => {
    if (user) {
      loadMFAStatus();
    }
  }, [user]);

  const loadMFAStatus = async () => {
    try {
      const methods = [];
      
      // Check for TOTP
      if (user.totpEnabled) {
        methods.push({
          type: 'TOTP',
          name: 'Authenticator App',
          enabled: true,
          icon: Smartphone
        });
      }
      
      // Check for Email OTP (Clerk has email as default method)
      if (user.emailAddresses.length > 0) {
        methods.push({
          type: 'EMAIL',
          name: 'Email Code',
          enabled: true,
          icon: Mail
        });
      }

      setMfaMethods(methods);
    } catch (err) {
      console.error('Error loading MFA status:', err);
    }
  };

  const handleEnableTOTP = async () => {
    try {
      setLoading(true);
      
      // Create TOTP secret
      const response = await user.createTOTP();
      setTotpSecret(response);
      setShowTotpSetup(true);
    } catch (err) {
      console.error('Error enabling TOTP:', err);
      toast.error('Failed to enable TOTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTOTP = async () => {
    try {
      setLoading(true);
      
      if (!totpCode || totpCode.length !== 6) {
        toast.error('Please enter a valid 6-digit code');
        return;
      }

      // Verify TOTP code
      const response = await user.verifyTOTP({ code: totpCode });
      
      // Get backup codes
      setBackupCodes(response.backupCodes || []);
      setShowBackupCodes(true);
      toast.success('TOTP enabled successfully!');
      
      // Reload MFA status
      await loadMFAStatus();
      setShowTotpSetup(false);
      setTotpCode('');
    } catch (err) {
      console.error('Error verifying TOTP:', err);
      toast.error('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableTOTP = async () => {
    if (window.confirm('Are you sure you want to disable authenticator app? This cannot be undone.')) {
      try {
        setLoading(true);
        await user.disableTOTP();
        toast.success('Authenticator app disabled');
        await loadMFAStatus();
      } catch (err) {
        console.error('Error disabling TOTP:', err);
        toast.error('Failed to disable TOTP');
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard');
  };

  const downloadBackupCodes = () => {
    const element = document.createElement('a');
    const file = new Blob([backupCodes.join('\n')], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'tde-backup-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Backup codes downloaded');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Multi-Factor Authentication</h2>
      </div>

      {/* MFA Status Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900">Enhanced Security</h3>
            <p className="text-blue-800 text-sm">Enable MFA to add an extra layer of security to your account. You can use your phone's authenticator app or email codes.</p>
          </div>
        </div>
      </div>

      {/* Authenticator App (TOTP) */}
      <div className="border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Authenticator App</h3>
              <p className="text-sm text-gray-600">Use an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy</p>
            </div>
          </div>
          {user?.totpEnabled && (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Enabled
            </span>
          )}
        </div>

        {showTotpSetup && totpSecret ? (
          <div className="bg-gray-50 p-4 rounded mt-4 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                1. Scan this QR code with your authenticator app:
              </p>
              <div className="bg-white p-4 rounded border border-gray-300 inline-block">
                {totpSecret.qr_code && (
                  <img src={totpSecret.qr_code} alt="TOTP QR Code" className="w-48 h-48" />
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Or enter this secret manually:
              </p>
              <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded">
                <code className="flex-1 font-mono text-sm">{totpSecret.secret}</code>
                <button
                  onClick={() => copyToClipboard(totpSecret.secret)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the 6-digit code from your app:
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-2xl text-center tracking-widest"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerifyTOTP}
                disabled={loading || totpCode.length !== 6}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Verify and Enable'}
              </button>
              <button
                onClick={() => {
                  setShowTotpSetup(false);
                  setTotpSecret(null);
                  setTotpCode('');
                }}
                className="flex-1 bg-gray-300 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : user?.totpEnabled ? (
          <button
            onClick={handleDisableTOTP}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
          >
            Disable Authenticator App
          </button>
        ) : (
          <button
            onClick={handleEnableTOTP}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Setting up...' : 'Enable Authenticator App'}
          </button>
        )}
      </div>

      {/* Email OTP */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Email Code</h3>
              <p className="text-sm text-gray-600">Receive verification codes via email</p>
            </div>
          </div>
          <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Available
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Email codes are always available as a backup method for authentication.
        </p>
      </div>

      {/* Backup Codes */}
      {showBackupCodes && backupCodes.length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Save Your Backup Codes</h3>
              <p className="text-yellow-800 text-sm mt-1">
                Keep these codes in a safe place. You can use them to access your account if you lose access to your authenticator app.
              </p>
            </div>
          </div>

          <div className="bg-white border border-yellow-300 rounded p-4 mb-4 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((code, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <code>{code}</code>
                  <button
                    onClick={() => copyToClipboard(code)}
                    className="ml-2 p-1 hover:bg-gray-200 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadBackupCodes}
              className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
            >
              Download Codes
            </button>
            <button
              onClick={() => setShowBackupCodes(false)}
              className="flex-1 bg-gray-300 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
