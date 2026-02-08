import React, { useState } from "react";

const Box = ({ 
  title, 
  description, 
  image, 
  overlayOpacity = "bg-black/40"
}) => {
  return (
    <div className="tabs-content-box relative rounded-[4px] overflow-hidden shadow-2xl h-full flex-1 min-w-0">
      {/* Background Image */}
      <div 
        className="relative h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${image})`
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className={`absolute inset-0 w-auto h-auto block box-border bg-[linear-gradient(rgb(0,0,0)_38%,rgba(0,0,0,0))] opacity-[0.8] text-[#333333] font-[Arial,'Helvetica Neue',Helvetica,sans-serif] text-[16px] leading-[20px] ${overlayOpacity}`}></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-start p-4 sm:p-6 md:p-8">
          {/* Title */}
          <h2 className="text-white dmsans-text font-bold sm:mb-4 text-[16px] sm:text-xl md:text-xl lg:text-[22px] leading-tight">
            {title}
          </h2>
          
          {/* Underline */}
          <div className="w-full h-0.5 bg-white/60 mb-4 sm:mb-6"></div>
          
          {/* Description */}
          <p className="text-white/90 dmsans-text leading-relaxed text-sm sm:text-base md:text-lg">
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
        image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68724a218ca5030202736dec_joshua-woods-Igu6btFCviY-unsplash.jpg"
      },
      {
        title: "Community Building",
        description: "Growing ecosystems of aligned actors to scale collaboration and impact.",
        image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6872426cdd17df7b00e137d2_midjorournye.png"
      },
      {
        title: "Stakeholder Management",
        description: "Aligning diverse voices to navigate complexity and build collective momentum.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      }
    ],
    TechnologyForesight: [
      {
        title: "Technology Advisor",
        description: "Guiding ethical and strategic use of AI, Web3, and emerging tech",
        image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6872426c8f3b51d80bd3f788_midjourney%202.png"
      },
      {
        title: "Futurecasting and Scenario Planning",
        description: "Developing responsible AI frameworks that prioritize human values and societal benefitHelping leaders anticipate and shape long-term futures through systems insight.",
        image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6872426b65d4ed3a7255b86a_djwdwd%204.png"
      }
    ],
    ResilienceConvening: [
      {
        title: "Climate Resilience and Planning",
        description: "Supporting organizations in adapting to ecological disruption with sustainable design.",
        image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/687249ca48edde385ba1d1fc_usgs-uGrT85dVK9U-unsplash.webp"
      },
      {
        title: "Strategic Convenings",
        description: "Hosting global gatherings that unlock insight, forge partnerships, and catalyze change.",
        image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68724a215fbd331e87a5660c_markus-krisetya-k0Jo8m6DO6k-unsplash.jpg"
      }
    ]
  };

  return (
    <div className="bg-black h-[900px] flex flex-col items-center pt-10 px-4">
      <h1 className="text-white montserrat-text text-[40px] md:text-[52px] font-bold pb-5 text-center">
        What We Do
      </h1>

      <h3 className="text-neutral-400 text-[16px] dmsans-text md:text-[18px] text-center max-w-[910px] font-medium">
        We operate at the intersection of technology, sustainability, and
        policy—partnering with global institutions, governments, and communities
        to co-create systems that are future-fit, inclusive, and resilient.
      </h3>

      <div className="w-full mt-28 max-w-7xl">
        {/* Tab Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 justify-items-center mb-5">
          <button
            onClick={() => setTab("SystemDesignGovernance")}
            className={`text-[rgb(111,111,111)] dmsans-text pb-3 font-semibold text-lg md:text-xl w-full max-w-xs font-sans transition-colors duration-300 hover:text-white ${
              tab === "SystemDesignGovernance"
                ? "border-b-2 border-b-blue-500 montserrat-text text-white"
                : ""
            }`}
          >
            System Design & Governance
          </button>

          <button
            onClick={() => setTab("TechnologyForesight")}
            className={`text-[rgb(111,111,111)] pb-3 dmsans-text font-semibold text-[20.8px] md:text-xl w-full max-w-xs font-sans transition-colors duration-300 hover:text-white ${
              tab === "TechnologyForesight"
                ? "border-b-2 border-b-blue-500 text-white montserrat-text"
                : ""
            }`}
          >
            Technology & Foresight
          </button>

          <button
            onClick={() => setTab("ResilienceConvening")}
            className={`text-[rgb(111,111,111)] pb-3 dmsans-text font-semibold text-lg md:text-xl w-full max-w-xs font-sans transition-colors duration-300 hover:text-white ${
              tab === "ResilienceConvening"
                ? "border-b-2 border-b-blue-500 text-white montserrat-text"
                : ""
            }`}
          >
            Resilience & Convening
          </button>
        </div>

        {/* Tab Content - New Structure */}
        <div className="w-tab-content w-full h-[320.4px]">
          {/* System Design & Governance Tab */}
          {tab === "SystemDesignGovernance" && (
            <div className="tabs-body w-full h-full flex gap-6">
              {tabContent.SystemDesignGovernance.map((item, index) => (
                <Box
                  key={index}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                />
              ))}
            </div>
          )}

          {/* Technology & Foresight Tab */}
          {tab === "TechnologyForesight" && (
            <div className="tabs-body w-full h-full flex gap-6">
              {tabContent.TechnologyForesight.map((item, index) => (
                <Box
                  key={index}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                />
              ))}
            </div>
          )}

          {/* Resilience & Convening Tab */}
          {tab === "ResilienceConvening" && (
            <div className="tabs-body w-full h-full flex gap-6">
              {tabContent.ResilienceConvening.map((item, index) => (
                <Box
                  key={index}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;