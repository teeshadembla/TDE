import React, { useState, useEffect, useRef } from 'react';

const slides = [
  {
    title: "Anti corruption and Blockchain Technology",
    buttontext: "Video",
    image: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68ab318f3e2c6946aff402f0_GBCC.png",
    link: "https://www.youtube.com/watch?v=KxTX8ZtnSB0"
  },
  {
    title: "Building Digital Assets to Actualize the Vision of Beneficial Ownership Transparency",
    buttontext: "Video",
    image: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68ab303e9293b6ddb39087c9_IACC.png",
    link: "https://www.youtube.com/watch?v=cPNePf09U5k"
  },
  {
    title: "Let's fight Global Tax Dodgers With Cutting-Edge Data Science",
    buttontext: "Article",
    image: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68ab2ebcd526f302010e5d65_Image.png",
    link: "https://news.bloombergtax.com/daily-tax-report-state/lets-fight-global-tax-dodgers-with-cutting-edge-data-science"
  },
  {
    title: "Rapid Digitalization-Hoped For,but Not Always Achieved",
    buttontext: "Video",
    image: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6853c00f26234153c0028387_article4.png",
    link: "https://www.youtube.com/watch?v=Gfl_3vQA6F4"
  },
  {
    title: 'Navroop Sahdev at New York Stock Exchange: New Human-centered Digital Economy',
    buttontext: 'Video Interview',
    image: 'https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6852d28988c2cd83c12a7b40_article1.png',
    link: 'https://fintech.tv/navroop-sahdev-founder-ceo-of-the-digital-economist/'
  },
  {
    title: 'Rebooting The Global Economy After Coronavirus: Physical Scarcity To Digital Abundance',
    buttontext: 'Read Article',
    image: 'https://static.wixstatic.com/media/92dfa2_d89968a8fe8b4818929af5cf5958b304~mv2.png/v1/crop/x_0,y_0,w_2373,h_896/fill/w_872,h_334,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/forbes-logo-black-and-white.png',
    link: 'https://www.forbes.com/sites/lawrencewintermeyer/2020/04/02/rebooting-the-global-economy-after-coronavirus-physical-scarcity-to-digital-abundance/#381c22244b09'
  }
];

const CarouselCard = ({ title, buttonText, image, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block w-full h-[280px] sm:h-[320px] lg:h-[380px] overflow-hidden bg-neutral-800 shadow-lg transition-all duration-300  hover:scale-[1.02] hover:shadow-2xl group"
    >
      {/* Image Container */}
      <div className="w-full h-[50%] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      {/* Content Container */}
      <div className="relative p-4 flex flex-col justify-between h-[50%]">
        {/* Button Tag */}
        <div className="flex justify-start mb-2">
          <span className="text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-wide">
            {buttonText}
          </span>
        </div>
        
        {/* Title */}
        <div className="flex-1 flex items-end">
          <h3 className="text-white text-sm sm:text-base lg:text-lg font-medium leading-tight line-clamp-3">
            {title}
          </h3>
        </div>
      </div>
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </a>
  );
};

const CustomCarousel = ({
  autoSlide = true,
  autoSlideInterval = 3500,
  pauseOnHover = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const autoSlideRef = useRef(null);

  const getCardsPerView = () => {
    const width = window.innerWidth;
    if (width >= 1280) return 4; // xl: 4 cards
    if (width >= 1024) return 3; // lg: 3 cards  
    if (width >= 768) return 2;  // md: 2 cards
    return 1; // sm: 1 card
  };

  const handleResize = () => {
    const newCardsPerView = getCardsPerView();
    setCardsPerView(newCardsPerView);
    
    // Adjust currentIndex to prevent going beyond available slides
    const maxIndex = Math.max(0, slides.length - newCardsPerView);
    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide functionality - now works on ALL screen sizes
  useEffect(() => {
    if (!autoSlide || isPaused || isTransitioning) {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
      return;
    }

    autoSlideRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const maxIndex = Math.max(0, slides.length - cardsPerView);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, autoSlideInterval);

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [autoSlide, autoSlideInterval, isPaused, cardsPerView, isTransitioning]);

  // Update scroll position when currentIndex changes
  useEffect(() => {
    if (containerRef.current) {
      slideTo(currentIndex);
    }
  }, [currentIndex]);

  const slideTo = (index) => {
    if (containerRef.current && !isTransitioning) {
      setIsTransitioning(true);
      const cardWidth = containerRef.current.children[0].offsetWidth;
      const gap = 24; // 1.5rem gap converted to pixels
      const scrollPosition = index * (cardWidth + gap);
      
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });

      // Reset transition flag after animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    const maxIndex = Math.max(0, slides.length - cardsPerView);
    const nextIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    const maxIndex = Math.max(0, slides.length - cardsPerView);
    const prevIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    setCurrentIndex(prevIndex);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    const maxIndex = Math.max(0, slides.length - cardsPerView);
    const validIndex = Math.min(index, maxIndex);
    setCurrentIndex(validIndex);
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  const maxSlideIndex = Math.max(0, slides.length - cardsPerView);
  const totalSlides = maxSlideIndex + 1;

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 sm:px-8 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-semibold text-center mb-12">Media</h2>
        
        {/* Universal Auto-sliding Carousel for ALL screen sizes */}
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={containerRef} 
            className="flex overflow-x-hidden gap-6 pb-4 scroll-smooth"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
            }}
          >
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className={`flex-none ${
                  cardsPerView === 1 ? 'w-full max-w-sm mx-auto' :
                  cardsPerView === 2 ? 'w-[calc(50%-12px)]' :
                  cardsPerView === 3 ? 'w-[calc(33.333%-16px)]' :
                  'w-[calc(25%-18px)]'
                }`}
              >
                <CarouselCard
                  title={slide.title}
                  buttonText={slide.buttontext}
                  image={slide.image}
                  link={slide.link}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Always visible when there are more slides */}
          {slides.length > cardsPerView && (
            <>
              <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50 backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-50 backdrop-blur-sm"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white w-8' 
                      : 'bg-gray-600 hover:bg-gray-400 w-2'
                  } disabled:opacity-50`}
                  aria-label={`Go to slide group ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Carousel Info */}
          <div className="flex justify-center items-center mt-6 gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Showing</span>
              <span className="font-semibold text-white">
                {Math.min(currentIndex + cardsPerView, slides.length)} of {slides.length}
              </span>
              <span className="hidden sm:inline">cards</span>
            </div>
            
            <div className="h-4 w-px bg-gray-600 hidden sm:block" />
            
            <div className="hidden md:flex items-center gap-2">
              <span>
                {cardsPerView === 1 ? 'Mobile View' : 
                 cardsPerView === 2 ? 'Tablet View' :
                 cardsPerView === 3 ? 'Desktop View' : 'Large Screen View'}
              </span>
            </div>
          </div>

          {/* Auto-slide Status */}
          {autoSlide && slides.length > cardsPerView && (
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-900/50 px-3 py-1 rounded-full backdrop-blur-sm">
                <div className={`w-2 h-2 rounded-full ${
                  isPaused ? 'bg-amber-400' : 'bg-green-400'
                } animate-pulse`} />
                <span>{isPaused ? 'Paused' : 'Auto-playing'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CustomCarousel;