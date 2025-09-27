import React, { useState, useEffect, useRef } from 'react';

// Individual Slide Component
const SlideSection = ({ 
  id,
  title, 
  subtitle, 
  backgroundImage, 
  overlayColor = "bg-black/60",
  textColor = "text-white",
  titleSize = "text-5xl md:text-6xl",
  children,
  className = ""
}) => {
  const backgroundStyle = backgroundImage 
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }
    : {};

  return (
    <div 
      id={id}
      className={`min-h-screen relative flex items-center justify-center ${className}`}
      style={backgroundStyle}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayColor}`} />
      
      {/* Content */}
      <div className={`relative z-10 text-center px-6 max-w-4xl mx-auto ${textColor}`}>
        {title && (
          <h1 className={`font-bold mb-6 leading-tight ${titleSize}`}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-lg md:text-xl leading-relaxed opacity-90 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

// Transition Slide Component
const TransitionSlide = ({ 
  slide, 
  transitionProgress,
  backgroundColor = "bg-gray-900"
}) => {
  if (transitionProgress <= 0) return null;

  const translateY = 100 - (transitionProgress * 100);
  const opacity = transitionProgress > 0.1 ? 1 : 0;
  
  return (
    <div 
      className={`fixed inset-0 z-20 ${backgroundColor}`}
      style={{
        transform: `translateY(${translateY}%)`,
        opacity: opacity,
      }}
    >
      <div className="h-full relative">
        <SlideSection {...slide} />
      </div>
    </div>
  );
};

// Main Scroll Transition Container
const ScrollTransition = ({ slides = [], transitionOffset = 0.3 }) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate transition progress for a specific slide
  const getTransitionProgress = (slideIndex) => {
    if (slideIndex === 0) return 0;
    
    const viewportHeight = window.innerHeight;
    const slideStart = (slideIndex - 1) * viewportHeight;
    const transitionStart = slideStart + viewportHeight * (1 - transitionOffset);
    const transitionEnd = slideStart + viewportHeight;
    
    if (scrollY < transitionStart) return 0;
    if (scrollY >= transitionEnd) return 1;
    
    return (scrollY - transitionStart) / (viewportHeight * transitionOffset);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Main slides */}
      {slides.map((slide, index) => (
        <SlideSection key={`slide-${index}`} {...slide} />
      ))}

      {/* Transition slides */}
      {slides.map((slide, index) => {
        if (index === 0) return null;
        
        const transitionProgress = getTransitionProgress(index);
        
        return (
          <TransitionSlide
            key={`transition-${index}`}
            slide={slide}
            transitionProgress={transitionProgress}
            backgroundColor={slide.transitionBg || "bg-gray-900"}
          />
        );
      })}

      {/* Spacer div to enable scrolling */}
      <div 
        className="w-full pointer-events-none"
        style={{ height: `${Math.max(0, slides.length - 1) * 100}vh` }}
      />
    </div>
  );
};

// Demo component showing how to use it
const Demo = () => {
  const slideData = [
    {
      id: "slide-1",
      title: "How We Drive Impact",
      backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop",
      overlayColor: "bg-blue-900/70",
      children: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-sm opacity-80">Building connections that matter</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p className="text-sm opacity-80">Cutting-edge solutions</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Growth</h3>
            <p className="text-sm opacity-80">Accelerating progress</p>
          </div>
        </div>
      )
    },
    {
      id: "slide-2",
      title: "Initiatives",
      subtitle: "We launch high-leverage initiatives that rewire systems from the ground up—aligning emerging technologies with inclusive policy and human-first design to unlock real-world change.",
      backgroundImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop",
      overlayColor: "bg-gray-900/80",
      transitionBg: "bg-blue-600",
      children: (
        <div className="mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Learn More
          </button>
        </div>
      )
    },
    {
      id: "slide-3",
      title: "Publications",
      subtitle: "Access insight that moves the needle. Our publications offer strategic analysis, future trends, and global perspectives to help you lead in a fast-shifting digital economy.",
      backgroundImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop",
      overlayColor: "bg-gray-900/85",
      transitionBg: "bg-purple-600",
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-colors cursor-pointer">
              <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded mb-4 flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Research Paper {i}</h3>
              <p className="text-sm opacity-80">Deep insights into emerging technologies and their societal impact.</p>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold text-xl">Brand</div>
            <div className="hidden md:flex space-x-6">
              {slideData.map((slide, index) => (
                <a 
                  key={index}
                  href={`#${slide.id}`}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({
                      top: index * window.innerHeight,
                      behavior: 'smooth'
                    });
                  }}
                >
                  {slide.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <ScrollTransition 
        slides={slideData} 
        transitionOffset={0.4} 
      />
    </div>
  );
};

export default Demo;