import { Card } from '@mui/material';
import React from 'react';

// Reusable Card Component
const ThinkDoTankCard = ({ image, title, description, className = "" }) => {
  return (
    <div id='blog-card-outline' className={`bg-neutral-800 border-[0.5px] border-neutral-500 rounded-sm overflow-hidden group bg-[linear-gradient(135deg,rgb(0,74,173),rgb(0,0,0))]  transition-all duration-300 ${className}`}>
      {/* Image Container */}
      <div id='blog-image' className="relative h-44 sm:h-44 md:h-52 lg:h-60 xl:h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      {/* Content Container */}
      <div id='blog-content' className="p-4 sm:p-5 md:p-6 lg:p-8">
        <div id="div-block-78">

            <h3 id='card-title-1' className="text-xl sm:text-xl md:text-2xl lg:text-[27.2px] font-bold dmsans-text text-white mb-2 sm:mb-2 md:mb-3 lg:mb-4">
              {title}
            </h3>
            
            {/* Decorative Line */}
            <div id='div-block-55' className="w-12 sm:w-16 md:w-76 lg:w-84 h-[0.5px] bg-[rgb(173,173,173)] mb-3 sm:mb-4 md:mb-5 lg:mb-6" />

        </div>
        
        
        <p id='paragraph-9' className="text-sm sm:text-base md:text-lg lg:text-[16px] dmsans-text text-white leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

// Main Think-Do-Tank Section Component
const ThinkDoTankSection = () => {
  const cardData = [
    {
      image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68aa3017d9cb05f8b18ea77d_Architects%20Meeting%20Event%20Art-p-500.webp",
      title: "Build Knowledge",
      description: "We turn bold ideas into grounded strategies. Our research-driven insights help you navigate complexity and shape what’s next. As a partner, you gain access to our Center of Excellence—your hub for real-time, human-centered intelligence."
    },
    {
      image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68aa3017e24f9d20775aaad2_Several%20Speakers%20on%20Stage-p-500.webp",
      title: "Convene Experts",
      description: "We bring the right minds to your mission. From global visionaries to domain specialists, we curate expert networks and deliver personalized support through a dedicated engagement team—so you’re never building alone."
    },
    {
      image: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68aa308a18fb9e7e7d31fbe5_Silhouettes%20of%20People%20in%20Business-p-500.webp",
      title: "Establish Leadership",
      description: "Lead with purpose—and results. We help you activate cutting-edge technologies and economic models to scale impact, drive systems change, and advance the well-being of both people and the planet."
    }
  ];

  return (
    <>
    <div id="how-we-do" className='block box-border bg-black text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full h-[1000.98px] pt-[40px] px-0 pb-0 mt-0'>
      <div id="think-tank" className='flex justify-center box-border bg-black text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full  h-[191.538px] mt-[40px] relative z-[2]'>
        <div id="feature-title-home" className='flex flex-col flex-nowrap items-center justify-start box-border text-white font-[Arial] text-[18px] leading-[20px] w-full h-[141.538px] mb-[50px] mx-0 gap-x-[30px] gap-y-[30px] text-center'>
          <h4 id='dark' className='flex items-stretch justify-center box-border text-[#9f9f9f] dmsans-text text-[23.4px] font-normal leading-[28.08px] w-[361.138px] h-[28.075px] m-0 relative z-[1] text-center capitalize'>Scientific rigor meets moonshots</h4>
          <h1 id='heading-73' className='block box-border text-white montserrat-text text-[48.6px] font-bold leading-[53.46px] w-[882.812px] h-[53.4625px] mt-[20px] mb-[10px] mx-0 text-center'>
            We are your Think
            <span className="text-blue-500">—and Do—</span>
            Tank.
          </h1>
        </div>
      </div>

      <div id="homepage-content" className='flex flex-col flex-nowrap box-border bg-black text-[#333333] font-[Arial] text-[18px] leading-[20px] w-full h-[871.438px] pt-[50px] pb-[200px] px-[72px] mt-0 mb-0 gap-x-[120px] gap-y-[120px] overflow-hidden top-[180px] z-[0]'>
        <div id="think-tank" className='flex flex-col flex-nowrap items-center justify-start box-border bg-black text-[#333333] font-[Arial] text-[16px] leading-[20px] w-full h-[491.837px] mt-0 mb-[129.6px] pt-[129.6px] pb-[129.6px] px-0 gap-x-[20px] gap-y-[20px]'>
          <div id="grid-three-column-homepage" className='grid box-border text-[#333333] font-[Arial] text-[16px] leading-[20px] w-[1200px] h-[352.638px] mt-[-120px] grid-cols-[384px_384px_384px] grid-rows-[537.562px] auto-cols-[1fr] gap-x-[2%] gap-y-[2%]'>
            {cardData.map((card, index) =>(
              <ThinkDoTankCard image={card.image} title={card.title} description={card.description} key={index} />
            ))}
          </div>
        </div>
      </div>

      
    </div>


    </>
  );
};

export default ThinkDoTankSection;