import React from 'react';

const cardData = [
  {
    slug: 'digital-policy',
    title: 'Tech Policy and Governance',
    description: 'Reimagines leadership, accountability, and stakeholder participation through evolving governance models for collective resource management in the digital age.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeacbf55bc8064a82fd3_card-fellowship-4.png'
  },
  {
    slug: 'blockchain-digital-assets',
    title: 'Digital Assets & Blockchain',
    description: 'Investigates decentralized technologies, digital ownership, and tokenized economies to enable secure transactions, identity solutions and new value systems.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeacbf55bc8064a82ff7_card-fellowship-1.png'
  },
  {
    slug: 'sustainability',
    title: 'Sustainability in Tech',
    description: 'Explores how the digital economy drives climate action, ecological balance, resource efficiency, and social responsibility through sustainable models and practices.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeac09012a3f260d9fc7_card-fellowship-3.png'
  },
  {
    slug: 'applied-ai',
    title: 'Applied Artificial Intelligence',
    description: 'Examines the real-world impact of AI across sectors, focusing on ethical integration, systemic innovation, and AI\'s role in addressing global challenges',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeac1e32cf7ae2eebb70_card-fellowship.png'
  },
  {
    slug: 'healthcare',
    title: 'Healthcare Innovation',
    description: 'Promotes tech-driven, data-informed health-care innovation to expand access, enhance preventive care, and support equitable, patient-centered systems.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeace239dda7105e926f_card-fellowship-5.png'
  },
];

const ProjectsSection = () => {
  const Card = ({ title, description, image }) => {
    return (
      <div className="relative overflow-hidden rounded-sm shadow-xl group cursor-pointer h-80">
        {/* Background Image with zoom effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-130" 
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        

        {/* Text Content */}
        <div className="relative h-full flex flex-col justify-center p-6">
          {/* Title - animates upward */}
          <h3 className="text-white  dmsans-text text-[18.2px] leading-[21.84px] px-[20px] text-center font-semibold mb-2 transition-transform duration-400 transform group-hover:-translate-y-8">
            {title}
          </h3>
          
          {/* Description - stays in place, only fades in */}
          <p className="text-white text-center mt-10 dmsans-text w-[199px] leading-[18.2px] font-normal text-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            {description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen font-sans antialiased text-gray-800 p-8 md:p-16">
      {/* Header Section */}
      <div className="text-center font-montserrat max-w-4xl mx-auto mb-16 leading-12">
        <h1 className="text-[43.2px] font-bold montserrat-text text-[rgb(16,90,189)]
">
          Center of Excellence
        </h1>
        <h2 className="text-[43.2px] montserrat-text font-bold text-gray-800 mb-6">
          on Human-Centered Global Economy
        </h2>
        <p className="text-[16px] text-[rgb(22,22,22)] text-center dmsans-text leading-tight w-[780px] mt-10 mx-auto">
          <strong className='text-[rgb(22,22,22)]  dmsans-text'>The Digital Economist's Center of Excellence</strong> is where technology meets human values—with purpose. It's a living lab for reimagining economic systems that prioritize people and the planet. By joining, enterprise leaders gain a seat at the table to shape future-defining conversations, guide ethical innovation, and leave behind more than just growth: a legacy.
        </p>
      </div>

      
      {/* Grid Section */}
      <div className="max-w-7xl w-[1200px] h-[273px] mt-[40px] mx-auto flex items-center flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[6px] max-w-7xl h-[273px] mt-[40px]">
          {cardData.map((card, index) => (
            <a href={`/practice/${card.slug}`}><Card
              key={index}
              title={card.title}
              description={card.description}
              image={card.image}
            /></a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;