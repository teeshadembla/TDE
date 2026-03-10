import { UpcomingEventsList } from "./UpcomingEventsList.jsx";

const UpcomingEventsSection = ({upcomingEvents}) => {
    return(
        <div id="upcoming-events" className="bg-white w-full leading-[20px] overflow-visible py-[55px] justify-center">
            <div id="container-upcoming-events" className="flex flex-col flex-nowrap w-full text-[#333] text-sm leading-[20px] box-border justify-center">
                <div id="div-block-84" className="flex justify-center w-full mb-[40px] text-[#161616] text-sm leading-[20px] box-border font-dmsans">
                    <h2 id="heading-93" className="font-sans text-[32.2px] font-bold leading-[38.64px] text-gray-900">Upcoming Events</h2>
                </div>
                <div id="upcoming-event-card" className="flex justify-center w-full text-[#333] text-sm leading-[20px] box-border">
                    <div id="upcoming-event-list-wrapper" className="flex flex-col flex-nowrap justify-center w-full gap-[50px] text-[#333] text-sm leading-[20px] overflow-visible box-border">
                        {upcomingEvents && upcomingEvents.length > 0 ? 
                        <UpcomingEventsList upcomingEvents={upcomingEvents}/>:                         
                        
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

