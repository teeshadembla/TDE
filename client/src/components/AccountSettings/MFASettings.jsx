import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Shield, ShieldCheck, ShieldOff, Smartphone, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const MFASettings = () => {
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState('idle'); // idle | setup | verify | disabling
  const [totp, setTotp] = useState(null); // { qrCodeUri, secret } from Clerk
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
        <RefreshCw size={14} className="animate-spin" /> Loading security settings...
      </div>
    );
  }

  const isMFAEnabled = user?.twoFactorEnabled;

  const handleEnableMFA = async () => {
    setIsLoading(true);
    try {
      // Create TOTP factor via Clerk
      const totpFactor = await user.createTOTP();
      setTotp(totpFactor);
      setStep('setup');
    } catch (err) {
      toast.error('Failed to start MFA setup. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTOTP = async () => {
    if (!verificationCode.trim() || verificationCode.length < 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    setIsLoading(true);
    try {
      const { backupCodes: codes } = await totp.verify({ code: verificationCode });
      if (codes?.length) {
        setBackupCodes(codes);
        setShowBackupCodes(true);
      }
      setStep('idle');
      toast.success('Two-factor authentication enabled!');
      await user.reload();
    } catch (err) {
      toast.error('Invalid code. Please check your authenticator app and try again.');
    } finally {
      setIsLoading(false);
      setVerificationCode('');
    }
  };

  const handleDisableMFA = async () => {
    setStep('disabling');
  };

  const confirmDisableMFA = async () => {
    setIsLoading(true);
    try {
      // Delete the TOTP factor
      const totpFactors = user.totpEnabled ? user.twoFactorEnabled : null;
      await user.disableTOTP();
      await user.reload();
      setStep('idle');
      toast.success('Two-factor authentication disabled.');
    } catch (err) {
      toast.error('Failed to disable MFA. Please try again.');
      console.error(err);
      setStep('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    if (totp?.secret) {
      navigator.clipboard.writeText(totp.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
        <p className="mt-1 text-sm text-gray-500">Add an extra layer of security to your account</p>
      </div>

      {/* Status banner */}
      <div className={`mb-8 flex items-center gap-4 rounded-xl p-5 ${isMFAEnabled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isMFAEnabled ? 'bg-green-100' : 'bg-gray-200'}`}>
          {isMFAEnabled
            ? <ShieldCheck size={22} className="text-green-600" />
            : <Shield size={22} className="text-gray-500" />
          }
        </div>
        <div className="flex-1">
          <p className={`font-semibold text-sm ${isMFAEnabled ? 'text-green-800' : 'text-gray-700'}`}>
            {isMFAEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
          </p>
          <p className={`text-xs mt-0.5 ${isMFAEnabled ? 'text-green-600' : 'text-gray-500'}`}>
            {isMFAEnabled
              ? 'Your account is protected with TOTP authentication'
              : 'Enable 2FA to significantly improve your account security'
            }
          </p>
        </div>
        {isMFAEnabled && step !== 'disabling' && (
          <button
            onClick={handleDisableMFA}
            className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Disable
          </button>
        )}
      </div>

      {/* IDLE — not enabled */}
      {!isMFAEnabled && step === 'idle' && (
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">Setup Authenticator App</h3>
          <p className="mb-6 text-sm text-gray-600">
            Use an authenticator app like <strong>Google Authenticator</strong>, <strong>Authy</strong>, or <strong>1Password</strong> to generate time-based one-time passwords.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
            {[
              { name: 'Google Authenticator', desc: 'iOS & Android' },
              { name: 'Authy', desc: 'iOS, Android & Desktop' },
              { name: '1Password', desc: 'All platforms' }
            ].map(app => (
              <div key={app.name} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
                <Smartphone size={18} className="shrink-0 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{app.name}</p>
                  <p className="text-xs text-gray-500">{app.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleEnableMFA}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <><RefreshCw size={14} className="animate-spin" /> Setting up...</> : <><Shield size={14} /> Enable 2FA</>}
          </button>
        </section>
      )}

      {/* STEP: SETUP — show QR code */}
      {step === 'setup' && totp && (
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">Scan QR Code</h3>
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Open your authenticator app and scan the QR code below, or enter the setup key manually.
            </p>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm">
                <img
                  src={totp.qrCodeUri}
                  alt="TOTP QR Code"
                  className="h-48 w-48 rounded-lg"
                />
              </div>
            </div>

            {/* Manual entry key */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Manual Setup Key</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all rounded-lg bg-white border border-gray-200 px-3 py-2 text-xs font-mono text-gray-800">
                  {totp.secret}
                </code>
                <button
                  onClick={copySecret}
                  className="shrink-0 rounded-lg border border-gray-200 p-2 hover:bg-white transition-colors"
                >
                  {copiedSecret ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-500" />}
                </button>
              </div>
            </div>

            {/* Verification */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Enter the 6-digit code from your app
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-36 rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-4 text-center text-lg font-mono tracking-widest text-gray-900 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                <button
                  onClick={handleVerifyTOTP}
                  disabled={isLoading || verificationCode.length < 6}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Verify & Enable
                </button>
                <button
                  onClick={() => { setStep('idle'); setTotp(null); }}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STEP: Disable confirmation */}
      {step === 'disabling' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <ShieldOff size={20} className="shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 text-sm">Disable two-factor authentication?</h3>
              <p className="mt-1 text-sm text-red-700">
                This will remove the extra layer of security from your account. You can re-enable it at any time.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setStep('idle')}
                  className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Keep Enabled
                </button>
                <button
                  onClick={confirmDisableMFA}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <ShieldOff size={14} />}
                  Yes, Disable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backup Codes Modal */}
      {showBackupCodes && backupCodes.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">Save Your Backup Codes</h3>
            <p className="mt-2 text-sm text-gray-500">
              Store these backup codes somewhere safe. Each code can only be used once if you lose access to your authenticator app.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {backupCodes.map((code, i) => (
                <code key={i} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center text-sm font-mono text-gray-800">
                  {code}
                </code>
              ))}
            </div>
            <button
              onClick={() => setShowBackupCodes(false)}
              className="mt-6 w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
              I've saved these codes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MFASettings;