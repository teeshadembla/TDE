// PricingToggle Component
const PricingToggle = ({ billingCycle, onBillingChange }) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
        Monthly
      </span>
      <button
        onClick={() => onBillingChange(billingCycle === 'monthly' ? 'annual' : 'monthly')}
        className="relative w-14 h-7 bg-blue-600 rounded-full transition-colors"
      >
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
          billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'
        }`} />
      </button>
      <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
        Annual
      </span>
      {billingCycle === 'annual' && (
        <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
          SAVE 15%
        </span>
      )}
    </div>
  );
};

export default PricingToggle;