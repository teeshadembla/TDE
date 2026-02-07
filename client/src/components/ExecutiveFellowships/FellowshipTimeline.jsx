import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const FellowshipTimeline = ({
  // Content props
  phases = [
    {
      id: 1,
      title: "Orientation",
      description: "Kicking off workgroups with ongoing projects and partnerships.",
    },
    {
      id: 2,
      title: "Immersion",
      description: "Period of in-depth research and development, writing, and publications.",
    },
    {
      id: 3,
      title: "Dissemination",
      description: "Busy fall period focused on engagement and dissemination.",
    },
    {
      id: 4,
      title: "Impact",
      description: "Impact captured in the 5-year impact report, unveiled in Davos.",
    }
  ],
  
  // Header props
  headerTitle = "Executives Fellowship Structure",
  headerSubtitle = "The Fellowship is spread over 4 phases",
  
  // Styling props
  colors = {
    background: "bg-neutral-900",
    text: "text-white",
    subtitle: "text-gray-400",
    description: "text-gray-300",
    staticLine: "bg-[rgb(6,44,101)]",
    animatedLine: "bg-[rgb(0,121,255)]",
    checkpoint: "bg-blue-500",
    checkpointActive: "bg-blue-400",
  },
  
  // Layout props
  phaseHeight = "40vh", // Height per phase section
  showHeader = true,
  
  // Animation props
  scrollStartTrigger = 0.5, // When to start animation (0-1, percentage of viewport)
  scrollEndTrigger = 0.5, // When to end animation (0-1, percentage of viewport)

  onApplyClick
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress through the timeline
      // Start when container top reaches the trigger point
      // End when container bottom reaches the end trigger point
      const startPoint = viewportHeight * scrollStartTrigger;
      const endPoint = viewportHeight * scrollEndTrigger;
      
      // Distance from top of container to start trigger point
      const distanceScrolled = startPoint - rect.top;
      
      // Total distance to scroll through (from start to when bottom hits end point)
      const totalScrollDistance = containerHeight - (startPoint - endPoint);
      
      const progress = Math.max(0, Math.min(1, distanceScrolled / totalScrollDistance));
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollStartTrigger, scrollEndTrigger]);

  // Calculate which checkpoints should be active based on scroll progress
  const getCheckpointProgress = (index) => {
    const checkpointPosition = index / (phases.length - 1);
    return scrollProgress >= checkpointPosition;
  };

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text}`}>
      {/* Header Section */}
      {showHeader && (
        <div className="text-center py-12 md:py-20 px-4">
          <h1 className="text-4xl montserrat-text text-[43.2px] md:text-6xl lg:text-[43.2px] font-bold mb-6">
            {headerTitle}
          </h1>
          <h3 className={`text-lg md:text-xl lg:text-[27.2px] dmsans-text font-bold text-[27.2px] text-[rgb(159,159,159)]`}>
            {headerSubtitle}
          </h3>
        </div>
      )}

      {/* Timeline Container */}
      <div ref={containerRef} className="relative px-4 md:px-8 lg:px-16 xl:px-24 pb-20">
        {/* Center line container */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 top-0" 
          style={{ height: `calc(${phases.length} * ${phaseHeight})` }}
        >
          {/* Static blue timeline line */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[rgb(6,44,101)] opacity-30`} />
          
          {/* Animated lighter blue line that fills progressively */}
          <div 
            className={`absolute left-1/2 transform -translate-x-1/2 w-1 ${colors.animatedLine}`}
            style={{ 
              height: `${scrollProgress * 100}%`,
              boxShadow: '0 0 10px rgba(96, 165, 250, 0.5)'
            }}
          />
        </div>

        {/* Timeline Phases */}
        <div className="relative">
          {phases.map((phase, index) => (
            <div
              key={phase.id}
              className="flex items-center justify-center"
              style={{ height: phaseHeight }}
            >
              <div className="w-full max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                  
                  {/* Title Section - Left Side */}
                  <div className="md:col-span-5 text-center md:text-right md:pr-4 lg:pr-8">
                    <h2 className=" montserrat-text sm:text-[10px] md:text-[12px] lg:text-[43.2px] font-bold">
                      {phase.title}
                    </h2>
                  </div>

                  {/* Timeline Checkpoint - Center */}
                  <div className="md:col-span-2 flex items-center justify-center relative order-first md:order-none">
                    {/* Checkpoint Square */}
                    <div className={`relative z-10 w-3 h-3 md:w-4 md:h-4 rounded-sm border-4 border-gray-900 transition-all duration-500 ${
                      getCheckpointProgress(index)
                        ? `${colors.checkpointActive} scale-125 shadow-lg shadow-blue-400/50` 
                        : `${colors.checkpoint} opacity-30 scale-100`
                    }`}>
                      {/* Pulse animation when active */}
                      {getCheckpointProgress(index) && (
                        <div className={`absolute inset-0 rounded-sm ${colors.checkpointActive} animate-ping opacity-20`} />
                      )}
                    </div>
                  </div>

                  {/* Description Section - Right Side */}
                  <div className="md:col-span-5 w-[390px] text-center md:text-left md:pl-4 lg:pl-8">
                    <p className={`text-base sm:text-lg md:text-xl text-[rgb(217,217,217)] font-semibold text-[27.2px] leading-relaxed transition-all duration-500 ${
                      getCheckpointProgress(index) ? 'opacity-100' : 'opacity-40'
                    }`}>
                      {phase.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 pb-10 justify-center items-center mt-10">
          <button
            onClick={onApplyClick}
            className="all-[unset] inline-block max-w-full whitespace-nowrap overflow-hidden text-ellipsis bg-[#0445AF] text-white text-[28px] rounded-[6px] px-[46px] font-bold h-[70px] cursor-pointer leading-[70px] text-center m-0 no-underline font-['Helvetica',Arial,sans-serif]"
          >
            Apply Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

    </div>
  );
};

export default FellowshipTimeline;