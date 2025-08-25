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
    <section className="relative py-24 px-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
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
        <div className="inline-block p-4 bg-black rounded-full mb-8 animate-pulse">
          <Award className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extralight mb-8 tracking-tight leading-tight">
          Executive
          <span className="block bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
            Fellowship
          </span>
          <span className="text-4xl md:text-5xl block mt-2 text-gray-600">Program</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
          An <span className="font-medium text-black">elite initiative</span> for visionary leaders committed to 
          <span className="font-medium text-black"> shaping the future</span> of global economic policy
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={onApplyClick}
            className="group bg-black text-white px-10 py-5 hover:bg-gray-800 transition-all duration-300 flex items-center gap-3 font-medium text-lg transform hover:scale-105 hover:shadow-2xl"
          >
            Apply Now
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="border-2 border-gray-300 px-10 py-5 hover:bg-gray-50 transition-all duration-300 font-medium text-lg hover:border-black transform hover:scale-105">
            Watch Overview
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl md:text-5xl font-light text-black mb-2 group-hover:scale-110 transition-transform">
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