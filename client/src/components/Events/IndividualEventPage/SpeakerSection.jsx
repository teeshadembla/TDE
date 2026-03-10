import react from "react";

const SpeakerItem = (speaker) => {
    return(
        <div className="block box-border text-white font-sans text-[16px] leading-[20px] h-[191.663px] w-[383.325px]">
            <a href={speaker?.socialLinks?.LinkedIn} className="flex items-center gap-[32px] box-border border border-[#D9D9D9] rounded-[12px] bg-transparent text-[#161616] font-dmsans text-[16px] font-normal leading-[20.8px] h-[191.663px] w-[383.325px] max-w-full px-[32px] py-[15.325px] overflow-auto cursor-pointer transition-[box-shadow] duration-[0.3s] ease">
                <div className="flex items-center justify-center box-border bg-[#F3F5FB] text-[#161616] font-dmsans text-[16px] font-normal leading-[20.8px] h-[80px] w-[80px] min-h-[80px] min-w-[80px] rounded-[100px] overflow-hidden relative cursor-pointer text-justify">
                    <img src={speaker?.profilePicture} className="block box-border text-[#161616] font-dmsans text-[16px] font-normal leading-[20.8px] h-[80px] w-[80px] max-w-full object-cover overflow-clip align-middle cursor-pointer text-justify"></img>
                </div>
                <div className="block box-border text-[#646262] font-dmsans text-[16px] font-normal leading-[20.8px] h-[68.475px] w-[172.625px] cursor-pointer text-justify">
                    <h5 className="block box-border text-[#646262] font-dmsans text-[13.6px] font-normal leading-[17.68px] h-[17.675px] w-[172.625px] my-[10px] cursor-pointer text-left">{speaker?.FullName}</h5>
                    <h6 className="block box-border text-[#646262] font-dmsans text-[13.6px] font-normal leading-[17.68px] h-[17.675px] w-[172.625px] my-[10px] cursor-pointer text-left">{speaker?.title},{speaker?.department},{speaker?.organization}</h6>  
                </div>
            </a>
        </div>
    )
}


const SpeakerSection = ({speakers}) => {
    return(
        <section className="block box-border bg-[#F6F5F5] text-white font-sans text-[14px] leading-[20px] h-[790.075px] w-full px-[72px] text-justify">
            <div className="relative z-[2] flex flex-col items-center justify-center gap-[20px] box-border text-white font-sans text-[16px] leading-[20px] h-[790.075px] w-[1200px] max-w-[1200px] mt-0 mb-0 mx-[48px] pt-[25.9125px] pb-[50px] px-0 text-justify">
                <div className="flex flex-col gap-[40px] box-border text-white font-sans text-[16px] leading-[20px] h-[714.162px] w-[1200px] text-justify">
                    <div className="block flex-1 items-center justify-center box-border text-[#161616] font-sans text-[16px] leading-[20px] h-[74.1625px] w-[1200px] text-justify">
                        <h2 className="block box-border text-[#161616] font-dmsans text-[36.8px] font-bold leading-[44.16px] h-[44.1625px] w-[1200px] mt-[20px] mb-[10px] mx-0 text-justify">Speakers</h2>
                    </div>
                    <div className="block box-border text-white font-sans text-[16px] leading-[20px] h-[600px] w-[1200px] text-justify">
                        <div id="list" className="grid content-start box-border text-white font-sans text-[16px] leading-[20px] h-[600px] w-[1200px] grid-cols-[383.325px_383.337px_383.325px] grid-rows-[191.663px_191.663px] gap-x-[25px] gap-y-[25px]">
                            {speakers && speakers.map((speaker)=>(
                                <SpeakerItem speaker={speaker}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <section className="hidden box-border text-white font-sans text-[14px] leading-[20px] pb-[40px] text-justify">

            </section>
        </section>
    )
}

export default SpeakerSection;