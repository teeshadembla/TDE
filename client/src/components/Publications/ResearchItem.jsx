import react from 'react';

const ResearchItem = ({paper,}) =>{
    return(
        <div id='listitem' className='w-[592px] h-[333px]'>
            <div id='publication-card' className='flex flex-start items-start w-[592px] h-[333px] p-6 gap-x-6 gap-y-6 bg-[#1c1c1c] hover:bg-neutral-800 border-2 border-[#262626] rounded-[8px] no-underline'>
               
                <img src={paper?.thumbnailUrl} className="flex items-center justify-center box-border cursor-pointer text-[#551A8B] font-['DM_Sans',sans-serif] text-[14px] font-normal leading-[18.2px] h-[229.462px] w-[162.238px] max-w-full m-0 px-0 overflow-clip align-middle shadow-[rgba(0,0,0,0.35)_0px_86px_56px_-32px,rgba(0,0,0,0.25)_-8px_12px_40px_0px,rgba(0,0,0,0.2)_0px_24px_60px_-20px]"></img>
              
                <div id='publication-card-content' className='flex flex-col justify-start items-start gap-4'>
                    <div id='publication-id-tag' className='w-fit h-[31.6px] text-[#9f9f9f] bg-[#1a1a1a] border border-[#262626] rounded-full flex justify-center items-center px-4 py-2 font-inter font-normal leading-[100%] no-underline '>{paper?.documentType}</div>
                    <div id='publication-title' className='text-[#fff]] font-inter text-[16px] font-semibold leading-[130%] no-underline'>{paper?.title}</div>

                    <div id='div-block-38' className='flex flex-col gap-1'>
                        <div className='flex justify-start gap-2'> 
                            <div className='text-[#9f9f9f] font-normal font-sans'>Author:</div>
                            <div className='text-[#9f9f9f] font-normal font-sans'>
                                {paper?.Authors?.map((author, index) => (
                                    <span key={index}>{author.FullName}</span>
                                    ))}
                            </div>
                        </div>
                        <div className='flex justify-start gap-2'>
                              <div className='text-[#9f9f9f] font-normal font-sans'>Date:</div>
                            <div className='text-[#9f9f9f] font-normal font-sans'>
                                {new Date(paper?.publishingDate).toLocaleDateString("en-US", {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResearchItem;