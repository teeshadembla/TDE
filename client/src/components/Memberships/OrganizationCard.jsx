// OrganizationCard Component - FIXED VERSION
import React from 'react';

const OrganizationCard = ({ plan, onSubscribe, isLoading }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 text-white shadow-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-4xl font-bold mb-2">
            Organization Membership
          </h2>
          {plan && (
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-5xl font-bold">${plan.monthlyPrice.toFixed(2)}</span>
              <span className="text-gray-300">/month</span>
            </div>
          )}
        </div>
        <div className="bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
          Up to 3 users
        </div>
      </div>
      
      <p className="text-gray-300 text-lg mb-6 leading-relaxed">
        Get your organization involved and help shape the future. Access all premium features for your entire team.
      </p>

      <p className="text-gray-300 text-base mb-8 leading-relaxed">
        By participating in our platform, organizations gain unique opportunities to contribute to sustainable development, address global challenges, gain access to expert knowledge and forge strategic partnerships.
      </p>

      {plan && plan.features && (
        <div className="mb-8 bg-gray-800/50 rounded-lg p-6">
          <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Everything included
          </h3>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-200 text-sm leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onSubscribe}
          disabled={isLoading || !plan}
          className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2 group ${
            isLoading || !plan ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75 " fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

        <a 
          href="mailto:sales@yourcompany.com?subject=Organization Membership Inquiry"
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Contact Sales</span>
        </a>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Dedicated support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;