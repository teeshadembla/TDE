import { useState } from 'react';
import {
  Search, Download, Eye, CheckCircle, XCircle,
  AlertCircle, CreditCard, Clock
} from 'lucide-react';
import ApplicationDetailsModal from './ApplicationDetailsModal.jsx';
import axiosInstance from '../../config/apiConfig.js';
import { toast } from 'react-toastify';

const ApplicationsModeration = ({ applications, onRefresh }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal]       = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [processingId, setProcessingId] = useState(null);

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app?.user?.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  /* ── Approve (user is notified to pay via email) ── */
  const handleApprove = async (applicationId) => {
    if (!window.confirm('Approve this application? The applicant will be emailed to complete payment.')) return;
    setProcessingId(applicationId);
    try {
      await axiosInstance.patch(`/api/fellowship/registration/approve/${applicationId}`);
      toast.success('Application approved — applicant notified to complete payment.');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve application');
    } finally {
      setProcessingId(null);
    }
  };

  /* ── Reject ── */
  const handleReject = async (applicationId) => {
    if (!window.confirm('Are you sure you want to reject this application?')) return;
    setProcessingId(applicationId);
    try {
      await axiosInstance.patch(`/api/fellowship/registration/reject/${applicationId}`);
      toast.success('Application rejected.');
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject application');
    } finally {
      setProcessingId(null);
    }
  };

  const statusBadge = (status) => {
    const map = {
      PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
      APPROVED:       'bg-blue-100 text-blue-800',
      CONFIRMED:      'bg-green-100 text-green-800',
      REJECTED:       'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
  };

  const paymentBadge = (status) => {
    const map = {
      PENDING:   'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED:    'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Search & filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full relative">
            <Search className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Fellowship Applications</h2>
          <span className="text-sm text-gray-500">{filtered.length} applications</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Applicant', 'Fellowship', 'Status', 'Submitted', 'Payment', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  {/* Applicant */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700">
                          {app.user.FullName[0]}{app.user.FullName.split(' ')[1]?.[0] || ''}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{app.user.FullName}</div>
                        <div className="text-gray-500 text-xs">{app.user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Fellowship */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{app.fellowship?.cycle || '—'}</div>
                    <div className="text-gray-500 text-xs">{app.workgroupId?.title}</div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>

                  {/* Submitted */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentBadge(app.paymentStatus)}`}>
                      {app.paymentStatus}
                    </span>
                    {app.isScholarshipApplied && (
                      <span className="ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                        Scholarship
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setSelectedApplication(app); setShowModal(true); }}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {app.status === 'PENDING_REVIEW' && (
                        <>
                          <button
                            onClick={() => handleApprove(app._id)}
                            disabled={processingId === app._id}
                            className="text-green-600 hover:text-green-900 p-1 disabled:opacity-40"
                            title="Approve (notifies applicant to pay)"
                          >
                            {processingId === app._id
                              ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
                              : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleReject(app._id)}
                            disabled={processingId === app._id}
                            className="text-red-500 hover:text-red-800 p-1 disabled:opacity-40"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {app.status === 'APPROVED' && app.paymentStatus === 'PENDING' && (
                        <span className="flex items-center text-yellow-600 text-xs gap-1">
                          <Clock className="w-3 h-3" />
                          Awaiting payment
                        </span>
                      )}

                      {app.status === 'CONFIRMED' && (
                        <span className="flex items-center text-green-600 text-xs gap-1">
                          <CreditCard className="w-3 h-3" />
                          Paid
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedApplication(null); }}
        onApprove={handleApprove}
        onReject={handleReject}
        processingId={processingId}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default ApplicationsModeration;
