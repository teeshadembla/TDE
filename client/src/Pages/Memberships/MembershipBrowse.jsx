import React, { useState } from 'react';
import OrganizationCard from '../../components/Memberships/OrganizationCard';
import MembershipTypeToggle from '../../components/Memberships/MembershipTypeToggle';
import PricingToggle from '../../components/Memberships/PriceToggle';
import PricingCard from '../../components/Memberships/PricingCard';


const MembershipBrowse = () => {
  const [membershipType, setMembershipType] = useState('individual');
  const [billingCycle, setBillingCycle] = useState('annual');

  const individualPlans = [
    {
      name: 'Premium',
      monthlyPrice: 30,
      annualPrice: 25.50,
      popular: false,
      features: [
        'Join exclusive World Economic Forum and partner virtual events and sessions',
        'Access a library of exclusive session recordings and expert briefings, available for on-demand viewing',
        'Generate instant PDF briefings of 300+ topics on the Strategic Intelligence platform',
        'Create a customized intelligence map for personalized insights',
        'Leverage the AI-based map assistant to automatically build your map'
      ]
    },
    {
      name: 'Pro',
      monthlyPrice: 90,
      annualPrice: 76.50,
      popular: true,
      features: [
        'Everything in Premium, plus...',
        'Access enhanced PDF briefings with AI-generated trends and scenarios for comprehensive insights on 300+ topics',
        'Create unlimited customized intelligence maps',
        'Share your customized maps with colleagues and peers',
        'Network with fellow Pro members using the messaging feature',
        'Attend expert-led masterclasses and receive a certificate upon completion'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Overview</span>
          </button>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Join our community and get ready for the future
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl">
            Access exclusive content, connect with global leaders, and stay ahead of emerging trends
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <MembershipTypeToggle 
          activeType={membershipType}
          onTypeChange={setMembershipType}
        />

        {membershipType === 'individual' ? (
          <>
            <PricingToggle 
              billingCycle={billingCycle}
              onBillingChange={setBillingCycle}
            />

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {individualPlans.map((plan, index) => (
                <PricingCard 
                  key={index}
                  plan={plan}
                  billingCycle={billingCycle}
                  membershipType={membershipType}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <OrganizationCard />
          </div>
        )}

        {/* Additional Info Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why join our community?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-2">Global Network</h3>
              <p className="text-gray-600">Connect with leaders across industries and continents</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-2">Expert Insights</h3>
              <p className="text-gray-600">Access cutting-edge research and analysis</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-2">Shape the Future</h3>
              <p className="text-gray-600">Participate in initiatives that drive global change</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch between plans?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                q: "What happens after the free trial?",
                a: "After your 7-day trial, you'll be automatically enrolled in your chosen plan. You can cancel anytime during the trial."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee if you're not satisfied with your membership."
              }
            ].map((faq, index) => (
              <details key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                  {faq.q}
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipBrowse;