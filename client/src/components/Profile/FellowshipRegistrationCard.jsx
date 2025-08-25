import React, { useState, useEffect } from 'react';
import { Calendar, Users, ExternalLink, FileText,  MessageCircle, CreditCard } from 'lucide-react';
import PaymentWrapper from "../../components/Profile/PaymentWrapper.jsx";

const FellowshipRegistrationCard = ({ registration }) => {
  const [isPaymentFormOpen , setIsPaymentFormOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const showPaymentButton = () =>{
    return registration.status === 'APPROVED' && registration.paymentStatus === 'PENDING';
  }

  const handlePaymentClick = () =>{
    return setIsPaymentFormOpen(true);
  }

  const handlePaymentSuccess = () =>{
    return setIsPaymentFormOpen(false);
  }

  const handlePaymentCancel = () => {
    setIsPaymentFormOpen(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {registration?.fellowship?.cycle}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {registration?.fellowship?.description}
          </p>
          <p className="text-gray-600 text-sm flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {registration?.workgroupId?.title}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
          {registration?.status}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          Cycle: {registration?.fellowship?.cycle} • Applied {formatDate(registration?.createdAt)}
        </div>

        {registration?.workgroup?.researchPapers && registration?.workgroup?.researchPapers.length > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="w-4 h-4 mr-2" />
            {registration?.workgroup?.researchPapers.length} Research Paper(s) Associated
          </div>
        )}
      </div>

      {/* Payment status indicator */}
      {registration?.paymentStatus && (
        <div className="flex items-center text-sm text-gray-600">
          <CreditCard className="w-4 h-4 mr-2" />
          Payment Status: <span className={`ml-1 font-medium ${
            registration.paymentStatus === 'COMPLETED' ? 'text-green-600' : 
            registration.paymentStatus === 'PENDING' ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {registration.paymentStatus}
          </span>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Workgroup Details</h4>
        <p className="text-sm text-gray-600">{registration?.workgroupId?.description}</p>
      </div>

      <div className="flex space-x-2">
      {/* Payment Button - Only show when payment is needed */}
      {showPaymentButton() && (
        <button
          onClick={handlePaymentClick}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Complete Payment
        </button>
      )}
      
      <div className="flex space-x-2">
        {registration?.workgroupId?.slackChannelUrl && registration?.paymentStatus === "COMPLETED" ? (
          <a
            href={registration?.workgroupId?.slackChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Join Slack Channel
          </a>
        ) : (
          <button className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed text-sm font-medium flex items-center justify-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            Slack Unavailable
          </button>
        )}
        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>

    {isPaymentFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <PaymentWrapper
              formData={registration}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FellowshipRegistrationCard;
