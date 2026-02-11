// PricingCard Component - FIXED VERSION
import React from 'react';

const PricingCard = ({ plan, billingCycle, membershipType, onSubscribe, isLoading }) => {
  const { name, monthlyPrice, features, popular } = plan;
  const displayPrice = billingCycle === 'annual' ? annualPrice : monthlyPrice;
  const savings = billingCycle === 'annual' ? (monthlyPrice * 12 - annualPrice * 12).toFixed(0) : 0;

  return (
    <div className={`bg-white rounded-2xl p-8 ${popular ? 'ring-2 ring-blue-600 shadow-xl scale-105' : 'shadow-lg'} transition-all hover:shadow-2xl relative`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            MOST POPULAR
          </span>
        </div>
      )}
      
      <h3 className="text-3xl font-bold text-gray-900 mb-6">{name}</h3>

      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-gray-900">${displayPrice.toFixed(2)}</span>
          <span className="text-gray-600">/month</span>
        </div>
      </div>

      {billingCycle === 'annual' && (
        <p className="text-sm text-green-600 font-medium mb-6">
          💰 Save ${savings} per year
        </p>
      )}

      <button
        onClick={onSubscribe}
        disabled={isLoading}
        className={`w-full font-semibold py-4 px-6 rounded-full transition-all mb-8 flex items-center justify-center gap-2 group ${
          popular 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-900 hover:bg-gray-800 text-white'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Get Started</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

      <div>
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What's included
        </h4>
        <ul className="space-y-3">
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

      {/* Additional info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Cancel anytime • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default PricingCard;