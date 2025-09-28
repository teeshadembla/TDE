import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Globe, BookOpen, Calendar, Award, ArrowRight, Check, X, Star, Play, Pause, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';


const ImpactCard = ({ title, description, image }) => {
  // Default values if no props provided

  return (
    <section className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image Container */}
          <div className="relative order-2 lg:order-1">
            {/* Outer Container with Gray Background */}
            <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8">
              {/* Screen/Monitor Effect */}
              <div className="relative bg-black rounded-2xl overflow-hidden">
                
                <div className="relative">
                  <img 
                    src={image || defaultImage}
                    alt={title || defaultTitle}
                    className="w-full h-64 sm:h-64 lg:h-72 object-cover object-center "
                  />
                  
    
                  
                  
                  {/* Bottom Silhouettes Effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                
              </div>
            </div>
            
            {/* Subtle Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl blur-xl -z-10"></div>
          </div>

          {/* Content Container */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-wide leading-tight">
              {title || defaultTitle}
            </h2>
            
            <p className="text-gray-300 text-lg sm:text-lg lg:text-xl leading-relaxed max-w-2xl">
              {description || defaultDescription}
            </p>
            
          
          </div>
          
        </div>
      </div>
    </section>
  );
};


const BenefitsSection = () => {
  const [hoveredBenefit, setHoveredBenefit] = useState(null);

  const benefits = [
    {
      icon: Globe,
      title: "Global Impact",
      description: "Drive meaningful change through high-level policy initiatives that address critical economic and social challenges across international markets.",
      image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6858c9ce351d819e7a409c4d_milestone2.png"
    },
    {
      icon: Users,
      title: "Elite Network",
      description: "Join an exclusive community of thought leaders, policy makers, and industry innovators shaping the future of global economics.",
      image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686fb2f41be2a24113d69eda_elite%20community.png"
    },
    {
      icon: Award,
      title: "Unparalleled Opportunities",
      description: "Gain access to curated events, advisory opportunities, and thought leadership spaces that accelerate your visibility, growth, and strategic influence.",
      image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685a4ea19ddbf168e9ac9956_image22.png"
    }
  ];

  return (
    <div className='min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center'>
      <div className='flex flex-col'>
        <div className='flex text-center text-[18px] justify-center mb-12 w-[544.338px]'>
          <h4><strong>The Digital Economist's</strong> fellowship is an extraordinary opportunity to make a global impact.</h4>
        </div>
        <div className='flex text-center text-4xl font-semibold font-sans justify-center mb-12 w-[544.338px]'>
          <h2>What You'll Gain as a Fellow</h2>
        </div>
      </div>

      <div>
        {benefits.map((benefit, index) => (
          <div 
            key={index}
          >
           <ImpactCard 
              title={benefit.title} 
              description={benefit.description} 
              image={benefit.image} 
            /> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection;