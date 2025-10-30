// PricingCard Component
const PricingCard = ({ plan, billingCycle, membershipType }) => {
  const { name, monthlyPrice, annualPrice, features, popular } = plan;
  const displayPrice = billingCycle === 'annual' ? annualPrice : monthlyPrice;
  const savings = billingCycle === 'annual' ? (monthlyPrice * 12 - annualPrice * 12).toFixed(0) : 0;

  return (
    <div className={`bg-white rounded-2xl p-8 ${popular ? 'ring-2 ring-blue-600 shadow-xl scale-105' : 'shadow-lg'} transition-all hover:shadow-2xl`}>
      {popular && (
        <div className="text-blue-600 text-sm font-semibold mb-4">MOST POPULAR</div>
      )}
      
      <h3 className="text-3xl font-bold text-gray-900 mb-6">{name}</h3>

      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-gray-900">€{displayPrice}</span>
          <span className="text-gray-600">/month</span>
        </div>
      </div>

      {billingCycle === 'annual' && (
        <p className="text-sm text-gray-600 mb-6">Save €{savings} a year</p>
      )}

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-full transition-colors mb-8 flex items-center justify-between group">
        <span>Start 7-day free trial</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4">What you'll get</h4>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 text-sm leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingCard;