import React from "react";

const HeroSection = ({ name, headliner,description, bgImg }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${bgImg}")` }}

      >
      </div>
      
      <div className="relative z-10 flex items-center ml-0 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl ml-30 text-left">
         
          <div className="mb-6 inline-flex items-center">
            <span className=" font-sans text-[#888] text-[1.3em] sm:text-base mr-3">
              Practice Area
            </span>
            <span className=" bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-[#d9d9d9] px-4 py-2 rounded-full text-sm font-medium">
              {name }
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            {headliner}
          </h1>
          
          {/* Description */}
          <p className="text-4xl sm:text-xl md:text-2xl text-gray-200 max-w-3xl leading-relaxed font-medium">
            {description || "We develop adaptive, future-ready policy frameworks that drive equity, resilience, and transparency—bridging public interest, innovation, and governance in a tech-enabled world."}
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default HeroSection;