import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Globe, BookOpen, Calendar, Award, ArrowRight, Check, X, Star, Play, Pause, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';


const ImpactCard = ({ title, description, image }) => {
  // Default values if no props provided

  return (
    <section className="bg-black flex items-stretch justify-between gap-x-[40px] gap-y-[80px] box-border text-[#333333] font-['Arial','Helvetica_Neue',Helvetica,sans-serif] text-[16px] h-[347.6px] leading-[20px] mt-0 mb-[100px] p-[26px] [text-size-adjust:100%]  w-[1296.72px] sm:px-6 lg:px-[26px]">
      <div id='div-block-70' className="max-w-7xl flex items-center justify-center basis-auto grow-0 shrink-0 box-border bg-[rgb(23,23,23)] rounded-[8px] text-[#333333] font-['Arial','Helvetica_Neue',Helvetica,sans-serif] text-[16px] h-[252.18px] leading-[20px] p-[37.325px] w-[656.412px] [text-size-adjust:100%] [unicode-bidi:isolate]">
         
        <img 
          src={image || defaultImage}
          alt={title || defaultTitle}
          className="block box-border rounded-[12px] text-[#333333] font-['Arial','Helvetica_Neue',Helvetica,sans-serif] text-[16px] h-[177.53px] leading-[20px] object-cover overflow-clip align-middle w-[577.588px] [text-size-adjust:100%]"
        />
         
        {/* Bottom Silhouettes Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
                
            {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl blur-xl -z-10"></div>

      {/* Content Container */}
      <div id="fellowship-feature-image" className="flex flex-col order-1 lg:order-2 space-y-6 w-[544.763px] h-[252.28] m-5">
        <h2 className="text-3xl sm:text-3xl capitalize lg:text-4xl text-white font-semibold dmsans-text h-[44.163] tracking-wide leading-tight">
          {(title || defaultTitle)?.toUpperCase()}
        </h2>
        
        <p className="text-[rgb(173,173,173)] font-normal text-lg dmsans-text sm:text-lg lg:text-[20.8px] leading-[24.96px] w-[381.33px] ">
          {description || defaultDescription}
        </p>
        
      
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
      description: "Contribute to high-impact initiatives that address today’s most urgent challenges—climate, governance, and digital equity—and help shape a more just and regenerative future.",
      image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6858c9ce351d819e7a409c4d_milestone2.png"
    },
    {
      icon: Users,
      title: "Elite Network",
      description: "Gain access to curated events, advisory opportunities, and thought leadership spaces that accelerate your visibility, growth, and strategic influence.",
      image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686fb2f41be2a24113d69eda_elite%20community.png"
    },
    {
      icon: Award,
      title: "Unparalleled Opportunities",
      description: "Collaborate with a global network of systems thinkers, policy leaders, and innovators committed to long-term impact and collective intelligence.",
      image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685a4ea19ddbf168e9ac9956_image22.png"
    }
  ];

  return (
    <div id='fellowship-advantages' className='min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center'>
      
        <div className='flex flex-col justify-center items-center'>
          <div className='flex text-center font-medium dmsans-text text-[19px] justify-center leading-[24px] mb-12 w-[544.338px]'>
            <h4><strong>The Digital Economist</strong> fellowship is an extraordinary opportunity to make a global impact.</h4>
          </div>
          <div className='flex text-center dmsans-text text-[41px] font-semibold justify-center mb-12 leading-[49px] w-[544.338px]'>
            <h2>What You'll Gain as a Fellow</h2>
          </div>
        </div>

        <div className='my-[64px]'>
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

        
      <div id='div-block-129' className='flex justify-center items-center box-border text-[rgb(51,51,51)] font-[Arial] text-[16px] leading-[20px] h-[38px] w-[1296px] mt-[-40px] [text-size-adjust:100%] [unicode-bidi:isolate]'>
        <a href='https://docsend.com/view/7mi27yzbv5q3hbax' target='_blank' className='bg-[rgb(16,90,189)] text-white rounded-[4px] box-border cursor-pointer block dmsans-text text-[16px] font-normal leading-[20px] h-[38px] w-[184px] px-[15px] py-[9px] no-underline [text-size-adjust:100%]'>
          Access Full Brochure
        </a>
      </div>
    </div>
  );
};

export default BenefitsSection;