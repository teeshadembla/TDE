import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ShieldCheck, Shield, RefreshCw, ExternalLink } from 'lucide-react';

const MFASettings = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState('idle');

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
        <RefreshCw size={14} className="animate-spin" /> Loading security settings...
      </div>
    );
  }

  const isMFAEnabled = user?.twoFactorEnabled;

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
      </div>

      {/* Single CTA — always routes to /setup-2fa */}
      <button
        onClick={() => navigate('/setup-2fa')}
        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
      >
        {isMFAEnabled ? <ShieldCheck size={14} /> : <Shield size={14} />}
        {isMFAEnabled ? 'Manage 2FA settings' : 'Enable 2FA'}
        <ExternalLink size={12} className="opacity-60" />
      </button>
    </div>
  );
};

export default MFASettings;