import React from 'react';

const CoreValuesPage = () => {
  const values = [
    {
      title: "Radical Collaboration",
      description: "We connect diverse voices—governments, innovators, and communities—to co-create scalable change.",
      isHighlighted: false
    },
    {
      title: "Sustainability & Equity",
      description: "Our work advances economic systems that center ecological health and fair opportunities for all.",
      isHighlighted: false
    },
    {
      title: "Trust & Transparency",
      description: "We build trust through openness, accountability, and clear, ethical design.",
      isHighlighted: false
    },
    {
      title: "Decentralization & Empowerment",
      description: "By distributing power, we enable inclusive access and collective ownership of digital systems.",
      isHighlighted: false
    },
    {
      title: "Empathy, Integrity, & Passion",
      description: "Our team brings deep care, ethical discipline, and unwavering dedication to every challenge.",
      isHighlighted: false
    }
  ];

  const ValueCard = ({ title, description, isHighlighted }) => (
    <div className={`
      relative p-5 rounded-2xl transition-all duration-300 ease-in-out cursor-pointer
      ${isHighlighted 
        ? 'bg-neutral-800 border-2 border-blue-500' 
        : 'bg-black border-2 border-neutral-700 hover:border-blue-500 hover:bg-neutral-800'
      }
      group
    `}>
      <h3 className="text-white text-xl font-semibold mb-4 leading-tight">
        {title}
      </h3>
      <p className="text-gray-300 text-base leading-relaxed">
        {description}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Our Core Values
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Foundational to shaping a human-centered digital economy
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="lg:col-span-1">
            <ValueCard {...values[0]} />
          </div>
          <div className="lg:col-span-1">
            <ValueCard {...values[1]} />
          </div>
          <div className="lg:col-span-1">
            <ValueCard {...values[2]} />
          </div>
          
          {/* Second row - 2 cards centered */}
          <div className="md:col-span-1 lg:col-start-1 lg:col-end-2">
            <ValueCard {...values[3]} />
          </div>
          <div className="md:col-span-1 lg:col-start-3 lg:col-end-4">
            <ValueCard {...values[4]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreValuesPage;