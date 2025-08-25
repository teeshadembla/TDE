import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Globe, BookOpen, Calendar, Award, ArrowRight, Check, X, Star, Play, Pause, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      position: "Former World Bank Senior Economist",
      organization: "Global Economic Institute",
      quote: "The fellowship provided an unparalleled platform to influence international economic policy while collaborating with the brightest minds in the field.",
      avatar: "SC",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      position: "Chief Innovation Officer",
      organization: "Deutsche Bank",
      quote: "Through this program, I've been able to bridge the gap between traditional finance and emerging technologies on a global scale.",
      avatar: "MR",
      rating: 5
    },
    {
      name: "Prof. Amara Okonkwo",
      position: "Director of Sustainable Development",
      organization: "Oxford Economics",
      quote: "The fellowship's emphasis on sustainable economic models has enabled me to drive meaningful change in policy frameworks worldwide.",
      avatar: "AO",
      rating: 5
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extralight mb-6">Fellow Perspectives</h2>
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <span className="text-sm text-gray-600">
              {isAutoPlaying ? 'Auto-playing' : 'Paused'}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gray-50 rounded-3xl p-12 min-h-[300px] flex items-center">
            <div className="w-full text-center">
              <div className="mb-8">
                <div className="inline-block w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl font-light mb-4 mx-auto">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-2xl md:text-3xl font-light italic text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>
              
              <div>
                <h4 className="text-xl font-medium text-black">{testimonials[activeTestimonial].name}</h4>
                <p className="text-gray-600">{testimonials[activeTestimonial].position}</p>
                <p className="text-sm text-gray-500">{testimonials[activeTestimonial].organization}</p>
              </div>
            </div>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeTestimonial === index ? 'bg-black scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;