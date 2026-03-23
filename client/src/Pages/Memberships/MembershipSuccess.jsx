import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/* ── non-Tailwind constants ── */
const FONT   = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const CARD_R = { borderRadius: '25px' };
const STROKE = { border: '0.5px solid #d9d9d9' };
const GRAD   = { background: 'linear-gradient(180deg, #000000 0%, #003172 100%)' };

const STEPS = [
  {
    n:     '1',
    title: 'Explore Publications',
    body:  'Access our full library of exclusive research, reports, and expert briefings.',
  },
  {
    n:     '2',
    title: 'Check Your Email',
    body:  'We have sent a welcome email with important onboarding information.',
  },
  {
    n:     '3',
    title: 'Manage Your Subscription',
    body:  'Update payment details, view invoices, or cancel from your profile at any time.',
  },
];

const MembershipSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) { navigate('/join-us/pricing'); return; }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); navigate('/publications'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [searchParams, navigate]);

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-6 py-[80px]" style={FONT}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600&display=swap');`}</style>

      <div className="max-w-[720px] w-full text-center">

        {/* ── icon ── */}
        <div className="flex justify-center mb-10">
          <div
            className="w-20 h-20 flex items-center justify-center"
            style={{ ...GRAD, ...STROKE, borderRadius: '50%' }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M7 16.5l6 6L25 10" stroke="#004aad" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ── eyebrow ── */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-10 bg-[#d9d9d9]" />
          <span className="text-[#d9d9d9] text-[15px] font-light tracking-widest uppercase" style={FONT}>
            Subscription Confirmed
          </span>
          <div className="h-px w-10 bg-[#d9d9d9]" />
        </div>

        <h1 className="text-white text-[50px] font-normal leading-[60px] mb-5" style={FONT}>
          Welcome to TDE
        </h1>
        <p className="text-[#d9d9d9] text-[25px] font-light leading-[35px] mb-16" style={FONT}>
          Your membership is now active. Here is how to get started.
        </p>

        {/* ── steps card ── */}
        <div className="p-10 mb-10 text-left" style={{ ...GRAD, ...CARD_R, ...STROKE }}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex gap-5 items-start ${i < STEPS.length - 1 ? 'pb-8 mb-8' : ''}`}
              style={i < STEPS.length - 1 ? { borderBottom: '0.5px solid #d9d9d9' } : {}}
            >
              <div
                className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-[#004aad] text-white text-[15px] font-semibold"
                style={FONT}
              >
                {s.n}
              </div>
              <div>
                <h3 className="text-white text-xl font-normal leading-[30px] mb-1.5" style={FONT}>
                  {s.title}
                </h3>
                <p className="text-[#d9d9d9] text-xl font-light leading-[30px]" style={FONT}>
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── countdown ── */}
        <div
          className="px-6 py-3 mb-10 text-[#d9d9d9] text-xl font-light"
          style={{ ...FONT, borderRadius: '8px', border: '0.5px solid rgba(0,74,173,0.4)', background: 'rgba(0,74,173,0.08)' }}
        >
          Redirecting to Publications in{' '}
          <span className="text-[#004aad] text-[25px] font-normal" style={FONT}>{countdown}</span>
          {' '}seconds…
        </div>

        {/* ── buttons ── */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/publications')}
            className="bg-[#004aad] hover:bg-[#001e47] text-white text-xl font-semibold py-[10px] px-[30px] transition-colors duration-200 cursor-pointer"
            style={{ ...FONT, borderRadius: '8px', border: 'none' }}
          >
            Go to Publications
          </button>

          <button
            onClick={() => navigate('/profile/membership')}
            className="bg-transparent text-white text-xl font-normal py-[10px] px-[30px] hover:border-white transition-colors duration-200 cursor-pointer"
            style={{ ...FONT, borderRadius: '8px', border: '0.5px solid #d9d9d9' }}
          >
            Manage Subscription
          </button>
        </div>

        <p className="mt-10 text-[#d9d9d9] text-[15px] font-light" style={FONT}>
          Need help?{' '}
          <a href="/support" className="text-[#004aad] hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default MembershipSuccess;