import React from 'react';

const NewsHeader = ({ 
  title = "News",
  subtitle = "The Latest News from Us and Other Emerging Narratives: Bridging Insights, Transforming Economies.",
  showIcon = true,
  customIcon = null,
  backgroundColor = "blue",
  textColor = "white"
}) => {
  // Default globe/world icon SVG
  const DefaultIcon = () => (
    <svg 
      className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" 
      viewBox="0 0 100 100" 
      fill="currentColor"
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3"/>
      <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="50" cy="50" rx="35" ry="45" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <ellipse cx="50" cy="50" rx="45" ry="35" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );

  // Background gradient classes based on color prop
  const getBackgroundGradient = (color) => {
    const gradients = {
      blue: "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900",
      purple: "bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900",
      indigo: "bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900",
      teal: "bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900",
      gray: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      green: "bg-gradient-to-br from-green-900 via-green-800 to-green-900"
    };
    return gradients[color] || gradients.blue;
  };

  // Text color classes
  const getTextColor = (color) => {
    const colors = {
      white: "text-white",
      gray: "text-gray-100",
      blue: "text-blue-100",
      purple: "text-purple-100",
      indigo: "text-indigo-100"
    };
    return colors[color] || colors.white;
  };

  return (
    <header className={`relative overflow-hidden ${getBackgroundGradient(backgroundColor)} ${getTextColor(textColor)}`}>
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 px-4 py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Icon and Title Container */}
          <div className="flex flex-col items-center justify-center mb-6 md:mb-8">
            {showIcon && (
              <div className="mb-4 md:mb-6 opacity-90">
                {customIcon || <DefaultIcon />}
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
              <span className="inline-flex items-center gap-3 md:gap-4">
                {showIcon && !customIcon && (
                  <div className="inline-block">
                    <svg 
                      className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" 
                      viewBox="0 0 100 100" 
                      fill="currentColor"
                    >
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6"/>
                      <ellipse cx="50" cy="50" rx="18" ry="40" fill="none" stroke="currentColor" strokeWidth="4"/>
                      <ellipse cx="50" cy="50" rx="40" ry="18" fill="none" stroke="currentColor" strokeWidth="4"/>
                      <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="4"/>
                    </svg>
                  </div>
                )}
                {title}
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90 font-light">
              {subtitle}
            </p>
          </div>

          {/* Decorative line */}
          <div className="mt-8 md:mt-10 lg:mt-12 flex justify-center">
            <div className="w-24 md:w-32 lg:w-40 h-1 bg-current opacity-50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </header>
  );
};

// Example usage component to demonstrate different configurations
const NewsHeaderDemo = () => {
  const configurations = [
    {
      title: "News",
      subtitle: "The Latest News from Us and Other Emerging Narratives: Bridging Insights, Transforming Economies.",
      backgroundColor: "blue",
      showIcon: true
    },
  ];

  return (
    <div className="space-y-8">
      {configurations.map((config, index) => (
        <NewsHeader key={index} {...config} />
      ))}
    </div>
  );
};

export default  NewsHeaderDemo ;