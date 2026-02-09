import React from 'react';

const cardData = [
  {
    slug: 'digital-policy',
    title: 'Tech Policy and Governance',
    description: 'Develop adaptive, tech-forward policies that bridge innovation, equity, and accountability—shaping economic systems that work for all.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeacbf55bc8064a82fd3_card-fellowship-4.png'
  },
  {
    slug: 'blockchain-digital-assets',
    title: 'Digital Assets & Blockchain',
    description: 'Reimagine trust, transparency, and financial inclusion through decentralized technologies and digital public infrastructure.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeacbf55bc8064a82ff7_card-fellowship-1.png'
  },
  {
    slug: 'sustainability',
    title: 'Sustainability in Tech',
    description: 'Advance regenerative development, climate resilience, and systems that restore the balance between human progress and planetary health.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeac09012a3f260d9fc7_card-fellowship-3.png'
  },
  {
    slug: 'applied-ai',
    title: 'Applied Artificial Intelligence',
    description: 'Explore ethical, open-source, and human-centered applications of AI—shaping how emerging intelligence systems serve people and the planet.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeac1e32cf7ae2eebb70_card-fellowship.png'
  },
  {
    slug: 'healthcare',
    title: 'Healthcare Innovation',
    description: 'Apply digital innovation to expand access, improve outcomes, and build equitable, patient-centered global health systems.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeace239dda7105e926f_card-fellowship-5.png'
  },
];

const ThematicWorkgroups = () => {
  const Card = ({ title, description, image }) => {
    return (
      <div className="relative overflow-hidden rounded-sm shadow-xl group cursor-pointer h-80">
        {/* Background Image with zoom effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-130" 
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        

        {/* Text Content */}
        <div className="relative h-full flex flex-col justify-start p-6">
          {/* Title - animates upward */}
          <h3 className="text-white mt-15  dmsans-text text-[18.2px] leading-[21.84px] px-[20px] text-center font-semibold mb-2 transition-transform duration-400 transform group-hover:-translate-y-8">
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
      <div id='text' className='flex flex-col flex-nowrap mx-auto items-center justify-center box-border text-[rgb(0,74,173)] gap-[32px] font-[Inter,sans-serif] text-[18px] font-bold leading-[23.4px] h-[79.675px] w-[1200px] mb-[50px] static [text-size-adjust:100%] [unicode-bidi:isolate]'>
        <h2 id='light' className='box-border text-[rgb(22,22,22)] block tracking-[2px] dmsans-text text-[41.4px] font-bold leading-[49.68px] h-[49.675px] w-[452.5px] mt-[20px] [text-size-adjust:100%] [unicode-bidi:isolate]'>Thematic Workgroups</h2>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl w-[1200px] h-[273px] mx-auto flex items-center flex-col">
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

export default ThematicWorkgroups;