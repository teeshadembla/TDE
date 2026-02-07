import React from 'react';

// Reusable Card Component
const ThinkDoTankCard = ({ image, title, description, className = "" }) => {
  return (
    <div className={`bg-neutral-800 border-[0.5px] border-neutral-500 rounded-sm overflow-hidden group hover:transform hover:scale-105 transition-all duration-300 ${className}`}>
      {/* Image Container */}
      <div className="relative h-44 sm:h-44 md:h-52 lg:h-60 xl:h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
      </div>
      
      {/* Content Container */}
      <div className="p-4 sm:p-5 md:p-6 lg:p-8">
        <h3 className="text-xl sm:text-xl md:text-2xl lsg:text-3xl font-bold font-monserrat text-white mb-2 sm:mb-2 md:mb-3 lg:mb-4">
          {title}
        </h3>
        
        {/* Decorative Line */}
        <div className="w-12 sm:w-16 md:w-76 lg:w-84 h-0.5 bg-neutral-100 mb-3 sm:mb-4 md:mb-5 lg:mb-6" />
        
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-montserrat text-gray-300 leading-relaxed">
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
    <section className="bg-black min-h-screen py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-32">
          {/* Subtitle */}
          <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-4 sm:mb-6 md:mb-8">
            Scientific Rigor Meets Moonshots
          </p>
          
          {/* Main Title */}
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-sans text-white leading-tight">
            We are your Think
            <span className="text-blue-500">—and Do—</span>
            Tank.
          </h1>
        </div>

        {/* Cards Grid */}
        <div className="ml-10 sm:ml-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 md:gap-8 lg:gap-8 xl:gap-8">
          {cardData.map((card, index) => (
            <ThinkDoTankCard
              key={index}
              image={card.image}
              title={card.title}
              description={card.description}
              className=""
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThinkDoTankSection;