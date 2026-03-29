import { useState, useEffect, useContext } from 'react';
import { GraduationCap, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import axiosInstance from '../../config/apiConfig.js';
import { toast } from 'react-toastify';
import DataProvider from '../../context/DataProvider.jsx';

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

const statusBadge = (status) => {
  const map = {
    REQUESTED: 'bg-yellow-100 text-yellow-800',
    APPROVED:  'bg-green-100 text-green-700',
    REJECTED:  'bg-red-100 text-red-600',
  };
  return map[status] || 'bg-gray-100 text-gray-500';
};

const ScholarshipManagement = () => {
  const { account } = useContext(DataProvider.DataContext);
  const [scholarships, setScholarships]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filterStatus, setFilterStatus]   = useState('REQUESTED');
  const [expandedId, setExpandedId]       = useState(null);
  const [submittingId, setSubmittingId]   = useState(null);

  // Per-row review form state
  const [reviewForms, setReviewForms] = useState({});

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const params = filterStatus !== 'ALL' ? `?status=${filterStatus}` : '';
      const { data } = await axiosInstance.get(`/api/scholarship/all${params}`);
      setScholarships(data.scholarships || []);
    } catch {
      toast.error('Failed to load scholarship requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchScholarships(); }, [filterStatus]);

  const getForm = (id) => reviewForms[id] || { grantType: 'full', discountType: 'percentage', discountValue: '', adminComments: '' };
  const setForm = (id, patch) => setReviewForms((prev) => ({ ...prev, [id]: { ...getForm(id), ...patch } }));

  const handleReview = async (scholarshipId, action) => {
    const form = getForm(scholarshipId);
    if (action === 'APPROVED' && form.grantType === 'partial' && (!form.discountValue || Number(form.discountValue) <= 0)) {
      toast.error('Please enter a valid discount value for a partial scholarship.');
      return;
    }
    setSubmittingId(scholarshipId);
    try {
      await axiosInstance.patch(`/api/scholarship/review/${scholarshipId}`, {
        action,
        scholarshipType: action === 'APPROVED' ? form.grantType : undefined,
        discountType:    action === 'APPROVED' && form.grantType === 'partial' ? form.discountType : undefined,
        discountValue:   action === 'APPROVED' && form.grantType === 'partial' ? Number(form.discountValue) : undefined,
        adminComments:   form.adminComments || undefined,
        adminId:         account._id,
      });
      toast.success(`Scholarship ${action === 'APPROVED' ? 'approved' : 'rejected'} — applicant notified.`);
      fetchScholarships();
      setExpandedId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to review scholarship');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Scholarship Requests</h2>
          <p className="text-gray-500 text-sm mt-1">Review and grant scholarships for fellowship applications.</p>
        </div>
        <div className="flex gap-2">
          {['REQUESTED', 'APPROVED', 'REJECTED', 'ALL'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === s ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
        </div>
      ) : scholarships.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No scholarship requests found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {scholarships.map((s) => {
            const form      = getForm(s._id);
            const isOpen    = expandedId === s._id;
            const isPending = s.status === 'REQUESTED';
            const app       = s.application;
            const originalAmt = (app?.originalAmount || app?.amount || 0) / 100;

            return (
              <div key={s._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Row header */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : s._id)}
                  className="w-full flex items-start sm:items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-700">
                        {s.user?.FullName?.[0]}{s.user?.FullName?.split(' ')[1]?.[0] || ''}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{s.user?.FullName}</div>
                      <div className="text-xs text-gray-500 truncate">{s.user?.email}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {app?.workgroupId?.title} · {app?.fellowship?.cycle} · ${originalAmt.toFixed(2)} fee
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(s.status)}`}>
                      {s.status}
                    </span>
                    <span className="text-xs text-gray-400">{fmt(s.requestedAt)}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-gray-200 p-5 space-y-5">
                    {/* Reason */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Applicant's Reason</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">{s.requestReason}</p>
                    </div>

                    {/* If already reviewed */}
                    {!isPending && (
                      <div className={`p-4 rounded-lg flex gap-3 ${s.status === 'APPROVED' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {s.status === 'APPROVED'
                          ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                        <div>
                          <p className="text-sm font-semibold">
                            {s.status === 'APPROVED'
                              ? `${s.scholarshipType === 'full' ? 'Full waiver' : `Partial: ${s.discountValue}${s.discountType === 'percentage' ? '%' : '$'} off`} granted`
                              : 'Request rejected'}
                          </p>
                          {s.adminComments && <p className="text-sm text-gray-600 mt-1">{s.adminComments}</p>}
                          {s.reviewedAt && <p className="text-xs text-gray-400 mt-1">Reviewed {fmt(s.reviewedAt)}</p>}
                        </div>
                      </div>
                    )}

                    {/* Review form — only for pending */}
                    {isPending && (
                      <div className="space-y-4">
                        {/* Grant type */}
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">Scholarship Type</p>
                          <div className="flex gap-3 flex-wrap">
                            {['full', 'partial'].map((t) => (
                              <label
                                key={t}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors ${form.grantType === t ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                              >
                                <input
                                  type="radio"
                                  checked={form.grantType === t}
                                  onChange={() => setForm(s._id, { grantType: t })}
                                  className="sr-only text-black"
                                />
                                <span className="text-sm text-black font-medium capitalize">{t === 'full' ? 'Full Waiver (100% off)' : 'Partial Discount'}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Partial config */}
                        {form.grantType === 'partial' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Discount Type</label>
                              <select
                                value={form.discountType}
                                onChange={(e) => setForm(s._id, { discountType: e.target.value })}
                                className="w-full text-black border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
                              >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                {form.discountType === 'percentage' ? '% Off (1–100)' : 'Amount Off ($)'}
                              </label>
                              <input
                                type="number"
                                min="1"
                                max={form.discountType === 'percentage' ? 100 : undefined}
                                value={form.discountValue}
                                onChange={(e) => setForm(s._id, { discountValue: e.target.value })}
                                className="w-full text-black border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
                                placeholder={form.discountType === 'percentage' ? 'e.g. 50' : 'e.g. 1000'}
                              />
                            </div>
                          </div>
                        )}

                        {/* Preview */}
                        {form.grantType === 'full' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                            Full waiver: applicant pays <strong>$0.00</strong> (down from ${originalAmt.toFixed(2)})
                          </div>
                        )}
                        {form.grantType === 'partial' && form.discountValue > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                            {form.discountType === 'percentage'
                              ? `${form.discountValue}% off → applicant pays $${Math.max(0, originalAmt - originalAmt * (form.discountValue / 100)).toFixed(2)}`
                              : `$${form.discountValue} off → applicant pays $${Math.max(0, originalAmt - Number(form.discountValue)).toFixed(2)}`}
                          </div>
                        )}

                        {/* Admin comments */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Note to applicant (optional)</label>
                          <textarea
                            rows={2}
                            value={form.adminComments}
                            onChange={(e) => setForm(s._id, { adminComments: e.target.value })}
                            className="w-full text-black border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-black resize-none"
                            placeholder="Optional message sent with the decision..."
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReview(s._id, 'APPROVED')}
                            disabled={submittingId === s._id}
                            className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {submittingId === s._id ? 'Processing…' : 'Approve Scholarship'}
                          </button>
                          <button
                            onClick={() => handleReview(s._id, 'REJECTED')}
                            disabled={submittingId === s._id}
                            className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScholarshipManagement;
