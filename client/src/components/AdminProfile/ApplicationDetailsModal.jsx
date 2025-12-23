import React, { useState } from 'react';
import { 
  CheckCircle,
  XCircle,
  CreditCard,
  AlertCircle,
  DollarSign,
  Calendar
} from 'lucide-react';

const ApplicationDetailsModal = ({ 
  application, 
  isOpen, 
  onClose, 
  onApproveAndCharge, 
  onReject,
  processingId 
}) => {
  if (!isOpen || !application) return null;

  const isProcessing = processingId === application._id;
  const hasPaymentMethod = !!application.paymentMethodId;
  const isPending = application.status === 'PENDING_REVIEW';
  const isApproved = application.status === 'APPROVED';
  const amount = application.amount / 100; // Convert cents to dollars

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
              <p className="text-gray-600 mt-1">Review and moderate application</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-2xl"
              disabled={isProcessing}
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name: </span>
                    <span className="text-sm text-gray-900">{application.user.FullName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email: </span>
                    <span className="text-sm text-gray-900">{application.user.email}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Organization: </span>
                    <span className="text-sm text-gray-900">{application.organization}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Position: </span>
                    <span className="text-sm text-gray-900">{application.position}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Experience: </span>
                    <span className="text-sm text-gray-900">{application.experience} years</span>
                  </div>
                  {application.user?.socialLinks?.LinkedIn && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">LinkedIn: </span>
                      <a 
                        href={application.user.socialLinks.LinkedIn} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Application Details</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Fellowship: </span>
                    <span className="text-sm text-gray-900">{application.fellowship.cycle}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Workgroup: </span>
                    <span className="text-sm text-gray-900">{application.workgroupId.title}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">User Status: </span>
                    <span className="text-sm text-gray-900">{application.userStat}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Submitted: </span>
                    <span className="text-sm text-gray-900">{new Date(application.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Amount: </span>
                    <span className="text-sm font-semibold text-gray-900">${amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Payment Status: </span>
                    <span className={`text-sm font-medium ${
                      application.paymentStatus === 'COMPLETED' ? 'text-green-600' :
                      application.paymentStatus === 'PENDING' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {application.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Payment Method: </span>
                    {hasPaymentMethod ? (
                      <span className="text-sm text-green-600 flex items-center">
                        <CreditCard className="w-4 h-4 mr-1" />
                        Card Saved
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        No Card Saved
                      </span>
                    )}
                  </div>
                  {application.paidAt && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Paid At: </span>
                      <span className="text-sm text-gray-900">
                        {new Date(application.paidAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Motivation Statement</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">{application.motivation}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h4>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  application.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                  application.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application.status}
                </span>
              </div>

              {/* Warning if no payment method */}
              {!hasPaymentMethod && (isPending || isApproved) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">No Payment Method Saved</h4>
                      <p className="text-sm text-red-700 mt-1">
                        This application cannot be automatically charged. The applicant did not save a payment method during submission.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {isPending && (
                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={() => {
                      onApproveAndCharge(application._id);
                      onClose();
                    }}
                    disabled={isProcessing || !hasPaymentMethod}
                    className="w-full bg-green-600 text-white py-3 px-6 hover:bg-green-700 transition-colors font-medium rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Approve & Charge ${amount.toFixed(2)}
                      </>
                    )}
                  </button>
                  {!hasPaymentMethod && (
                    <p className="text-xs text-red-600 text-center">
                      Cannot approve: No payment method on file
                    </p>
                  )}
                  <button
                    onClick={() => {
                      onReject(application._id);
                      onClose();
                    }}
                    disabled={isProcessing}
                    className="w-full bg-red-600 text-white py-3 px-6 hover:bg-red-700 transition-colors font-medium rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Application
                  </button>
                </div>
              )}

              {/* Retry charge button for approved but unpaid */}
              {isApproved && application.paymentStatus === 'PENDING' && hasPaymentMethod && (
                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={() => {
                      onApproveAndCharge(application._id);
                      onClose();
                    }}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 px-6 hover:bg-blue-700 transition-colors font-medium rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5 mr-2" />
                        Retry Charge ${amount.toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Success message for confirmed */}
              {application.status === 'CONFIRMED' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Application Confirmed</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Payment has been successfully processed. The applicant has been enrolled in the fellowship.
                      </p>
                    </div>
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

export default ApplicationDetailsModal;