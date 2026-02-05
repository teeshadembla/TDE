import react, { useContext, useState, useEffect } from "react";
import { Calendar, MapPin, Users, Link, MessageSquare, Plus, Edit, Trash2, X } from 'lucide-react';
import ListItem from "./EventsList/ListItem";
import DataProvider from "../../context/DataProvider";
import axiosInstance from "../../config/apiConfig";
import {toast }from "react-toastify";

const EventsList = ({pastEvents}) =>{
    return(
        <section id="pastEventsSection" className="block box-border bg-black text-[#333333] font-sans text-[14px] leading-5 px-[55px] w-full h-[3041.05px]">
            <div id="container" className="flex flex-col flex-nowrap items-center justify-start box-border text-[#333333] font-sans text-[16px] leading-5 gap-x-5 gap-y-5 w-[1368.72] h-[3350.07px] px-[49.5px] py-[99px] m-0 max-w-none static">
                
                <div id="event-container-top" className="flex items-end justify-between box-border text-[#333333] font-sans text-[16px] leading-5 w-[1231.88px] h-[44.1625px]
">
                    <h2 id='dark' className="flex items-stretch justify-center box-border text-white font-['DM_Sans',sans-serif] text-[36.8px] font-semibold leading-[44.16px] w-[204.875px] h-[44.1625px] m-0 relative z-[1]">Past Events</h2>
                </div>

                <div id="event-container-bottom" className="block box-border text-[#333333] font-sans text-[16px] leading-5 w-full max-w-[1231.88px]">
                    <div id="w-dyn-list" className="block box-border text-[#333333] font-sans text-[16px] leading-5 w-full">
                        <div id="list" className="grid box-border text-[#333333] font-sans text-[16px] leading-5 gap-x-[35px] gap-y-[35px] grid-cols-[repeat(3,387.288px)] grid-auto-rows-[1fr] w-full">
                            {pastEvents && pastEvents?.map((event) => (
                                <ListItem key={event._id} event={event}/>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default EventsList;