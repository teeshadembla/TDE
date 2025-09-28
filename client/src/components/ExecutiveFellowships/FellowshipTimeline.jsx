import React, { useState, useEffect, useRef } from 'react';

const FellowshipTimeline = () => {
  const [visiblePhases, setVisiblePhases] = useState(new Set());
  const phaseRefs = useRef([]);

  const phases = [
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
  ];

  useEffect(() => {
    const handleScroll = () => {
      const newVisiblePhases = new Set();
      
      phaseRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Phase is visible if it's in the viewport
          if (rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2) {
            newVisiblePhases.add(index);
          }
        }
      });
      
      setVisiblePhases(newVisiblePhases);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header Section */}
      <div className="text-center py-12 md:py-20 px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          Fellowship Structure
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-400">
          The Fellowship is spread over 4 phases
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative px-4 md:px-8 lg:px-16">
        {/* Static Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-500 opacity-80">
          <div 
            className="w-full bg-blue-500"
            style={{ height: `${phases.length * 100}vh` }}
          />
        </div>

        {/* Timeline Phases */}
        <div className="relative">
          {phases.map((phase, index) => (
            <div
              key={phase.id}
              ref={(el) => (phaseRefs.current[index] = el)}
              className="min-h-screen flex items-center justify-center py-12"
            >
              <div className="w-full max-w-6xl mx-auto">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  index % 2 === 0 ? '' : 'lg:grid-flow-col-dense'
                }`}>
                  
                  {/* Content Section */}
                  <div className={`space-y-6 ${
                    index % 2 === 0 
                      ? 'lg:pr-16 text-left lg:text-right' 
                      : 'lg:pl-16 lg:col-start-2 text-left'
                  }`}>
                    <div className={`transform transition-all duration-700 ${
                      visiblePhases.has(index)
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-20 opacity-0'
                    }`}>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                        {phase.title}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Checkpoint */}
                  <div className={`relative flex items-center justify-center ${
                    index % 2 === 0 ? 'lg:pl-16' : 'lg:pr-16 lg:col-start-1'
                  }`}>
                    {/* Checkpoint Circle */}
                    <div className={`relative z-10 w-6 h-6 bg-blue-500 rounded-full border-4 border-gray-900 transition-all duration-500 ${
                      visiblePhases.has(index)
                        ? 'scale-125 shadow-lg shadow-blue-500/50' 
                        : 'scale-100'
                    }`}>
                      {/* Pulse animation when visible */}
                      {visiblePhases.has(index) && (
                        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                      )}
                    </div>

                    {/* Connection Line to Content */}
                    <div className={`absolute w-12 md:w-16 h-0.5 bg-blue-500 transition-all duration-700 ${
                      visiblePhases.has(index) ? 'opacity-100' : 'opacity-0'
                    } ${
                      index % 2 === 0 
                        ? 'left-6 md:left-6' 
                        : 'right-6 md:right-6'
                    }`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FellowshipTimeline;