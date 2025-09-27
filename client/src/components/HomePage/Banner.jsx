import React from 'react';

// Individual banner item component
const BannerItem = ({ text, separator = "/" }) => (
  <span className="flex items-center whitespace-nowrap">
    <span className=" text-neutral-300 text-xl font-sans font-bold tracking-wider md:text-base lg:text-5xl">
      {text}
    </span>
    <span className="mx-3 md:mx-4 text-5xl font-sans text-neutral-300 font-medium">
      {separator}
    </span>
  </span>
);

// Main scrolling content component
const ScrollingContent = ({ items, speed = "15s" }) => (
  <div 
    className="flex animate-scroll"
    style={{
      animationDuration: speed,
      minWidth: '200%'
    }}
  >
    {/* First set of items */}
    <div className="flex items-center">
      {items.map((item, index) => (
        <BannerItem 
          key={`first-${index}`} 
          text={item} 
          separator={index === items.length - 1 ? "/" : "/"}
        />
      ))}
    </div>
    {/* Duplicate set for seamless loop */}
    <div className="flex items-center">
      {items.map((item, index) => (
        <BannerItem 
          key={`second-${index}`} 
          text={item} 
          separator={index === items.length - 1 ? "/" : "/"}
        />
      ))}
    </div>

    <div className="flex items-center">
      {items.map((item, index) => (
        <BannerItem 
          key={`second-${index}`} 
          text={item} 
          separator={index === items.length - 1 ? "/" : "/"}
        />
      ))}
    </div>
  </div>
);

// Main banner container component
const MovingBanner = ({ 
  items = [
    "RESPONSIBLE INNOVATION",
    "BLOCKCHAIN GOVERNANCE",
    "AI",
    "LABOR MARKETS",
    "AI ETHICS",
    "AI ADOPTION",
  ],
  height = "90px",
  backgroundColor = "bg-white",
  speed = "15s",
  pauseOnHover = true
}) => (
  <div 
    className={`${backgroundColor}   overflow-hidden relative ${pauseOnHover ? 'hover:pause-animation' : ''}`}
    style={{ height }}
  >
    <div className="flex items-center h-full">
      <ScrollingContent items={items} speed={speed} />
    </div>
  </div>
);

// Demo component showing the banner in use
const Banner = () => {
  const topics = [  
    "BIODIVERSITY",
    "ENVIRONMENTALISM",
    "DIGITAL AUTHORITARIANISM",
    "CAPITALISM",
    "CLIMATE CHANGE",
    "AI & SDGS"
  ];

  return (
    <div className="h-96 bg-white">
      {/* Default Banner */}
      <MovingBanner />
      {/* Custom Banner Example */}
      <div>
        <MovingBanner 
          items={topics}
          speed="15s"
        />
      </div>

      

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll linear infinite;
        }
        
        .hover\\:pause-animation:hover .animate-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Banner;