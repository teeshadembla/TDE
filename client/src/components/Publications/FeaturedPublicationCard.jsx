// Featured Publication Card Component
// Publication Type Badge Component
const PublicationBadge = ({ type }) => (
  <div className='text-[#9f9f9f] bg-[#1a1a1a] border border-[#262626] rounded-[99px] flex items-center w-fit h-auto px-4 py-2 font-sans text-sm font-normal leading-[100%] no-underline'>
    {type}
  </div>
);

// Arrow Icon Component
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// Publication Metadata Component
const PublicationMeta = ({ author, date }) => (
  <div className='flex flex-col gap-1'>
    <div className='flex justify-start gap-x-2'>
      <div className='text-[#9f9f9f] font-sans text-sm font-normal'>Author:</div>
      <div className='text-[#9f9f9f] font-sans text-sm font-normal'>{author}</div>
    </div>
    <div className='flex justify-start gap-x-2'>
      <div className='text-[#9f9f9f] font-sans text-sm font-normal'>Date:</div>
      <div className='text-[#9f9f9f] font-sans text-sm font-normal'>{date}</div>
    </div>
  </div>
);

// Read Now Button Component
const ReadNowButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className='bg-transparent border-0 text-white font-sans text-base font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'
  >
    Read Now
    <ArrowIcon />
  </button>
);


const FeaturedPublicationCard = ({ publication }) => (
  <div className='w-full'>
    <div className='flex flex-col justify-start items-start gap-6 w-full h-full p-6 rounded-2xl bg-[linear-gradient(22deg,#0000,#1b2734),linear-gradient(124deg,#012a5a,#0000)] no-underline'>
      <div className='flex flex-col h-full w-full'>
        <div className='flex flex-col justify-center items-center gap-6 w-full'>
          {/* Image */}
          <div className='h-[353.33px] items-center justify-center w-[248.95px] '>
            <img 
              className='align-center  inline-block  shadow-[0_86px_56px_-32px_#00000059,_-8px_12px_40px_#00000040,_0_24px_60px_-20px_#0003]' 
              src={publication.image} 
              alt={publication.title}
              loading="lazy"
            />
          </div>
          
          {/* Content */}
          <div className='flex flex-col items-start w-full gap-3'>
            <PublicationBadge type={publication.type} />
            <h3 className='text-white font-sans text-lg font-semibold leading-[130%] no-underline'>
              {publication.title}
            </h3>
            <PublicationMeta author={publication.author} date={publication.date} />
            <p className="text-[#888] mb-0 font-['DM_Sans',sans-serif] text-sm font-normal leading-[140%] mt-2">
              {publication.description}
            </p>
          </div>
        </div>
      </div>
      <ReadNowButton onClick={() => console.log(`Reading: ${publication.title}`)} />
    </div>
  </div>
);

export default FeaturedPublicationCard;