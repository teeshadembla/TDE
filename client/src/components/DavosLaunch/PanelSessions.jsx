import react from "react";
import { useEffect, useState } from "react";

const SpeakerCard = ({speaker, i})=>{
    return(
        <div className="box-border block text-[#333333] font-sans text-[14px] w-[150px] h-[150px] leading-[20px] text-justify">
            <a href={speaker?.linkedIn} className="flex flex-col items-center justify-start bg-white border-[0.8px] border-solid border-[#d9d9d9] rounded-[20px] cursor-pointer box-border text-[#551a8b] dmsans-text text-[14px] w-[150px] h-[150px] pt-[20px] leading-[18.2px] text-justify no-underline"> 
              <img src={speaker?.profilePicture} className="box-border block object-cover rounded-full cursor-pointer w-[60px] h-[60px] mb-[10px] overflow-clip align-middle dmsans-text text-[14px] text-[#551a8b] leading-none text-justify border-none"></img>  
                <div className="box-border block text-black cursor-pointer dmsans-text text-[11.2px] font-semibold h-[18.2px] w-fit leading-none text-center">{speaker.FullName}</div>
                <div className="box-border block text-[#474646] cursor-pointer dmsans-text text-[8.4px] font-normal h-[10.075px] w-[148.4px] leading-[10.08px] px-[10px] text-center">{speaker.title},{speaker.company}</div>
            
            </a>
        </div>
    )
}

const PanelCard= ({panel, i}) =>{
    const [timeRange, setTimeRange] = useState();
        
        useEffect(()=>{
            const formatTime = () => {
                const startDate = new Date(panel.eventDate.start);
                const endDate = new Date(panel.eventDate.end);
    
                // Helper to format "5:00" (no AM/PM)
                const startTime = startDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
                }).replace(/\s?[APM]+/i, ""); // Removes the AM/PM part
    
                // Helper to format "8:00 PM" (with AM/PM)
                const endTime = endDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
                });
    
                const timeRange = `${startTime}-${endTime}`;
                setTimeRange(timeRange);
            }
    
            formatTime();
        },[])
    return(
        <div className="border-t-[0.8px] border-solid border-[#d9d9d9] flex flex-row flex-nowrap gap-[20px] box-border text-[#333333] font-sans text-[14px] w-[1200px] max-w-[1200px] h-[fit] min-h-[435.962px] pt-[60px] pb-[30px] leading-[20px] text-justify">
            <div className="bg-[#000000] rounded-[20px] flex flex-col items-stretch gap-[10px] px-[20px] box-border text-[#333333] font-sans text-[14px] w-[710px] max-w-[1200px] h-[345.163px] leading-[20px] text-justify">
                <div className="flex flex-row items-start justify-start gap-x-[20px] box-border text-[#333333] font-sans text-[14px] w-[670px] h-[228.288px] pt-[20px] px-[20px] pb-0 leading-[20px] text-justify">
                    <img src={panel?.image?.url} className="box-border block object-cover w-[200px] h-[200px] max-w-full overflow-clip pl-[10px] align-middle font-sans text-[14px] text-[#333333] leading-[20px] text-justify border-none"></img>
                    <div className="flex flex-col items-start justify-center gap-y-[15px] box-border text-[#333333] font-sans text-[14px] w-[410px] h-[208.288px] py-[20px] leading-[20px] text-justify">
                        <div className="flex flex-row whitespace-nowrap box-border text-[#f6f5f5] dmsans-text text-[14px] h-[20px] min-w-max leading-[20px] text-justify">
                        {new Date(panel?.eventDate?.start).toLocaleDateString("en-US", {day:"numeric", month:"long", year:"numeric"})} | Panel {i+1}
                        </div>                        <p className="box-border block text-[#f6f5f5] dmsans-text text-[25.2px] font-semibold h-[fit] min-h-[98.2875px] leading-[32.76px] m-0 text-left w-[410px]">{panel?.title}</p>
                        <div className="bg-[#004aad] text-[#f6f5f5] block box-border dmsans-text text-[14px] w-[114.4px] h-[20px] leading-[20px] px-[5px] text-justify">{timeRange}</div>
                    </div>
                </div>

                <div className="flex flex-col gap-y-[10px] bg-transparent box-border text-[#333333] font-sans text-[14px] w-[670px] h-[84.6px] pt-0 px-[20px] pb-[20px] leading-[20px] text-justify">
                    <p className="box-border block text-[#adadad] dmsans-text text-[14px] font-normal h-[54.6px] leading-[18.2px] mt-0 mb-[10px] text-justify w-[630px]">
                        {panel?.description}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-start justify-start gap-y-[15px] bg-[#f6f5f5] rounded-[20px] box-border text-[#333333] font-sans text-[14px] w-[470px] h-[345.163px] leading-[20px] text-justify">
                <div className="box-border block text-[#333333] font-sans font-bold text-[14px] h-[20.16px] w-[76.01px] max-w-[114.57px] leading-[20px] m-0 text-justify">
                    <h3 className="box-border block text-[#000000] dmsans-text text-[16.8px] font-bold h-[20.16px] leading-[20.16px] m-0 text-justify w-[76.01px]">Speakers</h3>
                </div>

                <div className="flex flex-row flex-wrap items-center justify-center gap-[16px] box-border text-[#333333] font-sans text-[14px] w-[470px] h-[310px] leading-[20px] text-justify">
                    <div className="flex items-center justify-center gap-[20px] box-border text-[#333333] font-sans text-[14px] w-[470px] h-[310px] leading-[20px] text-justify">
                        <div className="grid grid-cols-[150px_150px_150px] grid-rows-[150px_150px] items-stretch justify-center gap-[10px] box-border text-[#333333] font-sans text-[14px] w-[470px] h-[310px] leading-[20px] text-justify">
                            {panel?.speakers && panel?.speakers?.map((speaker, i)=>(
                                <SpeakerCard speaker={speaker}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PanelSessions = ({panelSessions}) => {
    return(
        <section className="flex flex-col items-center justify-center gap-y-[30px] bg-[#f6f4f4] box-border text-[#333333] font-sans text-[14px] w-full h-[2069.91px] py-[60px] leading-[20px] text-justify">
            <div className="flex flex-col gap-y-[5px] box-border text-[#333333] font-sans font-bold text-[14px] w-[261.688px] h-[54.6px] leading-[20px] pb-0 text-justify">
                <div className="box-border block text-[#000000] dmsans-text text-[36.4px] font-extrabold h-[54.6px] leading-[54.6px] text-justify w-[261.688px]">Panel Sessions</div>
            </div>

            {panelSessions && panelSessions?.map((panel, i)=>(
                <PanelCard panel={panel} i={i}/>
            ))}
        </section>
    )
}

export default PanelSessions;