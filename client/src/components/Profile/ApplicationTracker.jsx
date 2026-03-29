import { useState, useContext, useEffect } from 'react';
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressTracker from './ProgressTracker';
import FellowshipPaymentModal from '../ExecutiveFellowships/FellowshipPaymentModal';
import axiosInstance from '../../config/apiConfig';
import DataProvider from '../../context/DataProvider';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [paymentModalApp, setPaymentModalApp] = useState(null);
  const [pendingOnboarding, setPendingOnboarding] = useState(false);
  const { account } = useContext(DataProvider.DataContext);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/fellowship-registration/getFellowshipRegistrations/${account._id}`
      );
      setApplications([...response.data.current, ...response.data.past]);
    } catch (err) {
      console.error('Error fetching fellowship registrations', err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [account._id]);

  useEffect(() => {
    axiosInstance.get('/api/fellow-profile/getFellowProfile')
      .then((res) => setPendingOnboarding(res.data))
      .catch(() => {});
  }, []);

  const getApplicationStage = (app) => {
    if (app?.status === 'REJECTED') return 1;
    if (app?.onboardingStatus === 'APPROVED') return 4;
    if (app?.paymentStatus === 'COMPLETED') return 3;
    if (app?.status === 'APPROVED' || app?.status === 'CONFIRMED') return 2;
    return 1;
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING_REVIEW: { text: 'Under Review', icon: Clock, bgColor: 'bg-[#393939]', textColor: 'text-[#aae7ff]', iconColor: 'text-[#aae7ff]' },
      APPROVED:       { text: 'Approved — Payment Required', icon: CheckCircle, bgColor: 'bg-[#062c65]', textColor: 'text-[#aae7ff]', iconColor: 'text-[#aae7ff]' },
      CONFIRMED:      { text: 'Confirmed', icon: CheckCircle, bgColor: 'bg-[#062c65]', textColor: 'text-[#004aad]', iconColor: 'text-[#004aad]' },
      REJECTED:       { text: 'Not Selected', icon: XCircle, bgColor: 'bg-[#171717]', textColor: 'text-[#f6f5f5]', iconColor: 'text-[#888888]' },
    };
    return configs[status] || configs.PENDING_REVIEW;
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getOnboardingStatusText = (status) => {
    if (!pendingOnboarding) return '✓ Profile Approved';
    const map = { APPROVED: '✓ Profile Approved', SUBMITTED: 'Under Review', IN_PROGRESS: 'Draft Saved', PENDING: 'Not Started', REVISION_NEEDED: 'Changes Requested' };
    return map[status] || 'Not Started';
  };

  return (
    <div className="min-h-screen bg-[#000000] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Applications</h1>
          <p className="text-[#f9f9f9] text-lg">Track your fellowship applications and manage payments</p>
        </div>

        {/* Onboarding alert */}
        {pendingOnboarding?.isProfile && pendingOnboarding?.profile?.status !== 'APPROVED' && (
          <div className="mb-8 bg-gradient-to-r from-[#004aad] via-[#062c65] to-[#004aad] p-6 sm:p-8 rounded-xl border-2 border-[#aae7ff] shadow-2xl">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-8 h-8 text-[#aae7ff] flex-shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Action Required: Complete Your Fellow Profile</h2>
                </div>
                <p className="text-[#aae7ff] text-base sm:text-lg mb-4">
                  Create your public Fellow profile to be showcased to our community and unlock full fellowship benefits.
                </p>
              </div>
              <button
                onClick={() => navigate(`/onboarding/${account._id}`)}
                className="bg-white text-[#004aad] px-6 sm:px-8 py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-[#aae7ff] transition-colors shadow-xl flex items-center gap-2 whitespace-nowrap"
              >
                <Users className="w-6 h-6" />
                {pendingOnboarding.isProfile ? 'Continue Setup' : 'Start Now'}
              </button>
            </div>
          </div>
        )}

        {/* Applications grid */}
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
              const needsPayment =
                app?.status === 'APPROVED' && app?.paymentStatus !== 'COMPLETED';

              return (
                <div
                  key={app?._id}
                  className="bg-[#161616] border border-[#888888] rounded-lg overflow-hidden hover:border-[#004aad] transition-all duration-300 hover:shadow-lg hover:shadow-[#004aad]/10 flex flex-col"
                >
                  {/* Card header */}
                  <div className="bg-gradient-to-br from-[#004aad] to-[#062c65] p-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {app?.fellowship?.cycle
                        ? app.fellowship.cycle.charAt(0).toUpperCase() + app.fellowship.cycle.slice(1)
                        : ''} Cohort
                    </h3>
                    <p className="text-[#aae7ff] text-sm">Applied {formatDate(app?.appliedAt)}</p>
                  </div>

                  <ProgressTracker currentStage={getApplicationStage(app)} status={app.status} />

                  {/* Card body */}
                  <div className="p-6 space-y-4 flex-1">
                    <div>
                      <label className="text-[#cccbcb] text-sm font-medium block mb-1">Workgroup</label>
                      <p className="text-white font-medium">{app?.workgroupId?.title}</p>
                    </div>
                    <div>
                      <label className="text-[#cccbcb] text-sm font-medium block mb-1">Fellowship Level</label>
                      <span className="inline-block bg-[#474646] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {app?.userStat}
                      </span>
                    </div>
                    <div>
                      <label className="text-[#cccbcb] text-sm font-medium block mb-2">Status</label>
                      <div className={`${statusConfig.bgColor} ${statusConfig.textColor} px-4 py-3 rounded-lg flex items-center gap-3`}>
                        <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor} flex-shrink-0`} />
                        <span className="font-semibold text-sm">{statusConfig.text}</span>
                      </div>
                    </div>

                    {(app?.status === 'APPROVED' || app?.status === 'CONFIRMED') && (
                      <div>
                        <label className="text-[#cccbcb] text-sm font-medium block mb-2">Payment</label>
                        <div className={`px-4 py-3 rounded-lg ${app?.paymentStatus === 'COMPLETED' ? 'bg-[#062c65] text-[#004aad]' : 'bg-[#474646] text-[#f9f9f9]'}`}>
                          <span className="font-medium text-sm">
                            {app?.paymentStatus === 'COMPLETED' ? '✓ Paid' : 'Pending'} — ${(app?.amount / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    {app?.paymentStatus === 'COMPLETED' && (
                      <div>
                        <label className="text-[#cccbcb] text-sm font-medium block mb-2">Onboarding</label>
                        <div className={`px-4 py-3 rounded-lg ${app?.onboardingStatus === 'APPROVED' ? 'bg-[#062c65] text-[#004aad]' : app?.onboardingStatus === 'SUBMITTED' ? 'bg-[#393939] text-[#aae7ff]' : 'bg-[#474646] text-[#f9f9f9]'}`}>
                          <span className="font-medium text-sm">{getOnboardingStatusText(app?.onboardingStatus)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="px-6 pb-6 space-y-3">
                    {needsPayment && (
                      <button
                        onClick={() => setPaymentModalApp(app)}
                        className="w-full bg-[#004aad] hover:bg-[#062c65] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
                      >
                        <CreditCard className="w-5 h-5" />
                        Complete Payment — ${(app?.amount / 100).toFixed(2)}
                      </button>
                    )}

                    {!pendingOnboarding?.isProfile && app?.paymentStatus === 'COMPLETED' && (
                      <button
                        onClick={() => navigate(`/onboarding/${account?._id}`)}
                        className="w-full bg-gradient-to-r from-[#004aad] to-[#062c65] hover:from-[#062c65] hover:to-[#004aad] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg border-2 border-[#aae7ff]"
                      >
                        <Users className="w-5 h-5" />
                        {app?.onboardingStatus === 'IN_PROGRESS' ? 'Continue Profile Setup' : 'Complete Your Fellow Profile'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment modal */}
      <FellowshipPaymentModal
        isOpen={!!paymentModalApp}
        application={paymentModalApp}
        onClose={() => setPaymentModalApp(null)}
        onSuccess={() => {
          setPaymentModalApp(null);
          fetchApplications();
        }}
      />
    </div>
  );
};

export default ApplicationTracker;
