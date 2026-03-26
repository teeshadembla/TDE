import react from "react";
import { Calendar } from "lucide-react";

const Listitem = ({workgroup}) => {
    return(
        <div className="block box-border text-[#333] font-sans text-[16px] leading-[20px] h-[32.4px] w-[239.75px] text-justify">
            
                <h5 key={workgroup._id} className="block box-border border border-black rounded-[20px] bg-transparent text-[#161616] font-dmsans text-[16px] font-semibold leading-[20.8px] text-center h-[32.4px] w-[239.75px] px-[8px] py-[5px] m-0">{workgroup.title}</h5>
            
        </div>
    )
}
const EventDetails = ({event}) => {
    return(
        <section className="flex justify-center relative box-border bg-[#F6F5F5] text-[#333] font-sans text-[14px] leading-[20px] w-full h-fit text-justify">
            <div className="flex flex-col items-stretch justify-center gap-[20px] box-border text-[#333] font-sans text-[16px] leading-[20px] h-fit w-[1200px] max-w-none pt-0 pb-[72px] px-[72px] relative z-[2] text-justify">
                <div className="flex items-end box-border text-[#333] font-sans text-[16px] leading-[20px] h-[72.4px] w-full pt-[40px] text-justify">
                    <div className="block flex-1 box-border text-[#333] font-sans text-[16px] leading-[20px] h-[32.4px] w-full text-justify">
                        <div id="workgroup-tags" className="block box-border text-[#333] font-sans text-[16px] leading-[20px] h-[32.4px] w-full text-justify">
                            <div id="list" className="flex flex-row flex-wrap items-stretch gap-[10px] box-border text-[#333] font-sans text-[16px] leading-[20px] h-[32.4px] w-full text-justify">
                                
                                {event?.workgroup && event?.workgroup.map((workgroup)=>(
                                    <Listitem key={workgroup._id} workgroup={workgroup}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-start box-border text-[#333] font-sans text-[16px] leading-[20px] h-fit w-full mt-[60px] text-justify">
                    <div className="flex flex-col flex-1 justify-between box-border text-[#333] font-sans text-[16px] leading-[20px] h-fit w-full text-justify">
                        <div className="flex items-start gap-[15px] box-border text-[#161616] font-sans text-[16px] leading-[20px] h-[24.9625px] w-full text-justify">
                            <div className="flex items-center justify-center box-border text-[#828181] font-sans text-[16px] leading-[20px] h-[24px] w-[24px] text-justify">
                                <Calendar/>
                            </div>
                            <div className="flex flex-col items-start gap-[7px] box-border text-[#161616] font-sans text-[16px] leading-[20px] h-[24.9625px] w-[226.913px] text-justify">
                                <h4 className="flex items-stretch justify-center relative z-[1] box-border text-[#9F9F9F] font-dmsans text-[20.8px] font-normal leading-[24.96px] h-[24.9625px] w-[226.913px] m-0 text-justify">{new Date(event?.eventDate?.start).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric"
                                })}</h4>
                                <h4 className="hidden items-stretch justify-center relative z-[1] box-border text-[#9F9F9F] font-dmsans text-[20.8px] font-normal leading-[24.96px] m-0 text-justify"></h4>
                            </div>
                        </div>
                        
                        {event?.registrationLink ? 
                            <a href={event?.registrationLink} 
                            className="box-border bg-[#105abd] text-white font-dmsans text-[16px] font-normal leading-[20px] text-center cursor-pointer rounded-[4px] px-[15px] py-[9px] w-[40%]">
                                Registraion Form
                            </a> 
                            : 
                            <></>
                        }
                    </div>

                    <div className="block flex-1 items-center justify-center box-border text-[#161616] font-sans text-[16px] leading-[20px] h-fit w-full text-justify">
                        <h4 className="block box-border text-[#161616] font-dmsans text-[16px] font-normal leading-[22.4px] h-fit w-full mb-[20px] mt-0 text-justify">
                            {event?.description}
                        </h4>
                        <a href="#" className="hidden box-border bg-[#105ABD] text-white font-dmsans text-[16px] font-normal leading-[20px] cursor-pointer rounded-[4px] px-[15px] py-[9px]">Register Now</a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EventDetails;