import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/apiConfig';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import DataProvider from '../../context/DataProvider.jsx';

/* ── non-Tailwind constants (values outside default scale) ── */
const FONT   = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const CARD_R = { borderRadius: '25px' };
const STROKE = { border: '0.5px solid #d9d9d9' };
const GRAD   = { background: 'linear-gradient(180deg, #000000 0%, #003172 100%)' };
const GLOW   = { background: 'radial-gradient(circle at 70% 20%, rgba(0,74,173,0.35) 0%, transparent 65%)' };

const PLAN_FEATURES = [
  'Access all exclusive publications & research',
  'Join member-only events and expert sessions',
  'On-demand session recordings & expert briefings',
  'Connect with fellows and chairs globally',
  'Early access to new programmes & initiatives',
  'Members-only newsletter with curated insights',
];

const TERMS = [
  {
    title: 'Auto-Renewal',
    body:  'Your membership renews automatically every month. You will receive a reminder email 24 hours before each renewal date.',
  },
  {
    title: 'Cancellation',
    body:  'You may cancel at any time from your profile dashboard. Access continues until the end of the current billing period.',
  },
  {
    title: 'Payments',
    body:  'Payments are processed securely via Stripe. We accept all major credit and debit cards.',
  },
  {
    title: 'Refunds',
    body:  'We offer a 30-day money-back guarantee if you are not satisfied with your membership.',
  },
];

const WHY = [
  {
    label: 'Global Network',
    body:  'Connect with fellows, chairs, and senior economists operating at the intersection of technology and policy.',
  },
  {
    label: 'Exclusive Research',
    body:  'Access a curated library of briefings, reports, and session recordings unavailable anywhere else.',
  },
  {
    label: 'Shape the Future',
    body:  'Participate in working groups and initiatives that directly influence digital economic policy.',
  },
];

/* ── small components ── */

const CheckIcon = () => (
  <svg className="shrink-0 mt-0.5" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="#004aad" />
    <path d="M5 9l3 3 5-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AccordionItem = ({ title, body }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="cursor-pointer py-5 select-none"
      style={{ borderBottom: '0.5px solid #d9d9d9' }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex justify-between items-center gap-4">
        <span className="text-white text-xl font-light" style={FONT}>{title}</span>
        <svg
          width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}
        >
          <path d="M4 7l5 5 5-5" stroke="#d9d9d9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {open && (
        <p className="mt-3 text-[#d9d9d9] text-xl font-light leading-[30px]" style={FONT}>
          {body}
        </p>
      )}
    </div>
  );
};

/* ── main page ── */

const MembershipBrowse = () => {
  const { isSignedIn } = useAuth();
  const { account }    = useContext(DataProvider.DataContext);
  const [checkingOut, setCheckingOut] = useState(false);

 const handleSubscribe = async () => {
  if (!isSignedIn) {
    toast.error('Please sign in to subscribe');
    window.location.href = '/sign-in?redirect=/join-us/pricing';
    return;
  }
  if (!account?._id) {
    toast.error('Please wait while we load your profile…');
    return;
  }
  setCheckingOut(true);
  try {
    const { data } = await axiosInstance.post('/api/membership/checkout', { userId: account._id });

    if (data.savedCard) {
      // Card was charged directly — go straight to success page
      window.location.href = data.redirectUrl;
    } else {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    }
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Unable to start checkout');
  } finally {
    setCheckingOut(false);
  }
};

  return (
    <div className="bg-black min-h-screen" style={FONT}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600&display=swap');`}</style>

      {/* ── HERO ── */}
      <section className="max-w-[1248px] mx-auto px-10 pt-[120px] pb-[80px]">

        {/* eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-[60px] bg-[#d9d9d9]" />
          <span className="text-[#d9d9d9] text-[15px] font-light tracking-widest uppercase" style={FONT}>
            Membership
          </span>
        </div>

        <div className="grid grid-cols-2 gap-20 items-end">

          {/* left: copy */}
          <div>
            <h1 className="text-white text-[50px] font-normal leading-[60px] mb-8" style={FONT}>
              Join the community shaping the digital economy
            </h1>
            <p className="text-[#d9d9d9] text-[25px] font-light leading-[35px]" style={FONT}>
              One membership. Full access to research, events, and a global network of economists and policy leaders.
            </p>
          </div>

          {/* right: plan card */}
          <div className="relative overflow-hidden p-10" style={{ ...GRAD, ...CARD_R, ...STROKE }}>
            {/* radial glow */}
            <div className="absolute -top-14 -right-14 w-[220px] h-[220px] pointer-events-none" style={GLOW} />

            <span className="text-[#d9d9d9] text-[15px] font-light tracking-widest uppercase" style={FONT}>
              Monthly auto-renewing
            </span>

            <div className="flex items-baseline gap-2 mt-5 mb-8">
              <span className="text-white text-[50px] font-normal leading-[60px]" style={FONT}>$39</span>
              <span className="text-[#d9d9d9] text-xl font-light" style={FONT}>/ month</span>
            </div>

            <div className="flex flex-col gap-4 mb-10">
              {PLAN_FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-white text-xl font-light leading-[30px]" style={FONT}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubscribe}
              disabled={checkingOut}
              className={`w-full text-white text-xl font-semibold py-[10px] px-[30px] transition-colors duration-200
                ${checkingOut
                  ? 'bg-[#001e47] cursor-not-allowed'
                  : 'bg-[#004aad] hover:bg-[#001e47] cursor-pointer'}`}
              style={{ ...FONT, borderRadius: '8px', border: 'none' }}
            >
              {checkingOut ? 'Redirecting…' : 'Subscribe Now'}
            </button>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-[1248px] mx-auto px-10">
        <div className="h-px bg-[#d9d9d9] opacity-30" />
      </div>

      {/* ── WHY JOIN ── */}
      <section className="max-w-[1248px] mx-auto px-10 py-[80px]">

        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-[60px] bg-[#d9d9d9]" />
          <span className="text-[#d9d9d9] text-[15px] font-light tracking-widest uppercase" style={FONT}>
            Why join
          </span>
        </div>

        <h2 className="text-white text-[35px] font-normal leading-[45px] mb-12 max-w-[560px]" style={FONT}>
          Built for economists, policy leaders, and digital innovators
        </h2>

        <div className="grid grid-cols-3 gap-5">
          {WHY.map((item, i) => (
            <div key={i} className="p-10" style={{ ...GRAD, ...CARD_R, ...STROKE }}>
              <div className="w-10 h-px bg-[#004aad] mb-5" />
              <h3 className="text-white text-[30px] font-normal leading-[40px] mb-5" style={FONT}>
                {item.label}
              </h3>
              <p className="text-[#d9d9d9] text-xl font-light leading-[30px]" style={FONT}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-[1248px] mx-auto px-10">
        <div className="h-px bg-[#d9d9d9] opacity-30" />
      </div>

      {/* ── TERMS & CONDITIONS ── */}
      <section className="max-w-[1248px] mx-auto px-10 py-[80px]">

        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-[60px] bg-[#d9d9d9]" />
          <span className="text-[#d9d9d9] text-[15px] font-light tracking-widest uppercase" style={FONT}>
            Terms & Conditions
          </span>
        </div>

        <div className="grid grid-cols-2 gap-20 items-start">
          <div>
            <h2 className="text-white text-[35px] font-normal leading-[45px] mb-5" style={FONT}>
              What you need to know
            </h2>
            <p className="text-[#d9d9d9] text-xl font-light leading-[30px]" style={FONT}>
              By subscribing you agree to the membership terms outlined below. Please read them carefully before proceeding.
            </p>
          </div>
          <div>
            {TERMS.map((item, i) => (
              <AccordionItem key={i} title={item.title} body={item.body} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <div className="max-w-[1248px] mx-auto px-10">
        <div className="h-px bg-[#d9d9d9] opacity-30" />
      </div>

      <section className="max-w-[1248px] mx-auto px-10 py-[80px] flex justify-between items-center gap-10 flex-wrap">
        <div>
          <h2 className="text-white text-[35px] font-normal leading-[45px] mb-3" style={FONT}>
            Ready to join?
          </h2>
          <p className="text-[#d9d9d9] text-xl font-light leading-[30px]" style={FONT}>
            $39 / month · Cancel anytime · Auto-renewing
          </p>
        </div>

        <div className="flex gap-5 flex-wrap">
          <button
            onClick={handleSubscribe}
            disabled={checkingOut}
            className={`text-white text-xl font-semibold py-[10px] px-[30px] transition-colors duration-200
              ${checkingOut
                ? 'bg-[#001e47] cursor-not-allowed'
                : 'bg-[#004aad] hover:bg-[#001e47] cursor-pointer'}`}
            style={{ ...FONT, borderRadius: '8px', border: 'none' }}
          >
            {checkingOut ? 'Redirecting…' : 'Subscribe Now'}
          </button>

          <button
            onClick={() => window.history.back()}
            className="bg-transparent text-white text-xl font-normal py-[10px] px-[30px] hover:border-white transition-colors duration-200 cursor-pointer"
            style={{ ...FONT, borderRadius: '8px', border: '0.5px solid #d9d9d9' }}
          >
            Go Back
          </button>
        </div>
      </section>
    </div>
  );
};

export default MembershipBrowse;