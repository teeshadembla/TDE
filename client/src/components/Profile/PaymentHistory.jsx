import { useState, useEffect } from 'react';
import { Receipt, Download, ChevronLeft, ChevronRight, CreditCard, Award } from 'lucide-react';
import axiosInstance from '../../config/apiConfig';

/* ── design constants matching the existing profile design system ── */
const FONT   = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const CARD_R = { borderRadius: '25px' };
const STROKE = { border: '0.5px solid #d9d9d9' };

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

const StatusBadge = ({ status }) => {
  const map = {
    paid:                 'bg-green-100 text-green-700',
    failed:               'bg-red-100 text-red-600',
    pending:              'bg-yellow-100 text-yellow-700',
    refunded:             'bg-gray-100 text-gray-500',
    partially_refunded:   'bg-orange-100 text-orange-700',
  };
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-[13px] font-semibold capitalize ${map[status] || 'bg-gray-100 text-gray-500'}`}
      style={FONT}
    >
      {status?.replace('_', ' ')}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[12px] font-medium ${
      type === 'fellowship' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
    }`}
    style={FONT}
  >
    {type === 'fellowship' ? <Award className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
    {type === 'fellowship' ? 'Fellowship' : 'Membership'}
  </span>
);

const Spinner = () => (
  <div className="flex justify-center py-20">
    <div className="w-11 h-11 rounded-full border-2 border-[#d9d9d9] border-t-[#004aad]" style={{ animation: 'spin 0.75s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const PaymentHistory = ({ userId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeType, setActiveType] = useState('all'); // all | membership | fellowship
  const [page, setPage]         = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    setPage(1);
  }, [activeType]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 10 });
        if (activeType !== 'all') params.set('type', activeType);
        const { data } = await axiosInstance.get(`/api/membership/payments/${userId}?${params}`);
        setPayments(data.payments || []);
        setPagination(data.pagination || { total: 0, pages: 1 });
      } catch (err) {
        console.error('Error fetching payment history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [userId, activeType, page]);

  const getDescription = (payment) => {
    if (payment.paymentType === 'fellowship') {
      const app = payment.fellowshipApplication;
      if (!app) return 'Fellowship Payment';
      const cycle = app.fellowship?.cycle || '';
      const wg    = app.workgroupId?.title || '';
      return `Fellowship — ${[wg, cycle].filter(Boolean).join(', ')}`;
    }
    return payment.description || 'Membership Subscription';
  };

  const tabs = [
    { key: 'all',        label: 'All Payments' },
    { key: 'membership', label: 'Membership' },
    { key: 'fellowship', label: 'Fellowship' },
  ];

  return (
    <div className="bg-white min-h-screen" style={FONT}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600&display=swap');`}</style>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
        {/* Page header */}
        <div className="mb-10">
          <span className="text-gray-400 text-[15px] font-light tracking-widest uppercase">Account</span>
          <h1 className="text-black text-[35px] font-normal leading-[45px] mt-2 mb-1">Payment History</h1>
          <p className="text-gray-500 text-xl font-light leading-[30px]">
            All your membership and fellowship payments in one place.
          </p>
        </div>

        {/* Type filter tabs */}
        <div className="flex mb-8" style={{ borderBottom: '0.5px solid #d9d9d9' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveType(tab.key)}
              className={`mr-8 pb-3 text-xl transition-colors duration-200 cursor-pointer bg-transparent ${
                activeType === tab.key ? 'text-[#004aad] font-semibold' : 'text-gray-400 font-light hover:text-gray-600'
              }`}
              style={{
                ...FONT,
                border: 'none',
                borderBottom: activeType === tab.key ? '2px solid #004aad' : '2px solid transparent',
                marginBottom: '-0.5px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : payments.length === 0 ? (
          <div className="text-center px-10 py-16 bg-gray-50" style={{ ...CARD_R, border: '0.5px dashed #d9d9d9' }}>
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-xl font-light">No payment records found.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="bg-white px-6 sm:px-8 py-6"
                  style={{ ...CARD_R, ...STROKE }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <TypeBadge type={payment.paymentType} />
                        <StatusBadge status={payment.status} />
                      </div>
                      <p className="text-black text-[17px] font-normal truncate" style={FONT}>
                        {getDescription(payment)}
                      </p>
                      <p className="text-gray-400 text-[14px] font-light mt-1" style={FONT}>
                        {fmt(payment.paidAt || payment.attemptedAt || payment.createdAt)}
                      </p>
                      {/* Discount / scholarship note */}
                      {payment.paymentType === 'fellowship' && payment.fellowshipApplication?.discountCode && (
                        <p className="text-green-600 text-[13px] mt-1" style={FONT}>
                          Discount code: {payment.fellowshipApplication.discountCode}
                        </p>
                      )}
                      {payment.paymentType === 'fellowship' && payment.fellowshipApplication?.isScholarshipApplied && (
                        <p className="text-blue-600 text-[13px] mt-1" style={FONT}>
                          Scholarship applied
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
                      <span className="text-black text-[22px] font-normal" style={FONT}>
                        ${(payment.amount / 100).toFixed(2)}
                      </span>
                      {payment.invoicePdf && (
                        <a
                          href={payment.invoicePdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#004aad] text-[14px] font-light hover:underline"
                          style={FONT}
                        >
                          <Download className="w-4 h-4" />
                          Invoice
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-8 px-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 text-[15px] font-light text-gray-500 hover:text-black disabled:opacity-30 transition-colors bg-transparent border-none cursor-pointer"
                  style={FONT}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-gray-400 text-[14px] font-light" style={FONT}>
                  Page {page} of {pagination.pages} · {pagination.total} records
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="flex items-center gap-2 text-[15px] font-light text-gray-500 hover:text-black disabled:opacity-30 transition-colors bg-transparent border-none cursor-pointer"
                  style={FONT}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
