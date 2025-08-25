import react, { useContext, useState, useEffect } from "react";
import { Calendar, MapPin, Users, Link, MessageSquare, Plus, Edit, Trash2, X } from 'lucide-react';
import DataProvider from "../../context/DataProvider";
import axiosInstance from "../../config/apiConfig";
import {toast }from "react-toastify";

const EventsList = ({formatDate, canManageEvent, handleEdit, handleDelete, events, loading, activeTab}) =>{
    const {account} = useContext(DataProvider.DataContext);
    const [registeredEvents, setRegisteredEvents] = useState({}); 
    const [registrationCounts, setRegistrationCounts] = useState({});

    useEffect(() => {
        const fetchRegistrations = async () => {
        
        const updatedStatus = {};
        for (const event of events) {
            try {
            const res = await axiosInstance.get(`/api/user-event/isExistregistration/${event._id}/${account._id}`);
            updatedStatus[event._id] = res?.data?.isRegistered || false;
            } catch (err) {
            console.error("Error checking registration:", err);
            updatedStatus[event._id] = false;
            }
        }

        setRegisteredEvents(updatedStatus);
        };

        
        const fetchRegistrationCounts = async () => {
        try {
            const res = await axiosInstance.get("/api/user-event/registrationCounts");
            setRegistrationCounts(res.data.registrationCounts);
        } catch (err) {
            console.error("Error fetching registration counts:", err);
        }
        };
        
        if (account?._id && events.length > 0) {
            fetchRegistrations();
            fetchRegistrationCounts();
        }
    }, [account, events]);



      const handleRegistration = async (eventId, userId) => {
        try {
        const response = await axiosInstance.post("/api/user-event/register", { eventId, userId });
        if (response.status === 200) {
            toast.success(response.data.msg);
            setRegisteredEvents((prev) => ({ ...prev, [eventId]: true }));
        } else {
            toast.warn(response.data.msg);
        }
        } catch (err) {
        if (err?.response?.status === 409) {
            toast.info(err?.response?.data?.msg || "User has already registered for this event");
        } else {
            toast.error(err?.response?.data?.msg || "Error while registering");
        }
        }
    };

    const handleUnregistration = async(eventId, userId) =>{
        try{
            const response = await axiosInstance.delete(`/api/user-event/unregister/${eventId}/${userId}`);
            const message = response?.data?.msg;

            if(response.status===200){
                toast.success(message);
                setRegisteredEvents((prev) => ({ ...prev, [eventId]: false }));
            }else{
                toast.info(message);
            }
        }catch(err){
            const errMsg = err?.response?.data?.msg;

            if(err.response.status===404){
                toast.info(errMsg);
            }else{
                toast.error(errMsg)
            }
            console.error("Error in handleUnregistration:", err);
        }
    }

    return(
        <>
            {loading ? (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
            ) : (
            <div className="grid gap-6">
                {events.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No events found for this category.
                </div>
                ) : (
                events.map((event) => (
                    <div
                    key={event._id}
                    className="border border-gray-200 hover:border-gray-300 transition-colors p-6"
                    >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                        <h3 className="text-xl font-medium mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                            <Calendar size={16} />
                            {formatDate(event.eventDate)}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                            <MapPin size={16} />
                            {event.location}
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                            <Users size={16} />
                            {
                                registrationCounts[event._id] || 0
                            } registered
                            </div>
                            <div className="flex items-center gap-2">
                            {(activeTab==="upcoming" || activeTab==="participated") &&
                                <h2
                                className={`cursor-pointer font-semibold ${registeredEvents[event._id] ? 'text-red-600' : 'text-green-600'}`}

                                onClick={() =>
                                    registeredEvents[event._id]
                                    ? handleUnregistration(event._id, account._id)
                                    : handleRegistration(event._id, account._id)
                                }
                                >
                                {registeredEvents[event._id] ? "Unregister" : "Register"}
                                </h2>
                            }
                            <span className="mx-2">•</span>
                            <MessageSquare size={16} />
                            <a
                                href={event.slackLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:underline"
                            >
                                Slack
                            </a>
                            </div>
                        </div>
                        </div>

                        {canManageEvent(event) && (
                        <div className="flex gap-2 ml-4">
                            <button
                            onClick={() => handleEdit(event)}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                            title="Edit event"
                            >
                            <Edit size={16} />
                            </button>
                            <button
                            onClick={() => handleDelete(event._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-colors"
                            title="Delete event"
                            >
                            <Trash2 size={16} />
                            </button>
                        </div>
                        )}
                    </div>
                    </div>
                ))
                )}
            </div>
            )}
        </>
    )
}

export default EventsList;