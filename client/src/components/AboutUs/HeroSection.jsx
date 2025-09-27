import react from 'react';

import React from 'react';

// Individual Image Tile Component
const ImageTile = ({ 
  src, 
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
  backgroundColor = "bg-slate-900",
  textColor = "text-white",
  titleClassName = "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
  subtitleClassName = "text-lg md:text-xl lg:text-2xl",
  containerClassName = ""
}) => {
  

  return (
    <section className={`min-h-screen relative flex items-center justify-center overflow-hidden ${backgroundColor} ${containerClassName}`}>
      

      {/* Circular Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/80" 
           style={{
             background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 80%)'
           }} />
      
      {/* Central Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <h1 className={`font-bold leading-tight mb-6 sm:mb-8 lg:mb-10 ${titleClassName} ${textColor}`}>
          {title}
        </h1>
        
        <p className={`font-light leading-relaxed italic max-w-4xl mx-auto opacity-90 ${subtitleClassName} ${textColor}`}>
          {subtitle}
        </p>
      </div>
    </section>
  );
};

// Usage Example with Custom Configuration
const HeroSection = () => {


  return (
    <div className="font-montserrat">
      <PartnerHeroSection />
    </div>
  );
};

export default HeroSection;