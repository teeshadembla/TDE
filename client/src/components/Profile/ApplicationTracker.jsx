import React, { useState, useContext, useEffect } from 'react';
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fellowshipRegistrations } from '../../assets/Data';
import ProgressTracker from './ProgressTracker';
import PaymentWrapper from '../../components/Profile/PaymentWrapper.jsx';
import axiosInstance from '../../config/apiConfig';
import DataProvider from '../../context/DataProvider';


const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [recentApplication, setRecentApplication] = useState(null);
  const [pendingOnboarding, setPendingOnboarding] = useState(false);
  const { account } = useContext(DataProvider.DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFellowshipRegistrationsByUser = async() => {
      try {
        const response = await axiosInstance.get(
          `/api/fellowship-registration/getFellowshipRegistrations/${account._id}`
        );
        console.log("These are all the fellowship registrations--->", response);
        setApplications([...response.data.current, ...response.data.past]);
        setRecentApplication(response.data.current[0]);
      } catch(err) {
        console.log("This error occurred in the frontend in application tracker, while trying to fetch user's fellowship registrations--->", err);
      }
    }

    fetchFellowshipRegistrationsByUser();
  }, [account._id]);

  // Check if application needs onboarding
  const needsOnboarding = (app) => {
    return app?.paymentStatus === 'COMPLETED' && 
           (app?.onboardingStatus === 'PENDING' || app?.onboardingStatus === 'IN_PROGRESS');
  };

  const checkPendingOnboarding = async() => {
    try{
      const response = await axiosInstance.get("/api/fellow-profile/getFellowProfile");
      console.log("this is the response while trying to check if user already has a profile---->", response);

      if(response) setPendingOnboarding(response.data);
      console.log("Pending Onboarding has been updated");

    }catch(err){
      console.log("This error occurred while trying to check if user has a pulic fellow profile already.");
    }
  }

  useEffect(()=>{
    checkPendingOnboarding();
  },[])

  // Get application stage for progress tracker
  const getApplicationStage = (app) => {
    if (app?.status === 'REJECTED') return 1;
    if (app?.onboardingStatus === 'APPROVED') return 4; // Onboarding complete
    if (app?.paymentStatus === 'COMPLETED') return 3; // Payment done, needs onboarding
    if (app?.status === 'APPROVED' || app?.status === 'CONFIRMED') return 2; // Approved, needs payment
    return 1; 
  };

  const getStatusConfig = (status) => {
    const configs = {
      'PENDING_REVIEW': {
        text: 'Under Review',
        icon: Clock,
        bgColor: 'bg-[#393939]',
        textColor: 'text-[#aae7ff]',
        iconColor: 'text-[#aae7ff]'
      },
      'APPROVED': {
        text: 'Approved',
        icon: CheckCircle,
        bgColor: 'bg-[#062c65]',
        textColor: 'text-[#004aad]',
        iconColor: 'text-[#004aad]'
      },
      'CONFIRMED': {
        text: 'Confirmed',
        icon: CheckCircle,
        bgColor: 'bg-[#062c65]',
        textColor: 'text-[#004aad]',
        iconColor: 'text-[#004aad]'
      },
      'REJECTED': {
        text: 'Not Selected',
        icon: XCircle,
        bgColor: 'bg-[#171717]',
        textColor: 'text-[#f6f5f5]',
        iconColor: 'text-[#888888]'
      }
    };
    return configs[status] || configs['PENDING_REVIEW'];
  };

  const handlePaymentSuccess = () =>{
    return setIsPaymentFormOpen(false);
  }

  const handlePaymentCancel = () => {
    setIsPaymentFormOpen(false);
  };

  const handlePayment = (applicationId, amount) => {
    console.log(`Processing payment for application ${applicationId}: $${amount}`);
    // Implement payment logic here
    setIsPaymentFormOpen(true);
  };

  const handleStartOnboarding = async (userId) => {
    try {
      // Navigating to onboarding page
      navigate(`/onboarding/${userId}`);
    } catch (error) {
      console.error('Error starting onboarding:', error);
      alert('Failed to start onboarding. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOnboardingStatusText = (status) => {
    if(!pendingOnboarding) {
      return '✓ Profile Approved';
    }
    const statusMap = {
      'APPROVED': '✓ Profile Approved',
      'SUBMITTED': 'Under Review',
      'IN_PROGRESS': 'Draft Saved',
      'PENDING': 'Not Started',
      'REVISION_NEEDED': 'Changes Requested'
    };
    return statusMap[status] || 'Not Started';
  };

  return (
    <div className="min-h-screen bg-[#000000] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#ffffff] mb-2">
            My Applications
          </h1>
          <p className="text-[#f9f9f9] text-lg">
            Track your fellowship applications and manage payments
          </p>
        </div>

        {/* Onboarding Alert Banner */}
        {pendingOnboarding.isProfile && (pendingOnboarding.profile.status !== "APPROVED") && (
          <div className="mb-8 bg-gradient-to-r from-[#004aad] via-[#062c65] to-[#004aad] p-8 rounded-xl border-2 border-[#aae7ff] shadow-2xl">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-8 h-8 text-[#aae7ff] flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-[#ffffff]">
                    Action Required: Complete Your Fellow Profile
                  </h2>
                </div>
                <p className="text-[#aae7ff] text-lg mb-4">
                  You're almost done! Create your public Fellow profile to be showcased 
                  to our community and unlock full fellowship benefits.
                </p>
                <div className="flex items-center gap-2 text-[#ffffff] text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Takes only 10 minutes</span>
                </div>
              </div>
              <button
                onClick={() => handleStartOnboarding(account._id)}
                className="bg-[#ffffff] text-[#004aad] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#aae7ff] transition-colors shadow-xl flex items-center gap-2 whitespace-nowrap"
              >
                <Users className="w-6 h-6" />
                {pendingOnboarding.isProfile 
                  ? 'Continue Setup' 
                  : 'Start Now'}
              </button>
            </div>
          </div>
        )}

       
        {/* Applications Grid */}
        {applications.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-[#474646] mx-auto mb-4" />
            <p className="text-[#f6f5f5] text-xl">No applications yet</p>
            <p className="text-[#888888] mt-2">Start your fellowship journey today</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => {
              const statusConfig = getStatusConfig(app?.status);
              const StatusIcon = statusConfig.icon;
              const showPaymentButton = 
                (app?.status === 'APPROVED' || app?.status === 'CONFIRMED') && 
                app?.paymentStatus === 'PENDING';

              return (
                <div
                  key={app?._id}
                  className="bg-[#161616] border border-[#888888] rounded-lg overflow-hidden hover:border-[#004aad] transition-all duration-300 hover:shadow-lg hover:shadow-[#004aad]/10"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-br from-[#004aad] to-[#062c65] p-6">
                    <h3 className="text-xl font-bold text-[#ffffff] mb-1">
                      {app?.fellowship?.cycle
                        ? app.fellowship.cycle.charAt(0).toUpperCase() + app.fellowship.cycle.slice(1)
                        : ""} Cohort
                    </h3>
                    <p className="text-[#aae7ff] text-sm">
                      Applied {formatDate(app?.appliedAt)}
                    </p>
                  </div>

                  
                  <ProgressTracker
                    currentStage={getApplicationStage(app)} 
                    status={app.status}
                  />
                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Workgroup */}
                    <div>
                      <label className="text-[#cccbcb] text-sm font-medium block mb-1">
                        Workgroup
                      </label>
                      <p className="text-[#ffffff] font-medium">
                        {app?.workgroupId?.title}
                      </p>
                    </div>

                    {/* Fellowship Level */}
                    <div>
                      <label className="text-[#cccbcb] text-sm font-medium block mb-1">
                        Fellowship Level
                      </label>
                      <span className="inline-block bg-[#474646] text-[#ffffff] px-3 py-1 rounded-full text-sm font-medium">
                        {app?.userStat}
                      </span>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="text-[#cccbcb] text-sm font-medium block mb-2">
                        Status
                      </label>
                      <div className={`${statusConfig.bgColor} ${statusConfig.textColor} px-4 py-3 rounded-lg flex items-center gap-3`}>
                        <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                        <span className="font-semibold">{statusConfig.text}</span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    {(app?.status === 'APPROVED' || app?.status === 'CONFIRMED') && (
                      <div>
                        <label className="text-[#cccbcb] text-sm font-medium block mb-2">
                          Payment
                        </label>
                        <div className={`px-4 py-3 rounded-lg ${
                          app?.paymentStatus === 'COMPLETED' 
                            ? 'bg-[#062c65] text-[#004aad]' 
                            : 'bg-[#474646] text-[#f9f9f9]'
                        }`}>
                          <span className="font-medium">
                            {app?.paymentStatus === 'COMPLETED' ? 'Paid' : 'Pending'} - ${app?.amount/100}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Onboarding Status */}
                    {app?.paymentStatus === 'COMPLETED' && (
                      <div>
                        <label className="text-[#cccbcb] text-sm font-medium block mb-2">
                          Onboarding
                        </label>
                        <div className={`px-4 py-3 rounded-lg ${
                          app?.onboardingStatus === 'APPROVED' 
                            ? 'bg-[#062c65] text-[#004aad]' 
                            : app?.onboardingStatus === 'SUBMITTED'
                            ? 'bg-[#393939] text-[#aae7ff]'
                            : 'bg-[#474646] text-[#f9f9f9]'
                        }`}>
                          <span className="font-medium">
                            {getOnboardingStatusText(app?.onboardingStatus)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer - Action Buttons */}
                  <div className="px-6 pb-6 space-y-3">
                    {/* Payment Button */}
                    {showPaymentButton && (
                      <button
                        onClick={() => handlePayment()}
                        className="w-full bg-[#004aad] hover:bg-[#062c65] text-[#ffffff] font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <CreditCard className="w-5 h-5" />
                        Make Payment - ${app?.amount/100}
                      </button>
                    )}

                    {/* Onboarding Button */}
                    {!pendingOnboarding.isProfile && (
                      <button
                        onClick={() => handleStartOnboarding(account?._id)}
                        className="w-full bg-gradient-to-r from-[#004aad] to-[#062c65] hover:from-[#062c65] hover:to-[#004aad] text-[#ffffff] font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl border-2 border-[#aae7ff]"
                      >
                        <Users className="w-5 h-5" />
                        {!pendingOnboarding ? "Profile Set Up Complete" 
                        : app?.onboardingStatus === 'IN_PROGRESS' 
                          ? 'Continue Profile Setup' 
                          : 'Complete Your Fellow Profile'}
                      </button>
                    )}

                    {isPaymentFormOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                          <PaymentWrapper
                            formData={app}
                            onPaymentSuccess={handlePaymentSuccess}
                            onCancel={handlePaymentCancel}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;