import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/apiConfig.js';
import { useNavigate } from 'react-router-dom';

/* ── non-Tailwind constants ── */
const FONT   = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const CARD_R = { borderRadius: '25px' };
const STROKE = { border: '0.5px solid #d9d9d9' };
const GRAD   = { background: 'linear-gradient(180deg, #000000 0%, #003172 100%)' };

/* ── helpers ── */
const fmt = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const daysLeft = (end) =>
  Math.ceil((new Date(end) - new Date()) / 86_400_000);

/* ── sub-components ── */

const Spinner = () => (
  <div className="flex justify-center py-20">
    <div
      className="w-11 h-11 rounded-full border-2 border-[#d9d9d9] border-t-[#004aad]"
      style={{ animation: 'spin 0.75s linear infinite' }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const StatusBadge = ({ status, cancelAtPeriodEnd }) => {
  const isActive     = status === 'active' && !cancelAtPeriodEnd;
  const isCancelling = status === 'active' && cancelAtPeriodEnd;

  const cls = isActive
    ? 'bg-green-100 text-green-700'
    : isCancelling
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-gray-100 text-gray-500';

  const label = isActive ? 'Active' : isCancelling ? 'Cancelling' : status;

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-[13px] font-semibold tracking-wide capitalize ${cls}`}
      style={FONT}
    >
      {label}
    </span>
  );
};

const InfoRow = ({ label, value }) => (
  <div
    className="flex justify-between items-center py-3"
    style={{ borderBottom: '0.5px solid #d9d9d9' }}
  >
    <span className="text-[15px] font-light text-gray-500" style={FONT}>{label}</span>
    <span className="text-[15px] font-normal text-black" style={FONT}>{value}</span>
  </div>
);

/* ── main component ── */

const Memberships = ({ userId }) => {
  const [membership, setMembership]   = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('active');
  const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, [userId]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [currentRes, historyRes] = await Promise.all([
        axiosInstance.get(`/api/membership/current/${userId}`),
        axiosInstance.get(`/api/membership/history/${userId}`),
      ]);
      if (currentRes.data?.hasMembership) setMembership(currentRes.data.membership);
      setMemberships(historyRes.data?.memberships || []);
    } catch (err) {
      console.error('Membership fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel subscription? You will retain access until the end of the current billing period.')) return;
    try {
      await axiosInstance.post('/api/membership/cancel', { userId, reason: 'User requested cancellation' });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Cancellation failed. Please try again.');
    }
  };

  const handleReactivate = async () => {
    try {
      await axiosInstance.post('/api/membership/reactivate', { userId });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Reactivation failed. Please try again.');
    }
  };

  const activeMemberships = memberships.filter(m => m.status === 'active' && m.isActive);
  const pastMemberships   = memberships.filter(m => m.status !== 'active' || !m.isActive);

  if (loading) return <Spinner />;

  return (
    <div className="bg-white min-h-screen" style={FONT}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600&display=swap');`}</style>

      <div className="max-w-[900px] mx-auto px-6 py-12">

        {/* ── PAGE HEADER ── */}
        <div className="mb-10">
          <span className="text-gray-400 text-[15px] font-light tracking-widest uppercase" style={FONT}>
            Account
          </span>
          <h1 className="text-black text-[35px] font-normal leading-[45px] mt-2 mb-1" style={FONT}>
            Membership
          </h1>
          <p className="text-gray-500 text-xl font-light leading-[30px]" style={FONT}>
            Manage your subscription and view membership history.
          </p>
        </div>

        {/* ── ACTIVE STRIPE SUBSCRIPTION CARD ── */}
        {membership && (
          <div className="overflow-hidden mb-10" style={{ ...CARD_R, ...STROKE }}>

            {/* card header – dark gradient */}
            <div
              className="px-10 py-8 flex justify-between items-start flex-wrap gap-4"
              style={GRAD}
            >
              <div>
                <span className="text-[#d9d9d9] text-[15px] font-light tracking-widest uppercase" style={FONT}>
                  Current Plan
                </span>
                <h2 className="text-white text-[30px] font-normal leading-[40px] mt-2" style={FONT}>
                  TDE Membership
                </h2>
              </div>
              <StatusBadge status={membership.status} cancelAtPeriodEnd={membership.cancelAtPeriodEnd} />
            </div>

            {/* card body – white */}
            <div className="bg-white px-10 py-8">
              <InfoRow label="Monthly Amount"   value={`$${membership.amount} / month`} />
              <InfoRow
                label="Next Billing Date"
                value={
                  membership.cancelAtPeriodEnd
                    ? `Access ends ${fmt(membership.currentPeriodEnd)}`
                    : fmt(membership.currentPeriodEnd)
                }
              />
              <InfoRow label="Billing Status" value={membership.status} />

              {/* days remaining progress bar */}
              {!membership.cancelAtPeriodEnd && (() => {
                const days = daysLeft(membership.currentPeriodEnd);
                const pct  = Math.max(0, Math.min(100, (days / 30) * 100));
                return (
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-[15px] font-light text-gray-400" style={FONT}>Billing period</span>
                      <span className="text-[15px] font-normal text-[#004aad]" style={FONT}>{days} days remaining</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #004aad, #003172)' }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* action buttons */}
              <div className="mt-8 flex gap-3 flex-wrap">
                {membership.cancelAtPeriodEnd ? (
                  <>
                    <div
                      className="flex-1 px-5 py-3 text-[#004aad] text-[15px] font-light"
                      style={{ ...FONT, borderRadius: '8px', border: '0.5px solid #004aad', background: '#eff6ff' }}
                    >
                      Your membership ends on {fmt(membership.currentPeriodEnd)}. Reactivate to keep access.
                    </div>
                    <button
                      onClick={handleReactivate}
                      className="bg-[#004aad] hover:bg-[#001e47] text-white text-xl font-semibold py-[10px] px-[30px] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                      style={{ ...FONT, borderRadius: '8px', border: 'none' }}
                    >
                      Reactivate
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="bg-transparent text-red-600 text-xl font-normal py-[10px] px-[30px] hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                    style={{ ...FONT, borderRadius: '8px', border: '0.5px solid #dc2626' }}
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── NO SUBSCRIPTION ── */}
        {!membership && (
          <div
            className="text-center px-10 py-16 mb-10 bg-gray-50"
            style={{ ...CARD_R, border: '0.5px dashed #d9d9d9' }}
          >
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#004aad" />
              </svg>
            </div>
            <h3 className="text-black text-[25px] font-normal leading-[35px] mb-3" style={FONT}>
              No Active Membership
            </h3>
            <p className="text-gray-500 text-xl font-light leading-[30px] mb-8" style={FONT}>
              Subscribe to unlock exclusive research, events, and the TDE network.
            </p>
            <button
              onClick={() => navigate('/join-us/pricing')}
              className="bg-[#004aad] hover:bg-[#001e47] text-white text-xl font-semibold py-[10px] px-[30px] transition-colors duration-200 cursor-pointer"
              style={{ ...FONT, borderRadius: '8px', border: 'none' }}
            >
              Explore Membership
            </button>
          </div>
        )}

        {/* ── HISTORY SECTION ── */}
        <div className="mb-8">
          <h2 className="text-black text-[25px] font-normal leading-[35px] mb-5" style={FONT}>
            Membership History
          </h2>

          {/* tab bar */}
          <div className="flex" style={{ borderBottom: '0.5px solid #d9d9d9' }}>
            {[
              { key: 'active', label: `Active (${activeMemberships.length})` },
              { key: 'past',   label: `Past (${pastMemberships.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`mr-8 pb-3 text-xl transition-colors duration-200 cursor-pointer bg-transparent
                  ${activeTab === tab.key
                    ? 'text-[#004aad] font-semibold'
                    : 'text-gray-400 font-light hover:text-gray-600'}`}
                style={{
                  ...FONT,
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid #004aad' : '2px solid transparent',
                  marginBottom: '-0.5px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── ACTIVE HISTORY ── */}
        {activeTab === 'active' && (
          activeMemberships.length > 0 ? (
            <div className="flex flex-col gap-4">
              {activeMemberships.map((m, i) => {
                const days = daysLeft(m.endDate);
                return (
                  <div key={i} className="bg-white px-10 py-8" style={{ ...CARD_R, ...STROKE }}>
                    <div className="flex justify-between items-start flex-wrap gap-3 mb-5">
                      <h3 className="text-black text-[25px] font-normal leading-[35px] capitalize" style={FONT}>
                        {m.membershipType} Membership
                      </h3>
                      <StatusBadge status="active" cancelAtPeriodEnd={false} />
                    </div>
                    <div className="flex gap-10 flex-wrap">
                      {[['Start Date', m.startDate], ['End Date', m.endDate]].map(([lbl, val]) => (
                        <div key={lbl}>
                          <div className="text-[15px] font-light text-gray-400 mb-1" style={FONT}>{lbl}</div>
                          <div className="text-[15px] font-normal text-black" style={FONT}>{fmt(val)}</div>
                        </div>
                      ))}
                    </div>
                    {days > 0 && (
                      <div
                        className="mt-5 inline-block px-4 py-2 text-[#004aad] text-[15px] font-light"
                        style={{ ...FONT, borderRadius: '8px', border: '0.5px solid #004aad', background: '#eff6ff' }}
                      >
                        {days} days remaining
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="text-center px-10 py-12 bg-gray-50"
              style={{ ...CARD_R, border: '0.5px dashed #d9d9d9' }}
            >
              <p className="text-gray-400 text-xl font-light" style={FONT}>No active memberships found.</p>
            </div>
          )
        )}

        {/* ── PAST HISTORY ── */}
        {activeTab === 'past' && (
          pastMemberships.length > 0 ? (
            <div className="flex flex-col gap-4">
              {pastMemberships.map((m, i) => (
                <div key={i} className="bg-white px-10 py-8" style={{ ...CARD_R, ...STROKE }}>
                  <div className="flex justify-between items-start flex-wrap gap-3 mb-5">
                    <h3 className="text-black text-[25px] font-normal leading-[35px] capitalize" style={FONT}>
                      {m.membershipType} Membership
                    </h3>
                    <span
                      className="inline-block bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[13px] font-semibold capitalize"
                      style={FONT}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div className="flex gap-10 flex-wrap">
                    {[['Start Date', m.startDate], ['End Date', m.endDate]].map(([lbl, val]) => (
                      <div key={lbl}>
                        <div className="text-[15px] font-light text-gray-400 mb-1" style={FONT}>{lbl}</div>
                        <div className="text-[15px] font-normal text-black" style={FONT}>{fmt(val)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center px-10 py-12 bg-gray-50"
              style={{ ...CARD_R, border: '0.5px dashed #d9d9d9' }}
            >
              <p className="text-gray-400 text-xl font-light" style={FONT}>No past memberships.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Memberships;