import React, { useEffect, useState } from 'react';
import axiosInstance from '../../config/apiConfig.js';
import { useNavigate } from 'react-router-dom';

const Memberships = ({ userId }) => {
  const [membership, setMembership] = useState(null); // stripe active membership
  const [memberships, setMemberships] = useState([]); // history
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, [userId]);

  const fetchAll = async () => {
    try {
      setLoading(true);

      // 1. active stripe membership
      const { data } = await axiosInstance.get(`/api/membership/current/${userId}`);
      if (data?.hasMembership) {
        setMembership(data.membership);
      }

      // 2. membership history
      const historyRes = await axiosInstance.get(`/api/users/${userId}/memberships`);
      setMemberships(historyRes.data.membership || []);
    } catch (err) {
      console.error('Membership fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CANCEL / REACTIVATE ---------------- */
  const handleCancel = async () => {
    if (!window.confirm('Cancel subscription?')) return;

    try {
      await axiosInstance.post('/api/membership/cancel', {
        userId,
        reason: 'User requested cancellation'
      });

      alert('Subscription will cancel at period end');
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Cancel failed');
    }
  };

  const handleReactivate = async () => {
    try {
      await axiosInstance.post('/api/membership/reactivate', { userId });
      alert('Reactivated');
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Reactivate failed');
    }
  };

  /* ---------------- HELPERS ---------------- */
  const activeMemberships = memberships.filter(m => m.status === 'active' && m.isActive);
  const pastMemberships = memberships.filter(m => m.status !== 'active' || !m.isActive);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const getDaysRemaining = (endDate) => {
    const diff = new Date(endDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 border-b-2 border-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* ---------- ACTIVE STRIPE SUBSCRIPTION ---------- */}
      {membership && (
        <div className="bg-white border rounded-xl p-6 shadow-sm mb-10">
          <h2 className="text-2xl font-bold mb-4">Manage Subscription</h2>

          <div className="space-y-2 text-gray-700">
            <p><strong>Plan:</strong> {membership.tier}</p>
            <p><strong>Status:</strong> {membership.status}</p>
            <p><strong>Next Billing:</strong> {new Date(membership.currentPeriodEnd).toLocaleDateString()}</p>
            <p><strong>Amount:</strong> ${membership.amount}/month</p>
          </div>

          <div className="mt-6">
            {membership.cancelAtPeriodEnd ? (
              <div>
                <p className="mb-3 text-sm text-gray-600">
                  Subscription ends on {new Date(membership.currentPeriodEnd).toLocaleDateString()}
                </p>
                <button
                  onClick={handleReactivate}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Reactivate
                </button>
              </div>
            ) : (
              <button
                onClick={handleCancel}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---------- MEMBERSHIP DASHBOARD ---------- */}
      <h2 className="text-2xl font-bold mb-1">Your Memberships</h2>
      <p className="text-gray-600 mb-6">View and manage active and past memberships</p>

      {/* tabs */}
      <div className="flex gap-6 border-b mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 font-medium ${activeTab === 'active' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
        >
          Active ({activeMemberships.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 font-medium ${activeTab === 'past' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
        >
          Past ({pastMemberships.length})
        </button>
      </div>

      {/* ---------- ACTIVE TAB ---------- */}
      {activeTab === 'active' && (
        <>
          {activeMemberships.length > 0 ? (
            <div className="space-y-4">
              {activeMemberships.map((m, i) => {
                const days = getDaysRemaining(m.endDate);

                return (
                  <div key={i} className="bg-white border rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-semibold text-lg capitalize">{m.membershipType} membership</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Active</span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Start: {formatDate(m.startDate)}</p>
                      <p>End: {formatDate(m.endDate)}</p>
                    </div>

                    {days > 0 && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                        {days} days remaining
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed">
              <h3 className="text-lg font-semibold mb-2">No Active Memberships</h3>
              <p className="text-gray-600 mb-5">You don't have an active membership</p>
              <button
                onClick={() => navigate('/join-us/pricing')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Explore Memberships
              </button>
            </div>
          )}
        </>
      )}

      {/* ---------- PAST TAB ---------- */}
      {activeTab === 'past' && (
        <>
          {pastMemberships.length > 0 ? (
            <div className="space-y-4">
              {pastMemberships.map((m, i) => (
                <div key={i} className="bg-white border rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-semibold capitalize">{m.membershipType} membership</h3>
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                      {m.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Start: {formatDate(m.startDate)}</p>
                    <p>End: {formatDate(m.endDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed">
              <h3 className="text-lg font-semibold mb-2">No Past Memberships</h3>
              <p className="text-gray-600">No membership history</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Memberships;
