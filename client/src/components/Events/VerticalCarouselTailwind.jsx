import React from 'react';

const VerticalCarouselTailwind = ({ duplicatedImages }) => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* First scrolling track */}
      <div 
        className="absolute top-0 left-0 w-full animate-scroll-up"
        style={{ 
          transformStyle: 'preserve-3d', 
          willChange: 'transform'
        }}
      >
        <div className="flex flex-col gap-4">
          {duplicatedImages.map((image, index) => (
            <div key={`track1-${index}`} className="w-full">
              <img 
                src={image} 
                alt={`Event ${index + 1}`} 
                className="w-full h-[228px] object-cover rounded-lg" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Second scrolling track (for visual continuity) */}
      <div 
        className="absolute top-0 left-0 w-full animate-scroll-up"
        style={{ 
          transformStyle: 'preserve-3d', 
          willChange: 'transform',
          animationDelay: '-15s' // Half of the 30s duration
        }}
      >
        <div className="flex flex-col gap-4">
          {duplicatedImages.map((image, index) => (
            <div key={`track2-${index}`} className="w-full">
              <img 
                src={image} 
                alt={`Event ${index + 1}`} 
                className="w-full h-[228px] object-cover rounded-lg" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalCarouselTailwind;

// Example usage:
// import VerticalCarouselTailwind from './VerticalCarouselTailwind';
// 
// const images = [
//   '/path/to/image1.jpg',
//   '/path/to/image2.jpg',
//   '/path/to/image3.jpg',
//   '/path/to/image4.jpg',
// ];
//
// <VerticalCarouselTailwind images={images} />