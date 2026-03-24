import react, { useEffect, useState } from "react";

const RegistrationCard = ({registration}) => {
    const [timeRange, setTimeRange] = useState();
    
    useEffect(()=>{
        const formatTime = () => {
            const startDate = new Date(registration.eventDate.start);
            const endDate = new Date(registration.eventDate.end);

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
    return (
        <div className="bg-[#ffffff] border-[0.8px] border-solid border-[#d9d9d9] rounded-[10px] box-border block text-[#333333] font-sans text-[14px] h-[373.288px] leading-[20px] mx-[10px] max-w-[280px] p-[20px] text-justify width-[280px]"> 
            <div className="flex flex-col items-stretch box-border text-[#333333] font-sans font-semibold text-[14px] h-[331.688px] w-[238.4px] leading-[20px] text-justify">
                <div className="relative flex flex-row box-border text-[#333333] font-sans text-[14px] w-[238.4px] h-[160px] max-h-[160px] max-w-[280px] rounded-[5px] overflow-hidden mb-[5px] leading-[20px] text-justify">
                    <div className="absolute top-0 bottom-0 left-[166.4px] right-0 z-[2] flex flex-col items-start justify-start box-border text-[#333333] font-sans text-[14px] w-[72px] h-[160px] pt-[12px] pr-[12px] leading-[20px] text-justify overflow-hidden">
                        <div className="bg-[#f6f5f5] text-[#333333] block box-border font-sans font-bold text-[14px] w-[60px] h-[26.2px] leading-[20px] pt-[4px] pb-[4px] px-[8px] rounded-t-[8px] rounded-b-0 text-justify">
                            <h5 className="box-border block text-[#161616] font-['DM_Sans',_sans-serif] text-[14px] font-extrabold h-[18.2px] leading-[18.2px] m-0 text-center w-[44px]">{new Date(registration.eventDate.start).toLocaleDateString("en-US", {weekday:"short"})}</h5>
                        </div>
                        <div className="bg-[#004aad] text-[#333333] block box-border font-sans text-[14px] w-[60px] h-[55.5px] leading-[20px] pt-[5px] pb-[5px] px-[8px] rounded-b-[8px] rounded-t-0 text-justify">
                            <h5 className="box-border block text-[#ffffff] font-['DM_Sans',_sans-serif] text-[21px] font-normal h-[27.3px] leading-[27.3px] m-0 text-center w-[44px]">{new Date(registration.eventDate.start).toLocaleDateString("en-US", {day:"numeric"})}</h5>
                            <h5 className="box-border block text-[#ffffff] font-['DM_Sans',_sans-serif] text-[14px] font-normal h-[18.2px] leading-[18.2px] m-0 text-center w-[44px]">{new Date(registration.eventDate.start).toLocaleDateString("en-US", {month:"short"})}</h5>
                        </div>
                    </div>
                    <img src={registration?.image?.url} className="self-center block box-border saturate-[1.5] object-cover w-[280px] h-[238px] max-w-[280px] overflow-clip font-sans text-[14px] text-[#333333] leading-[20px] text-justify align-middle border-none"></img>
                </div>
                <h3 className="box-border block text-[#000000] font-['DM_Sans',_sans-serif] text-[16.8px] font-semibold h-[60.4875px] leading-[20.16px] mt-[20px] mb-[10px] text-left w-[238.4px]">
                    {registration?.title}
                </h3>
                <p className="box-border block text-[#646262] font-['DM_Sans',_sans-serif] text-[14px] font-normal h-[18.2px] leading-[18.2px] mt-0 mb-[20px] text-left w-[238.4px]">{timeRange}</p>
                <a href="#" className="box-border block bg-[#888888] text-[#ffffff] cursor-pointer font-['DM_Sans',_sans-serif] text-[14px] font-normal h-[38px] w-[238.4px] leading-[20px] py-[9px] px-[15px] rounded-[4px] border-none text-center no-underline">Closed</a>
            </div>
        </div>
    )
}

const Registrations =({registrations}) => {
    return(
        <section className="flex flex-col justify-center items-center box-border bg-[#F6F5F5] text-[#333] font-sans text-[14px] leading-[20px] h-[551.925px] w-full pt-[20px] pb-[20px] text-justify">
            <div className="box-border text-[#333333] block font-sans text-[14px] h-[78.6375px] leading-[20px] mx-[120px] max-w-[1200px] text-justify">
                <h2 className="box-border block text-[#333333] font-['DM_Sans',_sans-serif] text-[32.2px] font-bold h-[38.6375px] leading-[38.64px] my-[20px] text-center w-[1200px]">Registrations</h2>
            </div>

            <div className="box-border flex text-[#333333] font-sans text-[14px] h-[373.288px] leading-[20px] mt-[20px] mb-[40px] mx-[120px] max-w-[1200px] w-[1200px] text-justify">
                {registrations && registrations?.map((registration, i)=>(
                    <RegistrationCard registration={registration}/>
                ))}
            </div>
        </section>
    )
}

export default Registrations;