import axiosInstance from "../../config/apiConfig";

export const fetchUpcomingEvents = async () =>{
    try{
        const upcomingEvents = await axiosInstance.get("/api/events/getCurrentEvents");
        if(!upcomingEvents){
            throw new Error("No upcoming events found");
        }

        return upcomingEvents.data.events;
    }catch(err){
        return {error: err.message || "Error fetching upcoming events"};
    }
}

export const fetchPastEvents = async () =>{
    try{
        const pastEvents = await axiosInstance.get("/api/events/getPastEvents");
        if(!pastEvents){
            throw new Error("No past events found");
        }

        return pastEvents.data.events;
    }catch(err){
        return {error: err.message || "Error fetching past events"};
    }
}