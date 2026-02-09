import {Calendar, MapPin} from 'lucide-react';
import { capitalizeFirstLetter } from './utils';

const ListItem = ({event}) => {
    return(
        <div className="flex flex-col box-border bg-[#171717] text-[#333333] font-sans text-[16px] leading-5 border-solid border-[#262626] border-[0.8px] rounded-[8px] w-[387.288px] p-[11.6125px] relative h-full">
            <div className="flex flex-col box-border text-[#333333] font-sans text-[16px] leading-5 w-full h-full">
                <div id="past-event-card" className="flex flex-col flex-nowrap box-border text-white font-['DM_Sans',sans-serif] text-[16px] leading-5 gap-4 w-full h-full p-0 relative">
                    <img 
                        src={event?.image || "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/69707ffa63bcd07fc128bbb2_Governance%20Dinner-p-2000.jpg"} 
                        alt={event?.title}
                        className="block box-border text-white font-['DM_Sans',sans-serif] text-[16px] leading-5 w-full h-[167.812px] max-w-full object-cover object-center overflow-hidden align-middle rounded-[4px] flex-shrink-0"
                    />
                    
                    <div id="div-block-81" className="flex flex-col flex-nowrap box-border text-white font-['DM_Sans',sans-serif] text-[16px] leading-5 gap-[15px] w-full flex-grow">
                        <div id="div-block-82" className="flex flex-col flex-nowrap box-border text-white font-['DM_Sans',sans-serif] text-[16px] leading-5 gap-[7px] w-full">
                            <h4 id="event-title" className="block box-border text-white font-['DM_Sans',sans-serif] text-[20.8px] font-semibold leading-[24.96px] w-full m-0 break-words">
                                {event?.title}
                            </h4>
                            {event?.subtitle && (
                                <h5 id='event-subtitle' className="block box-border text-[#9f9f9f] font-['DM_Sans',sans-serif] text-[16px] font-normal leading-[20.8px] m-0 relative w-full z-[1]">
                                    {event?.subtitle}
                                </h5>
                            )}
                        </div>

                        <div id="div-block-83" className="flex flex-col flex-nowrap box-border text-white font-['DM_Sans',sans-serif] text-[16px] leading-5 gap-3 w-full">
                            <div id="event-date-text" className="flex items-center box-border text-white font-['DM_Sans',sans-serif] text-[16px] leading-5 gap-3 w-full">
                                <div id="icon-10" className="flex items-center justify-center box-border text-[#828181] font-['DM_Sans',sans-serif] text-[16px] leading-5 w-[24px] h-[24px] flex-shrink-0">
                                    <Calendar size={20} color="#828181"/>
                                </div>
                                <h6 id="date-card-event" className='flex items-center box-border text-[#9f9f9f] text-[13.6px] font-normal leading-[17.68px] m-0 relative z-[1]'>
                                    {new Date(event?.eventDate).toLocaleString("en-US", {month: "long", day: "numeric", year:"numeric"})}
                                </h6>
                            </div>
                            
                            <div id="div-block-84" className="flex items-start box-border text-white font-['DM_Sans',sans-serif] text-[16px] leading-5 gap-3 w-full">
                                <div id='icon' className='flex items-center justify-center box-border text-white text-[16px] leading-5 w-[24px] h-[24px] flex-shrink-0 pt-[2px]'>
                                    <MapPin size={20} color="#828181"/>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 flex-1">
                                    <h6 className='inline-block box-border text-[#9f9f9f] text-[13.6px] font-normal leading-[17.68px] m-0'>
                                        {event?.locationType}
                                    </h6>
                                    <h6 className='inline-block box-border text-[#9f9f9f] text-[13.6px] font-normal leading-[17.68px] m-0'>
                                        {event?.location}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tag of type of event */}
                    <div id="collection-list-wrapper-8" className='absolute top-[11.6125px] right-[11.6125px] box-border text-white text-[16px] leading-[20px] block z-10'>
                        <div id="list" className='block box-border text-white text-[16px] leading-[20px]'>
                            <div id="listitem" className='block box-border text-white text-[16px] leading-[20px]'>
                                <h6 id='event-category' className='block box-border bg-[rgba(71,70,70,0.45)] border-[rgb(71,70,70)] border-[0.8px] rounded-[20px] text-white text-[13.6px] font-normal leading-[17.68px] text-center px-[10px] py-[5px] m-0 whitespace-nowrap'>
                                    {capitalizeFirstLetter(event?.type)}
                                </h6>
                            </div>
                        </div>
                    </div>

                    {/* List of tags */}
                    {event?.tags && event.tags.length > 0 && (
                        <div id="w-dyn-list" className='flex box-border text-white text-[16px] leading-[20px] w-full mt-auto'>
                            <div className="flex flex-wrap gap-[6px]">
                                {event.tags.map((tag, index) => (
                                    <h6
                                        key={index}
                                        className="inline-flex items-center justify-center 
                                                    px-[14px] py-[5px] m-0
                                                    text-white text-[13.6px] font-normal leading-[17.68px]
                                                    border-[0.8px] border-[rgb(136,136,136)]
                                                    rounded-[20px]
                                                    whitespace-nowrap"
                                    >
                                        {tag}
                                    </h6>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListItem;