import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Globe, BookOpen, Calendar, Award, ArrowRight, Check, X, Star, Play, Pause, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
const BenefitsSection = () => {
  const [hoveredBenefit, setHoveredBenefit] = useState(null);

  const benefits = [
    {
      icon: Globe,
      title: "Global Impact",
      description: "Drive meaningful change through high-level policy initiatives that address critical economic and social challenges across international markets.",
      highlight: "50+ policy initiatives launched globally",
      color: "from-blue-50 to-blue-100"
    },
    {
      icon: Users,
      title: "Elite Network",
      description: "Join an exclusive community of thought leaders, policy makers, and industry innovators shaping the future of global economics.",
      highlight: "200+ senior executives worldwide",
      color: "from-purple-50 to-purple-100"
    },
    {
      icon: Award,
      title: "Platform Amplification",
      description: "Access premium speaking opportunities, publication platforms, and strategic partnerships to amplify your expertise and influence.",
      highlight: "95% increase in professional visibility",
      color: "from-green-50 to-green-100"
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extralight mb-6">Why Join Our Fellowship</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience transformative growth through our comprehensive program designed for global leaders
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index} 
                className={`relative p-8 rounded-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                  hoveredBenefit === index 
                    ? `bg-gradient-to-br ${benefit.color} shadow-2xl` 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onMouseEnter={() => setHoveredBenefit(index)}
                onMouseLeave={() => setHoveredBenefit(null)}
              >
                <div className="relative z-10">
                  <div className={`inline-block p-4 rounded-full mb-6 transition-all duration-300 ${
                    hoveredBenefit === index ? 'bg-white shadow-lg' : 'bg-white border border-gray-200'
                  }`}>
                    <IconComponent className={`w-8 h-8 transition-colors ${
                      hoveredBenefit === index ? 'text-black' : 'text-gray-700'
                    }`} />
                  </div>
                  
                  <h3 className="text-2xl font-light mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{benefit.description}</p>
                  
                  <div className={`text-sm font-medium transition-opacity ${
                    hoveredBenefit === index ? 'opacity-100' : 'opacity-60'
                  }`}>
                    <Star className="w-4 h-4 inline mr-2" />
                    {benefit.highlight}
                  </div>
                </div>
                
                {hoveredBenefit === index && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;