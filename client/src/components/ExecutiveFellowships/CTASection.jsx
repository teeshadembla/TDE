import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Globe, BookOpen, Calendar, Award, ArrowRight, Check, X, Star, Play, Pause, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
const CTASection = ({ onApplyClick }) => {
  return (
    <section className="py-24 px-6 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full animate-spin"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-extralight mb-8 leading-tight">
          Ready to Shape
          <span className="block">the Future?</span>
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join our exclusive community of global leaders and make your mark on international economic policy
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={onApplyClick}
            className="group bg-white rounded-sm text-black px-10 py-5 hover:bg-gray-100 transition-all duration-300 font-medium text-lg transform hover:scale-105 hover:shadow-2xl flex items-center gap-3"
          >
            Begin Your Application
            <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
          <button className="border-2 rounded-sm border-gray-600 text-gray-300 px-10 py-5 hover:border-white hover:text-white transition-all duration-300 font-medium text-lg">
            Download Brochure
          </button>
        </div>

        <div className="mt-16 text-sm text-gray-400">
          Next application deadline: <span className="text-white font-medium">December 15, 2025</span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;