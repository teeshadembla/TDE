// Secondary Publication Card Component
const PublicationBadge = ({ type }) => (
  <div className='text-[#9f9f9f] bg-[#1a1a1a] border border-[#262626] rounded-[99px] flex items-center w-fit h-auto px-4 py-2 font-sans text-sm font-normal leading-[100%] no-underline'>
    {type}
  </div>
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

// Arrow Icon Component
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SecondaryPublicationCard = ({ publication }) => (
  <div className='w-full h-[375.2px]'>
    <div className='flex flex-col bg-[linear-gradient(22deg,#0000,#1b2734),linear-gradient(124deg,#012a5a,#0000)] rounded-2xl justify-between w-full h-full p-6 no-underline'>
      {/* Content */}
      <div className='flex gap-4 items-start flex-col sm:flex-row'>
        {/* Image */}
        <div className='w-full sm:w-[180px] flex-shrink-0'>
          <img 
            className='w-full sm:w-[153.2px] h-auto sm:h-[216.613px] shadow-[0_86px_56px_-32px_#00000059,_-8px_12px_40px_#00000040,_0_24px_60px_-20px_#0003] object-cover' 
            src={publication.image} 
            alt={publication.title}
            loading="lazy"
          />
        </div>
        
        {/* Text Content */}
        <div className='flex flex-col gap-3 flex-1'>
          <PublicationBadge type={publication.type} />
          <h4 className='text-white font-sans text-base font-semibold leading-[130%] no-underline'>
            {publication.title}
          </h4>
          <PublicationMeta author={publication.author} date={publication.date} />
          <p className='text-[#888] font-sans text-sm font-normal leading-[140%] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]'>
            {publication.description}
          </p>
        </div>
      </div>
      <ReadNowButton onClick={() => console.log(`Reading: ${publication.title}`)} />
    </div>
  </div>
);

export default SecondaryPublicationCard;