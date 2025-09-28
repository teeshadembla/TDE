import React from 'react';

const cardData = [
  {
    slug: 'digital-policy',
    title: 'Policy',
    description: 'Where innovation meets public good-crafting ethical inclusive tech regulations for a just digital future.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeacbf55bc8064a82fd3_card-fellowship-4.png'
  },
  {
    slug: 'blockchain-digital-assets',
    title: 'Blockchain & Digital Assets',
    description: 'Unlocking decentralized systems for secure identity, ownership, and next-gen economic value.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeacbf55bc8064a82ff7_card-fellowship-1.png'
  },
  {
    slug: 'sustainability',
    title: 'Sustainability',
    description: 'Designing digital tools and models that serve climate action, equity, and long-term resilience.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeac09012a3f260d9fc7_card-fellowship-3.png'
  },
  {
    slug: 'applied-ai',
    title: 'Applied AI',
    description: 'Embedding AI where it matters-responsibly, systemically and in service of global well being.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeac1e32cf7ae2eebb70_card-fellowship.png'
  },
  {
    slug: 'governance',
    title: 'Governance',
    description: 'Redefining power and accountability for collective decision making in complex, digital systems.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeacd7301c28f3e25f1f_card-fellowship-2.png'
  },
  {
    slug: 'healthcare',
    title: 'Healthcare',
    description: 'Advancing equitable, data-driven health systems powered by human-centered innovation.',
    image: 'https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685bbeace239dda7105e926f_card-fellowship-5.png'
  },
];

const ThematicWorkgroups = () => {
  const Card = ({ title, description, image }) => {
    return (
      <div className="relative overflow-hidden rounded-sm shadow-xl group cursor-pointer h-80 transition-transform transform hover:scale-105">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-300" 
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        
       <div className="absolute inset-0 bg-gradient-to-bl from-black/80 to-black/0 group-hover:bg-black/60 transition-all duration-300"></div>

        {/* Text Content */}
        <div className="relative h-full flex flex-col justify-end p-6">
          <div className="transition-all duration-300 transform group-hover:-translate-y-4">
            <h3 className="text-white text-2xl flex justify-center font-medium mb-2">{title}</h3>
            <p className="text-gray-300 text-center flex justify-center items-center mt-10 text-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen font-sans antialiased text-gray-800 p-8 md:p-16">
      <div className='font-medium text-3xl md:text-4xl text-center mb-12 text-sans text-black'>
        <h2>Thematic Workgroups</h2>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto">
        <h3 className="text-xl md:text-2xl text-gray-600 mb-6 font-semibold">
          Discover our six practice areas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
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