import React from 'react';
import { AlertCircle, Clock, CheckCircle, AlertTriangle, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * OnboardingStatusBanner Component
 * Displays different states based on fellow profile status:
 * - NO_PROFILE: Not started
 * - DRAFT: Saved draft, ready to submit
 * - SUBMITTED: Under review
 * - REVISION_NEEDED: Needs changes
 * - APPROVED: Successfully approved
 */
const OnboardingStatusBanner = ({ registration, fellowProfile }) => {
  const navigate = useNavigate();

  if (!registration) return null;

  // Determine the current onboarding state
  let state = 'NO_PROFILE';
  
  if (fellowProfile) {
    state = fellowProfile.status; // 'DRAFT', 'SUBMITTED', 'REVISION_NEEDED', 'APPROVED'
  }

  // Don't show banner if profile is already approved
  if (state === 'APPROVED') return null;

  const handleStartOnboarding = () => {
    navigate(`/onboarding/${registration._id}`);
  };

  // State-specific configurations
  const stateConfig = {
    NO_PROFILE: {
      icon: AlertCircle,
      bgGradient: 'from-blue-600 via-blue-700 to-blue-800',
      borderColor: 'border-blue-400',
      accentColor: 'text-blue-300',
      title: 'Action Required: Complete Your Fellow Profile',
      description: 'You\'re almost done! Create your public Fellow profile to be showcased to our community and unlock full fellowship benefits.',
      buttonText: 'Start Now',
      buttonBg: 'bg-white text-blue-600 hover:bg-blue-50',
      timeHint: '⏱️ Takes only 10 minutes'
    },
    DRAFT: {
      icon: Edit3,
      bgGradient: 'from-amber-600 via-amber-700 to-amber-800',
      borderColor: 'border-amber-400',
      accentColor: 'text-amber-300',
      title: 'Draft Saved: Ready to Submit',
      description: 'Your profile draft has been saved. Review your information and submit it for our review team to approve.',
      buttonText: 'Submit for Review',
      buttonBg: 'bg-white text-amber-600 hover:bg-amber-50',
      timeHint: '📝 Continue editing your profile'
    },
    SUBMITTED: {
      icon: Clock,
      bgGradient: 'from-purple-600 via-purple-700 to-purple-800',
      borderColor: 'border-purple-400',
      accentColor: 'text-purple-300',
      title: 'Profile Under Review',
      description: 'Your profile is currently being reviewed by our team. We\'ll notify you once the review is complete.',
      buttonText: null,
      buttonBg: null,
      timeHint: '⏳ Review typically takes 2-3 business days'
    },
    REVISION_NEEDED: {
      icon: AlertTriangle,
      bgGradient: 'from-orange-600 via-orange-700 to-orange-800',
      borderColor: 'border-orange-400',
      accentColor: 'text-orange-300',
      title: 'Revision Needed',
      description: 'Our team has provided feedback on your profile. Please review the comments and make the necessary changes.',
      buttonText: 'Review & Revise',
      buttonBg: 'bg-white text-orange-600 hover:bg-orange-50',
      timeHint: '✏️ Check the comments in your profile'
    }
  };

  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <div className={`mb-8 bg-gradient-to-r ${config.bgGradient} p-6 sm:p-8 rounded-xl border-2 ${config.borderColor} shadow-2xl`}>
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Icon className={`w-8 h-8 ${config.accentColor} flex-shrink-0`} />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {config.title}
            </h2>
          </div>
          <p className={`${config.accentColor} text-sm sm:text-base mb-4 leading-relaxed`}>
            {config.description}
          </p>
          <div className={`flex items-center gap-2 text-white text-xs sm:text-sm font-medium`}>
            {config.timeHint}
          </div>
        </div>

        {/* Button */}
        {config.buttonText && (
          <button
            onClick={handleStartOnboarding}
            className={`${config.buttonBg} px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-colors shadow-xl flex items-center gap-2 whitespace-nowrap flex-shrink-0`}
          >
            {state === 'NO_PROFILE' ? (
              <>
                <AlertCircle className="w-5 h-5" />
                {config.buttonText}
              </>
            ) : state === 'DRAFT' ? (
              <>
                <Edit3 className="w-5 h-5" />
                {config.buttonText}
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                {config.buttonText}
              </>
            )}
          </button>
        )}
      </div>

      {/* Admin Comments Section - Show only for REVISION_NEEDED */}
      {state === 'REVISION_NEEDED' && fellowProfile?.adminComments && fellowProfile.adminComments.length > 0 && (
        <div className="mt-6 pt-6 border-t border-orange-400/30">
          <h4 className={`${config.accentColor} text-sm font-semibold mb-3`}>
            Admin Feedback:
          </h4>
          <div className="space-y-2">
            {fellowProfile.adminComments.map((comment, idx) => (
              <div key={idx} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-white text-sm">{comment.comment}</p>
                <p className={`${config.accentColor} text-xs mt-1`}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingStatusBanner;
