import react from "react";

const PersonCard = ({delegate}) => {
    return(
        <div className="box-border block text-white font-sans text-[16px] w-[383.33px] h-[191.66px] leading-[20px] text-justify">
            <a href={delegate?.socialLinks?.linkedIn} className="flex items-center gap-x-[32px] w-[383.325px] h-[191.663px] aspect-[2/1] bg-transparent border-[0.8px] border-[#d9d9d9] rounded-[12px] px-[32px] py-[15.325px] cursor-pointer transition-shadow duration-300 ease font-['DM_Sans'] text-[#161616] overflow-auto box-border text-justify">
                <div className="relative flex items-center justify-center w-[80px] h-[80px] min-w-[80px] min-h-[80px] bg-[#f3f5fb] rounded-full cursor-pointer overflow-hidden box-border text-[#161616] dmsans-text text-[16px] leading-[20.8px] text-justify">
                    <img src={delegate?.profilePicture} className="box-border block object-cover w-[80px] h-[80px] rounded-full cursor-pointer align-middle overflow-clip border-none"></img>
                </div>
                <div className="box-border block text-[#646262] cursor-pointer dmsans-text text-[16px] font-normal w-[205.725px] h-[86.15px] leading-[20.8px] text-justify">
                    <h5 className="box-border block text-[#161616] cursor-pointer dmsans-text text-[16px] font-semibold h-[20.8px] w-[205.725px] leading-[20.8px] my-[10px] text-left">{delegate?.FullName}</h5>

                    <h6 className="box-border block text-[#646262] cursor-pointer dmsans-text text-[13.6px] font-normal h-[35.35px] w-[205.725px] leading-[17.68px] my-[10px] text-left">{delegate?.title},{delegate?.company}</h6>
                </div>
            </a>
        </div>
    )
}

const DavosDelegates = ({delegates, year}) => {
    return(
        <section className="bg-[#f6f5f5] flex justify-center items-center w-full h-auto min-h-[2626.36px] px-[72px] py-0 box-border text-white font-sans text-[14px] leading-[20px] text-justify">
            <div className="relative z-20 flex flex-col items-center justify-center gap-y-[20px] mx-auto max-w-[1200px] w-full h-auto min-h-[2548.36px] pt-[25.91px] pb-[50px] box-border text-white font-sans text-[16px] leading-[20px] text-justify">
                <div className="flex-1 flex items-center justify-center bg-transparent box-border text-[#161616] dmsans-text font-bold text-[16px] w-[1200px] h-[74.16px] leading-[20px] text-justify">
                    <h2 className="box-border block text-[#161616] dmsans-text text-[36.8px] font-bold h-[44.16px] w-[1200px] leading-[44.16px] mt-[20px] mb-[10px] text-center">Davos {year} Delegates</h2>
                </div>
                <div className="block box-border w-[1200px] h-auto min-h-[2358.29px] text-white font-sans text-[16px] leading-[20px] text-justify">
                    <div className="grid grid-cols-[383.33px_383.34px_383.33px] grid-rows-[repeat(11,191.66px)] gap-[25px] aspect-[2/1] w-[1200px] h-[2358.29px] align-content-start box-border text-white font-sans">
                        {delegates && delegates?.map((delegate)=>(
                            <PersonCard delegate={delegate}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DavosDelegates;