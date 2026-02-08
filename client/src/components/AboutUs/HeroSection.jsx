import react from 'react';

import React from 'react';

// Individual Image Tile Component
const ImageTile = ({ 
  src="https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6858c9cd351d819e7a409c42_about%20us%20heor%20pic.png", 
  alt = "", 
  className = "",
  overlayOpacity = "bg-black/40"
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
      />
      <div className={`absolute inset-0 ${overlayOpacity}`} />
    </div>
  );
};

// Main Hero Section Component
const PartnerHeroSection = ({
  title = "Your Partner in Navigating Uncertainty",
  subtitle = "When the future is unclear, we help build it—anchored in systems thinking, strategic foresight, and human-centered design.",
  images = [],
  backgroundColor = "bg-black",
  textColor = "text-white",
  titleClassName = "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
  subtitleClassName = "text-lg md:text-xl lg:text-2xl",
  containerClassName = ""
}) => {
  

  return (
    <section id='about-us-hero' className={`flex items-start justify-start box-border relative overflow-hidden bg-no-repeat bg-left bg-auto bg-scroll text-[#333333] font-[Arial,'Helvetica Neue',Helvetica,sans-serif] text-[14px] leading-[20px] h-[400.8px] w-full pl-0 bg-[url('https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6858c9cd351d819e7a409c42_about%20us%20heor%20pic.png')] ${backgroundColor} ${containerClassName}`}>
      <div id="header-text-wrap" className='flex items-center justify-center flex-col flex-nowrap box-border absolute text-white font-[Arial] text-[18px] leading-[20px] h-[364.8px] w-[1440px] px-[64px] pt-[150px] pb-[150px] m-0 gap-0'>
        
        <div id="div-block-64" className='flex items-center flex-col flex-nowrap box-border text-white font-[Arial] text-[18px] leading-[20px] h-[210.875px] w-[1229.18px] gap-[28px]'>
          <h1 className="flex items-stretch justify-center box-border relative text-white montserrat-text text-[57.6px] font-semibold leading-[63.36px] h-[126.725px] w-[860.412px] text-center m-0 z-[1]"
>
            {title}
          </h1>

          <h4 className='block box-border relative text-[rgb(204,203,203)] dmsans-text text-[21.6px] font-normal leading-[28.08px] h-[56.15px] w-[737.5px] text-center m-0 z-[1]'>
            <strong><em className='font-normal'> When the future is unclear, we help build it—anchored in systems thinking, strategic foresight, and human-centered design.</em></strong>
          </h4>
        </div>
        
        <img id="gradient-hero" 
          className='block absolute box-border text-white font-[Arial] text-[18px] leading-[20px] h-[576px] w-[720px] max-w-full left-[720px] right-0 top-[-105.6px] bottom-[-105.6px] m-0 pt-0 overflow-clip align-middle'
          src="https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6858c9cd351d819e7a409c47_hero%20blue%20aurora.png"
        >
       </img>

      </div>
      
    </section>
  );
};

// Usage Example with Custom Configuration
const HeroSection = () => {


  return (
    <div className="font-montserrat pt-0">
      <PartnerHeroSection />
    </div>
  );
};

export default HeroSection;