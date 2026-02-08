import React from 'react';
import FeaturedHeader from './FeaturedHeader.jsx';
import SecondaryPublicationCard from './SecondaryPublicationCard.jsx';
import FeaturedPublicationCard from './FeaturedPublicationCard.jsx';

// Publication data
const publicationsData = {
  featured: {
    id: 1,
    type: 'Research Article',
    title: 'Corporate ESG Needs a Jolt to Its System',
    author: 'Ayodele Emmanuel Akande',
    date: 'July 31, 2025',
    description: 'This chapter explores the historical significance of the Kouroukan Fouga, the ancient constitution of the Mali Empire, and its relevance in addressing contemporary global challenges such as climate...',
    image: 'https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68ad73ed65e2fb3ca49618dc_Screenshot%202025-08-26%20at%2010.44.20.png'
  },
  secondary: [
    {
      id: 2,
      type: 'Industry Insight',
      title: 'Industry Outlook: Blockchain & Digital Assets',
      author: 'Dr. Nikhil Verma',
      date: 'July 21, 2025',
      description: 'This industry outlook report provides a comprehensive analysis of the blockchain and digita...',
      image: 'https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68ad722a80542f235f55d722_Screenshot%202025-08-26%20at%2010.36.43.png'
    },
    {
      id: 3,
      type: 'Research Article',
      title: 'Wisdom of the Kouroukan Fouga for the Modern World',
      author: 'Marie Shabaya',
      date: 'July 16, 2025',
      description: 'This chapter explores the relevance of the Kouroukan Fouga, the ancient Manden Charter...',
      image: 'https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68ad717c82bc084cc54cbcd3_Screenshot%202025-08-26%20at%2010.33.36.png'
    }
  ]
};


// Section Header Component
const SectionHeader = () => (
  <div className='flex flex-col items-center gap-4 w-full'>
    <div className='border-b-4 border-white p-4'>
      <h1 className='text-3xl sm:text-4xl lg:text-5xl font-medium font-sans text-white text-center'>
        Publications
      </h1>
    </div>
  </div>
);

// Section Intro Component
const SectionIntro = () => (
  <div className="block text-center w-full max-w-[600px] text-white px-4">
    <h4 className='mt-2 mb-2 font-semibold text-lg sm:text-xl lg:text-[1.3em] leading-[120%] font-sans'>
      Clear thinking for complex systems.<br/><br/>
      Our publications translate systems complexity into actionable insight—through original research, strategic frameworks, and global roundtable takeaways.
    </h4>
  </div>
);



// Main Publications Content Component
const PublicationContent = () => {
  return(
    <div className='bg-black py-12 sm:py-16 lg:py-[100px] px-4 sm:px-8 lg:px-16 overflow-hidden'>
      {/* Wrapper class for all publications and components */}
      <div className="flex flex-col justify-center items-center gap-8 sm:gap-12 lg:gap-16 max-w-[894px] mx-auto px-0 relative">
        <SectionHeader />

        {/* Tab Content */}
        <div className='w-full'>
          {/* Publication Feature */}
          <div className="flex flex-col justify-center items-center w-full gap-8 sm:gap-12 lg:gap-20 pt-8 sm:pt-12 lg:pt-20 pb-8 sm:pb-12 lg:pb-20">
            <SectionIntro />
            <FeaturedHeader />

            {/* Featured research papers */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full box-border'>
              {/* Featured Publication */}
              <FeaturedPublicationCard publication={publicationsData.featured} />

              {/* Secondary Publications */}
              <div className='flex flex-col gap-6 sm:gap-8 w-full h-[782px]'>
                {publicationsData?.secondary?.map((publication) => (
                  <SecondaryPublicationCard 
                    key={publication.id} 
                    publication={publication} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationContent;