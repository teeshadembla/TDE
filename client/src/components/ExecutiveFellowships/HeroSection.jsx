import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Globe, BookOpen, Calendar, Award, ArrowRight, Check, X, Star, Play, Pause, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
const HeroSection = ({ onApplyClick }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { number: "200+", label: "Global Leaders" },
    { number: "50+", label: "Countries" },
    { number: "95%", label: "Impact Rate" }
  ];

  return (
    <section style={{backgroundImage : 'url("https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685ba0a9938045f303d35ac4_fellowbackground.png")', backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'}} className="relative py-24 px-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-black rounded-full"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-900 rounded-full"
          style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
        ></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-block p-4 bg-white rounded-full mb-8 animate-pulse">
          <Award className="w-10 h-10 text-black" />
        </div>
        
        {/* Header Text */}
        <div className='flex flex-col items-center justify-center gap-6'>
          <h1 className=" items-stretch justify-center box-border text-white montserrat-text text-[48.6px] font-semibold leading-[53.46px] relative w-[907.112px] h-[53.4625px] m-0 z-[1] whitespace-nowrap">
            We are an{' '}<em className="mx-1">Engine</em>{' '}to create{' '}
              <em className="mx-1">Leaders</em>
          </h1>
          
          <h4 className="flex items-stretch justify-center box-border text-[rgb(204,203,203)] dmsans-text text-[23.4px] font-semibold h-[56.15px] leading-[28.08px] m-0 relative text-center [text-size-adjust:100%] [unicode-bidi:isolate] w-[884.95px] z-[1]">
              Become part of a curated network of global leaders shaping the future of a digitally-enabled, inclusive economy.
          </h4>
        </div>


        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-10">
          <button
            onClick={onApplyClick}
            className="all-[unset] inline-block max-w-full whitespace-nowrap overflow-hidden text-ellipsis bg-[#0445AF] text-white text-[28px] rounded-[6px] px-[46px] font-bold h-[70px] cursor-pointer leading-[70px] text-center m-0 no-underline font-['Helvetica',Arial,sans-serif]"
          >
            Apply Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl md:text-5xl font-light text-white mb-2 group-hover:scale-110 transition-transform">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;