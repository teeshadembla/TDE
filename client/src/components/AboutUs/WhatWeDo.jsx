
import React, { useState } from "react";

const Box = ({ 
  title, 
  description, 
  image, 
  className = "h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]",
  titleClassName = "",
  descriptionClassName = "",
  overlayOpacity = "bg-black/40"
}) => {
  return (
    <div className={`relative rounded-lg overflow-hidden shadow-2xl h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] ${className}`}>
      {/* Background Image */}
      <div 
        className="relative h-64 sm:h-72 md:h-80 lg:h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${image})`
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className={`absolute inset-0 ${overlayOpacity}`}></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-start p-4 sm:p-6 md:p-8">
          {/* Title */}
          <h2 className={`
            text-white font-bold mb-3 sm:mb-4 
            text-xl sm:text-xl md:text-xl lg:text-2xl
            leading-tight
            ${titleClassName}
          `}>
            {title}
          </h2>
          
          {/* Underline */}
          <div className="w-full h-0.5 bg-white/60 mb-4 sm:mb-6"></div>
          
          {/* Description */}
          <p className={`
            text-white/90 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md
            text-sm sm:text-base md:text-lg
            ${descriptionClassName}
          `}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const WhatWeDo = () => {
  const [tab, setTab] = useState("SystemDesignGovernance");

  const tabContent = {
    SystemDesignGovernance: [
      {
        title: "Governance Design",
        description: "Co-creating transparent, inclusive structures for decision-making and accountability.",
        image: "https://images.unsplash.com/photo-1529326230765-ddb538dc5eff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        title: "Policy Framework",
        description: "Developing adaptive frameworks that balance innovation with regulatory oversight and public interest.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      },
      {
        title: "Digital Rights",
        description: "Ensuring equitable access to digital resources while protecting privacy and promoting digital literacy.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      }
    ],
    TechnologyForesight: [
      {
        title: "Emerging Technologies",
        description: "Identifying and analyzing breakthrough technologies that will shape the future digital landscape.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2125&q=80"
      },
      {
        title: "AI & Ethics",
        description: "Developing responsible AI frameworks that prioritize human values and societal benefit.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      },
      {
        title: "Future Scenarios",
        description: "Creating strategic scenarios to help organizations prepare for multiple possible futures.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
      }
    ],
    ResilienceConvening: [
      {
        title: "Community Building",
        description: "Fostering strong networks that can adapt and thrive in the face of systemic challenges.",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      },
      {
        title: "Crisis Response",
        description: "Building systems and protocols that enable rapid, coordinated responses to emerging crises.",
        image: "https://images.unsplash.com/photo-1586281010691-a2dd3d91814c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      },
      {
        title: "Stakeholder Engagement",
        description: "Creating meaningful dialogue between diverse stakeholders to build shared understanding and solutions.",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      }
    ]
  };

  return (
    <div className="bg-black h-[900px] flex flex-col items-center pt-10 px-4">
      <h1 className="text-white font-sans text-[40px] md:text-[52px] font-bold pb-5 text-center">
        What We Do
      </h1>

      <h3 className="text-neutral-400 text-[16px] md:text-[18px] text-center max-w-3xl font-medium">
        We operate at the intersection of technology, sustainability, and
        policy—partnering with global institutions, governments, and communities
        to co-create systems that are future-fit, inclusive, and resilient.
      </h3>

      <div className="w-full mt-16 max-w-7xl">
        {/* Tab Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-12">
          <button
            onClick={() => setTab("SystemDesignGovernance")}
            className={`text-white pb-3 font-semibold text-lg md:text-xl w-full max-w-xs font-sans transition-colors duration-300 hover:text-blue-400 ${
              tab === "SystemDesignGovernance"
                ? "border-b-2 border-b-blue-500 text-blue-400"
                : ""
            }`}
          >
            System Design and Governance
          </button>

          <button
            onClick={() => setTab("TechnologyForesight")}
            className={`text-white pb-3 font-semibold text-lg md:text-xl w-full max-w-xs font-sans transition-colors duration-300 hover:text-blue-400 ${
              tab === "TechnologyForesight"
                ? "border-b-2 border-b-blue-500 text-blue-400"
                : ""
            }`}
          >
            Technology and Foresight
          </button>

          <button
            onClick={() => setTab("ResilienceConvening")}
            className={`text-white pb-3 font-semibold text-lg md:text-xl w-full max-w-xs font-sans transition-colors duration-300 hover:text-blue-400 ${
              tab === "ResilienceConvening"
                ? "border-b-2 border-b-blue-500 text-blue-400"
                : ""
            }`}
          >
            Resilience and Convening
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
            {tabContent[tab].map((item, index) => (
              <div key={index} className="w-full max-w-sm">
                <Box
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  className="hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;