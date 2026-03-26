import react from "react";
import {useNavigate} from "react-router-dom";

const UpcomingListItem = ({event}) => {

    const navigate = useNavigate();
    const date = new Date(event?.eventDate?.start);

    const dayName = date.toLocaleDateString("en-US", { weekday: "short" }); 
    const day = date.getDate(); 
    const month = date.toLocaleDateString("en-US", { month: "short" });

    return(
        <div id="listitem" onClick={()=> navigate(`/events/${event?._id}`)} className="relative cursor-pointer flex flex-col flex-nowrap justify-start rounded-none box-border text-[#333] font-sans text-[14px] leading-[20px] w-[600px] ">
            <div id="card-img" className="block relative rounded-t-[20px] box-border text-[#333] font-sans text-[14px] leading-[20px] h-[250px] w-full object-fill overflow-clip">
                <img src={event?.image?.url} className="block box-border text-[#333] font-sans text-[14px] leading-[20px] h-full w-full max-w-full object-cover object-center overflow-visible align-middle"></img>
                <div id="div-block-42" className="absolute top-0 bottom-[285px] left-0 right-0 z-[3] block box-border text-[#333] font-sans text-[14px] leading-[20px] h-[40px] w-[600px] p-[20px] object-cover overflow-visible">
                    <div id="date-wrapper" className="absolute top-0 bottom-0 right-0 left-[505px] flex flex-col flex-nowrap items-end justify-start box-border text-[#333] font-sans text-[14px] leading-[20px] h-[40px] w-[95px] pr-[20px] pt-[20px]">
                        <div id="calendar-card-top" className="block box-border bg-[#F6F5F5] text-[#333] font-sans text-[14px] leading-[20px] rounded-t-[8px] pt-[8px] pb-[8px] px-[11px] h-[34.2px] w-[75px]">
                            <h5 className="flex items-stretch justify-center relative z-[1] box-border text-[#161616] font-dmsans text-[14px] font-semibold leading-[18.2px] h-[18.2px] w-[53px] m-0">{dayName}</h5>
                        </div>
                        <div id="calendar-card-bottom" className="block box-border bg-[#004AAD] text-[#333] font-sans text-[14px] leading-[20px] rounded-b-[8px] p-[14px] h-[74.7625px] w-[75px]">
                            <h3 className="flex items-stretch justify-center relative z-[1] box-border text-white font-dmsans text-[23.8px] font-normal leading-[28.56px] h-[28.5625px] w-[47px] m-0">{day}</h3>
                            <h5 className="flex items-stretch justify-center relative z-[1] box-border text-white font-dmsans text-[14px] font-normal leading-[18.2px] h-[18.2px] w-[47px] m-0">{month}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div id="side-banner-horizontal" className="flex flex-col items-start justify-center gap-y-[10px] gap-x-[10px] bg-[#F6F5F5] text-white font-dmsans text-[14px] font-normal leading-[18.9px] box-border rounded-b-[20px] pt-[12px] pb-[24px] px-[24px] w-full">
                <div className="block box-border text-white font-dmsans text-[14px] font-normal leading-[18.9px] h-[95.4375px] w-[364.438px]">
                    <h2 id="heading-49" className="block box-border text-[#161616] font-dmsans text-[28px] font-bold leading-[33.6px] h-[67.2px] w-[552px] mt-[20px] mb-[10px] mx-0">{event?.title}</h2>
                    <h4>{event?.subtitle}</h4>
                </div>
                <div className="block box-border text-white font-dmsans text-[14px] font-normal leading-[18.9px] h-[39px] w-[155.938px]">
                    <div id="div-block-87" className="flex flex-col flex-nowrap box-border text-white font-dmsans text-[14px] font-normal leading-[18.9px] h-[40.95px] w-[90.9625px] mt-[-2.725px]">
                        <h5 id="heading-51" className="hidden box-border text-[#646262] font-dmsans text-[14px] font-normal leading-[18.2px] mb-[5px] m-0"></h5>
                        <h6 id="heading-52" className="block box-border text-[#646262] font-dmsans text-[11.9px] font-normal leading-[15.47px] h-[15.475px] w-[90.9625px] mb-[5px] m-0">{event?.locationType}</h6>
                        <h6 id="heading-52" className="block box-border text-[#646262] font-dmsans text-[11.9px] font-normal leading-[15.47px] h-[15.475px] w-[90.9625px] mb-[5px] m-0">{event?.location}</h6>
                    </div>
                </div>
                <button onClick={()=> navigate(`/events/${event?._id}`)} className="flex items-center justify-center box-border bg-[#105ABD] text-white font-dmsans text-[14px] font-normal leading-[18.9px] text-center no-underline cursor-pointer rounded-[4px] px-[14px] py-[9px] h-[36.9px] w-[552px]">More Info</button>
            </div>
        </div>
    )
}

export default UpcomingListItem;