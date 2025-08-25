import React from 'react';
import { Clock } from 'lucide-react';

const DiscoverSection = () => {
  return (
    <div className="bg-black text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        
        <div className="mb-12">
          <img 
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80"
            alt="Digital Economy Visualization"
            className="w-full max-w-3xl mx-auto rounded-lg shadow-2xl"
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-8 leading-tight">
          Discover what The Digital Economist can do for you.
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
          We undertake custom studies serving the strategic goals of our clients and partner organizations.
        </p>

        {/* Call to Action Button */}
        <div className="mb-6">
          <button className="bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 mr-4">
            Let's go!
          </button>
          <span className="text-gray-300 text-lg">
            press <span className="font-semibold">Enter ↵</span>
          </span>
        </div>

        {/* Duration Indicator */}
        <div className="flex items-center justify-center text-gray-300">
          <Clock className="w-5 h-5 mr-2" />
          <span className="text-lg">Takes 3 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default DiscoverSection;