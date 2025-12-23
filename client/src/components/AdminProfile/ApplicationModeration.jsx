import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Award, 
  Users, 
  FileText, 
  Plus,
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Settings,
  History,
  Target,
  CreditCard // NEW ICON
} from 'lucide-react';
import ApplicationsDetailsModal from "../../components/AdminProfile/ApplicationDetailsModal.jsx";
import axiosInstance from "../../config/apiConfig.js"; // ADD THIS
import { toast } from "react-toastify"; // ADD THIS

const ApplicationsModeration = ({ applications, onStatusChange, onRefresh }) => { // ADD onRefresh prop
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [processingId, setProcessingId] = useState(null); // NEW STATE

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.user.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  // NEW FUNCTION: Approve and automatically charge
  const handleApproveAndCharge = async (applicationId) => {
    if (!window.confirm('This will approve the application and automatically charge the saved payment method. Continue?')) {
      return;
    }

    setProcessingId(applicationId);

    try {
      // First, approve the application
      await axiosInstance.patch(`/api/fellowship/registration/approve/${applicationId}`);

      // Then, automatically charge the payment
      const { data } = await axiosInstance.post('/api/fellowship/registration/charge-approved-application', {
        applicationId
      });

      if (data.success) {
        toast.success("Application approved and payment charged successfully!");
        if (onRefresh) {
          onRefresh(); // Refresh the applications list
        }
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = error.response?.data?.message || "Failed to process application";
      toast.error(errorMsg);
      
      // Handle specific error cases
      if (error.response?.data?.requiresAction) {
        toast.warning("Payment requires additional authentication from user");
      }
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes("No payment method")) {
        toast.error("No payment method saved for this application");
      }
    } finally {
      setProcessingId(null);
    }
  };

  // NEW FUNCTION: Reject application
  const handleReject = async (applicationId) => {
    if (!window.confirm('Are you sure you want to reject this application?')) {
      return;
    }

    setProcessingId(applicationId);

    try {
      await axiosInstance.patch(`/api/fellowship/registration/reject/${applicationId}`);
      toast.success("Application rejected");
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to reject application");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 w-full relative">
            <Search className="text-black absolute left-3 top-1/2 transform -translate-y-1/2  w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full text-black sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Fellowship Applications</h2>
            <span className="text-sm text-gray-500">
              {filteredApplications.length} applications
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fellowship
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {application.user.FullName[0] + (application.user.FullName.split(' ')[1]?.[0] || '')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{application.user.FullName}</div>
                        <div className="text-sm text-gray-500">{application.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application?.fellowship?.cycle || ""}</div>
                    <div className="text-sm text-gray-500">{application?.workgroupId?.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      application.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      application.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      application.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.paymentMethodId ? (
                      <div className="flex items-center text-green-600 text-xs">
                        <CreditCard className="w-4 h-4 mr-1" />
                        Saved
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600 text-xs">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        None
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {application.status === 'PENDING_REVIEW' && (
                        <>
                          <button
                            onClick={() => handleApproveAndCharge(application._id)}
                            disabled={processingId === application._id || !application.paymentMethodId}
                            className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={!application.paymentMethodId ? "No payment method saved" : "Approve & Charge"}
                          >
                            {processingId === application._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(application._id)}
                            disabled={processingId === application._id}
                            className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {application.status === 'APPROVED' && application.paymentStatus === 'PENDING' && (
                        <button
                          onClick={() => handleApproveAndCharge(application._id)}
                          disabled={processingId === application._id}
                          className="text-blue-600 hover:text-blue-900 p-1 text-xs disabled:opacity-50"
                          title="Charge Payment"
                        >
                          {processingId === application._id ? 'Charging...' : 'Charge'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ApplicationsDetailsModal
        application={selectedApplication}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedApplication(null);
        }}
        onStatusChange={onStatusChange}
        onApproveAndCharge={handleApproveAndCharge} // NEW PROP
        onReject={handleReject} // NEW PROP
        processingId={processingId} // NEW PROP
      />
    </div>
  );
};

export default ApplicationsModeration;