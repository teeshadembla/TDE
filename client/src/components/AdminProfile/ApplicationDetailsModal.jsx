import { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, CreditCard, AlertCircle,
  DollarSign, X, GraduationCap, ChevronDown, ChevronUp
} from 'lucide-react';
import axiosInstance from '../../config/apiConfig.js';
import { toast } from 'react-toastify';

const ApplicationDetailsModal = ({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  processingId,
  onRefresh,
}) => {
  const [scholarship, setScholarship] = useState(null);
  const [loadingScholarship, setLoadingScholarship] = useState(false);
  const [showScholarshipPanel, setShowScholarshipPanel] = useState(false);

  // Scholarship grant form state
  const [grantType, setGrantType] = useState('full');           // full | partial
  const [discountType, setDiscountType] = useState('percentage'); // percentage | fixed
  const [discountValue, setDiscountValue] = useState('');
  const [adminComments, setAdminComments] = useState('');
  const [submittingScholarship, setSubmittingScholarship] = useState(false);

  useEffect(() => {
    if (!isOpen || !application) return;
    setScholarship(null);
    setShowScholarshipPanel(false);
    setGrantType('full');
    setDiscountType('percentage');
    setDiscountValue('');
    setAdminComments('');

    setLoadingScholarship(true);
    axiosInstance.get(`/api/scholarship/application/${application._id}`)
      .then((res) => setScholarship(res.data.scholarship))
      .catch(() => {})
      .finally(() => setLoadingScholarship(false));
  }, [isOpen, application?._id]);

  if (!isOpen || !application) return null;

  const isProcessing = processingId === application._id;
  const isPending   = application.status === 'PENDING_REVIEW';
  const isApproved  = application.status === 'APPROVED';
  const isConfirmed = application.status === 'CONFIRMED';
  const amount      = (application.originalAmount || application.amount) / 100;
  const finalAmount = application.amount / 100;

  const handleApproveScholarship = async () => {
    if (grantType === 'partial' && (!discountValue || Number(discountValue) <= 0)) {
      toast.error('Please enter a valid discount value.');
      return;
    }
    setSubmittingScholarship(true);
    try {
      await axiosInstance.patch(`/api/scholarship/review/${scholarship._id}`, {
        action: 'APPROVED',
        scholarshipType: grantType,
        discountType: grantType === 'partial' ? discountType : undefined,
        discountValue: grantType === 'partial' ? Number(discountValue) : undefined,
        adminComments,
        adminId: null, // server will pull from auth context if needed
      });
      toast.success('Scholarship approved and applicant notified.');
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve scholarship');
    } finally {
      setSubmittingScholarship(false);
    }
  };

  const handleRejectScholarship = async () => {
    setSubmittingScholarship(true);
    try {
      await axiosInstance.patch(`/api/scholarship/review/${scholarship._id}`, {
        action: 'REJECTED',
        adminComments,
      });
      toast.success('Scholarship request rejected.');
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject scholarship');
    } finally {
      setSubmittingScholarship(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
              <p className="text-gray-500 mt-1 text-sm">Review and moderate application</p>
            </div>
            <button onClick={onClose} disabled={isProcessing} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="text-black w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              {/* Applicant info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg text-sm">
                  <InfoRow label="Name"         value={application.user.FullName} />
                  <InfoRow label="Email"        value={application.user.email} />
                  <InfoRow label="Organization" value={application.organization} />
                  <InfoRow label="Position"     value={application.position} />
                  <InfoRow label="Experience"   value={`${application.experience} years`} />
                  {application.user?.socialLinks?.LinkedIn && (
                    <div>
                      <span className="font-medium text-gray-700">LinkedIn: </span>
                      <a href={application.user.socialLinks.LinkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Application details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Application Details</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg text-sm">
                  <InfoRow label="Fellowship"   value={application.fellowship?.cycle} />
                  <InfoRow label="Workgroup"    value={application.workgroupId?.title} />
                  <InfoRow label="User Status"  value={application.userStat} />
                  <InfoRow label="Submitted"    value={new Date(application.createdAt).toLocaleString()} />
                </div>
              </div>

              {/* Payment info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Original Fee</span>
                    <span className="text-gray-900">${amount.toFixed(2)}</span>
                  </div>
                  {application.isScholarshipApplied && (
                    <div className="flex justify-between text-green-700">
                      <span className="font-medium">Scholarship</span>
                      <span>−${((amount - finalAmount)).toFixed(2)}</span>
                    </div>
                  )}
                  {application.discountCode && (
                    <div className="flex justify-between text-green-700">
                      <span className="font-medium">Discount ({application.discountCode})</span>
                      <span>−${(application.discountAmount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                    <span className="text-gray-700">Amount Due</span>
                    <span className="text-gray-900">${finalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Payment Status</span>
                    <span className={application.paymentStatus === 'COMPLETED' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                      {application.paymentStatus}
                    </span>
                  </div>
                  {application.paidAt && (
                    <InfoRow label="Paid At" value={new Date(application.paidAt).toLocaleString()} />
                  )}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Motivation */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Motivation Statement</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">{application.motivation}</p>
                </div>
              </div>

              {/* Status badge */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h4>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  isPending  ? 'bg-yellow-100 text-yellow-800' :
                  isApproved ? 'bg-blue-100 text-blue-800' :
                  isConfirmed? 'bg-green-100 text-green-800' :
                               'bg-red-100 text-red-800'
                }`}>
                  {application.status}
                </span>
              </div>

              {/* Scholarship request panel */}
              {!loadingScholarship && scholarship && scholarship.status === 'REQUESTED' && (
                <div className="border border-yellow-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowScholarshipPanel((v) => !v)}
                    className="w-full flex items-center justify-between p-4 bg-yellow-50 hover:bg-yellow-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-yellow-700" />
                      <span className="text-sm font-semibold text-yellow-800">Scholarship Request — Pending Review</span>
                    </div>
                    {showScholarshipPanel ? <ChevronUp className="w-4 h-4 text-yellow-700" /> : <ChevronDown className="w-4 h-4 text-yellow-700" />}
                  </button>

                  {showScholarshipPanel && (
                    <div className="p-5 space-y-4 border-t border-yellow-200 bg-white">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Applicant's Reason</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{scholarship.requestReason}</p>
                      </div>

                      {/* Grant type */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Scholarship Type</p>
                        <div className="flex gap-3">
                          {['full', 'partial'].map((t) => (
                            <label key={t} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-colors ${grantType === t ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                              <input type="radio" name="grantType" value={t} checked={grantType === t} onChange={() => setGrantType(t)} className="sr-only" />
                              <span className="text-sm font-medium capitalize">{t} Waiver</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Partial discount config */}
                      {grantType === 'partial' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Discount Type</label>
                            <select
                              value={discountType}
                              onChange={(e) => setDiscountType(e.target.value)}
                              className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-black"
                            >
                              <option value="percentage">Percentage (%)</option>
                              <option value="fixed">Fixed Amount ($)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {discountType === 'percentage' ? 'Percentage Off (1–100)' : 'Amount Off ($)'}
                            </label>
                            <input
                              type="number"
                              min="1"
                              max={discountType === 'percentage' ? 100 : undefined}
                              value={discountValue}
                              onChange={(e) => setDiscountValue(e.target.value)}
                              className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-black"
                              placeholder={discountType === 'percentage' ? 'e.g. 50' : 'e.g. 1000'}
                            />
                          </div>
                        </div>
                      )}

                      {/* Admin comments */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Note to applicant (optional)</label>
                        <textarea
                          rows={2}
                          value={adminComments}
                          onChange={(e) => setAdminComments(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-black resize-none"
                          placeholder="Optional message to send with your decision..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleApproveScholarship}
                          disabled={submittingScholarship}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve Scholarship
                        </button>
                        <button
                          onClick={handleRejectScholarship}
                          disabled={submittingScholarship}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Scholarship already approved/rejected badge */}
              {scholarship && scholarship.status !== 'REQUESTED' && (
                <div className={`rounded-xl p-4 flex gap-3 ${scholarship.status === 'APPROVED' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  {scholarship.status === 'APPROVED' ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                  <div>
                    <p className="text-sm font-semibold">{scholarship.status === 'APPROVED' ? 'Scholarship Approved' : 'Scholarship Rejected'}</p>
                    {scholarship.scholarshipType === 'full' && <p className="text-xs text-gray-600 mt-0.5">Full fee waiver granted</p>}
                    {scholarship.scholarshipType === 'partial' && <p className="text-xs text-gray-600 mt-0.5">Partial discount: {scholarship.discountValue}{scholarship.discountType === 'percentage' ? '%' : '$'} off</p>}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {isPending && (
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={() => { onApprove(application._id); onClose(); }}
                    disabled={isProcessing}
                    className="w-full bg-green-600 text-white py-3 px-6 hover:bg-green-700 transition-colors font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />Approving…</>
                    ) : (
                      <><CheckCircle className="w-5 h-5" />Approve Application</>
                    )}
                  </button>
                  <button
                    onClick={() => { onReject(application._id); onClose(); }}
                    disabled={isProcessing}
                    className="w-full bg-red-600 text-white py-3 px-6 hover:bg-red-700 transition-colors font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Application
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    The applicant will be emailed to complete payment once approved.
                  </p>
                </div>
              )}

              {isConfirmed && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Application Confirmed</p>
                    <p className="text-sm text-green-700 mt-1">Payment received. The applicant is enrolled.</p>
                  </div>
                </div>
              )}

              {isApproved && application.paymentStatus === 'PENDING' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Awaiting payment from applicant</p>
                    <p className="text-sm text-blue-700 mt-1">The applicant has been notified to complete payment in their dashboard.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div>
    <span className="font-medium text-gray-700">{label}: </span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default ApplicationDetailsModal;
