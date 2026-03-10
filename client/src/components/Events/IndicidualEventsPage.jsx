import react, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Banner from "../../components/Events/IndividualEventPage/Banner.jsx";
import EventDetails from "../../components/Events/IndividualEventPage/EventDetails.jsx";
import axiosInstance from "../../config/apiConfig";
import SpeakerSection from "./IndividualEventPage/SpeakerSection.jsx";
import SubscribeToNewsletter from "../../components/Events/SubscribeToNewsletter.jsx";
import Footer from "../Footer.jsx"
import EventsList from "./EventsList.jsx";
import { fetchPastEvents } from "../../Pages/Events/utils.js";

const IndividualEventsPage = () => {
    const {id} = useParams();
    const [event, setEvent] = useState({});
    const [pastEvents, setPastEvents] = useState([]);

    useEffect(()=>{
        const fetchEventById = async() => {
            try{
                const response = await axiosInstance.get(`/api/events/getEventById/${id}`);
                setEvent(response?.data?.event);
            }catch(err){
                console.log("This error is occurring while trying to fetch Event on this page--->", err);
            }
        }

        fetchEventById();
    },[])

    useEffect(()=>{
        const loadEvents = async() => {
            const response = await fetchPastEvents();
            setPastEvents(response);
        }

        loadEvents();
    },[])

    return(
        <section className="w-full">
        <Banner image={event?.image?.url} title={event?.title} subtitle={event?.subtitle} locationType={event?.locationType} type={event?.type}/>
        <EventDetails event={event}/>
        {event?.speakers && event?.speakers.length > 0 && <SpeakerSection speakers={event?.speakers}></SpeakerSection>}
        <EventsList pastEvents={pastEvents}/>
        <SubscribeToNewsletter/>
        <Footer/>
        </section>
    )
}

export default IndividualEventsPage;