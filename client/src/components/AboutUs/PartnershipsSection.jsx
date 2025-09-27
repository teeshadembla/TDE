import React from 'react';

const PartnershipsSection = () => {
  return (
    <div className="h-screen w-auto bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Our Partnerships
          </h1>
        </div>

        {/* Partnership Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* MIT Card */}
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-3">
                {/* MIT Logo */}
                <img className='h-8 w-auto' src='https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686ef3469ad154b5e42030bc_MIT_logo.svg'></img>
                <span className="bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide">
                  ARTIFICIAL INTELLIGENCE
                </span>
              </div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              MIT
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
              The Digital Economist is engaged with MIT Connection Science on the applications of Machine Learning for efficiency gains in governance and fraud detection.
            </p>
          </div>

          {/* World Bank Card */}
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-3">
                {/* World Bank Logo */}
                <img className='h-10 w-auto' src='https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686ef3354f712d189f8bbb2b_world-bank-seeklogo.svg'></img>
                <span className="bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide">
                  GOVTECH
                </span>
              </div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              The World Bank
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
              The Digital Economist is a "Global Partner" of the World Bank, focused on mainstreaming gender in public goods delivery and accurately measuring govtech indicators.
            </p>
          </div>

          {/* IBM Card */}
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-3">
                {/* IBM Logo */}
                <img className='h-15 w-auto' src='https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686ef33f4f712d189f8bbe4e_01_8-bar-positive.svg'></img>
                <span className="bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide">
                  RENEWABLE ENERGY
                </span>
              </div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              IBM
            </h2>
            <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
              Cutting-edge work combining blockchain, AI, and renewable energy (particularly solar and wind), the organizations are building "programmable energy" using a prosumer model.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipsSection;