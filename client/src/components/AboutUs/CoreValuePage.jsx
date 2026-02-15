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
      title:  (<>
      Decentralization &<br />Empowerment
    </>),
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
    <div 
      className={`flex items-center justify-center box-border h-[195px] w-[350px] max-w-[350px] p-[32px] border rounded-[8px] transition-colors duration-[0.4s] ease-[ease] ${
        isHighlighted 
          ? 'bg-neutral-800 border-2 border-blue-500' 
          : 'bg-black border-2 border-neutral-700 hover:border-blue-500 hover:bg-neutral-800'
      }`}
    >
      <div className='flex items-start justify-center flex-col w-full'>
        <div className='mb-4 w-full text-left'>
          <h4 className='text-white text-[20px] dmsans-text font-bold leading-[23.4px] whitespace-nowrap'>
            {title}
          </h4>
        </div>
        <h5 className='text-[rgb(159,159,159)] dmsans-text text-[15px] font-normal leading-[19.5px] text-left w-full'>
          {description}
        </h5>
      </div>
    </div>
  );

  return (
    <>
      <section className='flex justify-center bg-black box-border w-full px-[72px]'>
        <div className='flex items-center justify-center flex-col flex-nowrap box-border w-[1296px] gap-[20px] m-0 pt-[129.6px] pb-[129.6px] max-w-none'>
          <div className='block box-border w-[1200px]'>
            <div className='block box-border relative w-[1200px] max-w-[1200px] mx-0'>
              <div className='block box-border w-[1200px] mb-[64px]'>
                <div className='flex items-center justify-center flex-col box-border relative w-[1200px] max-w-full mx-0 text-center'>
                  <div className='block box-border mb-[16px] text-center'>
                    <h1 className='text-white text-[43.2px] font-bold leading-[47.52px] text-center m-0 whitespace-nowrap'>
                      Our Core Values
                    </h1>
                  </div>

                  <div className='text-[rgb(159,159,159)] dmsans-text text-[20.8px] font-normal leading-[24.96px] text-center'>
                    Foundational to shaping a human-centered digital economy
                  </div>
                </div>
              </div>

              <div className='flex flex-row flex-wrap justify-center box-border w-[1200px] gap-[40px]'>
                {values.map((value, index) => (
                  <ValueCard key={index} {...value} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </>
  );
};

export default CoreValuesPage;