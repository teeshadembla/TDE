const UpcomingEventsSection = ({upcomingEvents}) => {
    return(
        <div id="upcoming-events" className="bg-white flex items-center justify-content text-[#333] text-sm h-[248.337px] w-full leading-[20px] overflow-hidden p-[55px]">
            <div id="container-upcoming-events" className="flex flex-col items-center justify-center flex-nowrap w-full h-[138.337px] text-[#333] text-sm leading-[20px] box-border">
                <div id="div-block-84" className="flex justify-center w-[990px] h-[68.6375px] max-w-full mb-[29.7px] text-[#161616] text-sm leading-[20px] box-border font-['DM Sans']">
                    <h2 id="heading-93" className="box-border block h-[38.6375px] w-[274.6px] font-sans text-[32.2px] font-bold leading-[38.64px] text-gray-900 mt-5 mb-2.5">Upcoming Events</h2>
                </div>
                <div id="upcoming-event-card" className="flex items-center justify-center w-[990px] h-[40px] text-[#333] text-sm leading-[20px] box-border">
                    <div id="upcoming-event-clist-wrapper" className="flex flex-col flex-nowrap w-[210.65px] h-[40px] gap-[50px] text-[#333] text-sm leading-[20px] overflow-hidden box-border">
                        {upcomingEvents && upcomingEvents.length > 0 ? 
                        <></>:                         
                        
                        <div id="w-dyn-empty" className="block w-[210.65px] h-[40px] bg-[#ddd] p-[10px] text-[#333] text-sm leading-[20px] box-border">
                            <div id="coming-soon" className="box-border block h-5 w-[190.65px] font-sans text-sm leading-5 text-center text-gray-400 whitespace-pre-wrap">Stay Tuned For Our Next Event</div>
                        </div>
}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpcomingEventsSection;

