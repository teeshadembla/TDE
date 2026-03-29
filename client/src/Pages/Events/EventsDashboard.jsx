import React, { useState, useEffect, useContext } from 'react';
import { Plus, X } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import DataProvider from '../../context/DataProvider.jsx';
import usePermission from '../../hooks/usePermission.js';
import AddEditModal from '../../components/Events/AddEditModal.jsx';
import EventsList from '../../components/Events/EventsList.jsx';
import axiosInstance from "../../config/apiConfig.js";
import ConfirmDelete from '../../components/Events/ConfirmDelete.jsx';
import UpcomingEventsSection from '../../components/Events/UpcomingEventsSection.jsx';
import SubscribeToNewsletter from '../../components/Events/SubscribeToNewsletter.jsx';
import Footer from '../../components/Footer.jsx';
import { fetchPastEvents, fetchUpcomingEvents } from "./utils.js";
import { toast } from "react-toastify";
import { sortAccordingToDate } from '../../components/Events/EventsList/utils.js';
import VerticalCarouselTailwind from '../../components/Events/VerticalCarouselTailwind.jsx';
import axios from 'axios';

const images = [
  "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685ccced56b6b25f83851b16_Rectangle%20122.png",
  "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685cccdbb27d88d70428e32b_Rectangle%20121.png",
  "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685cccc53b71d6b9666d5133_Rectangle%20120.png",
  "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685cccaa58195b921fa2582e_Rectangle%20119.png",
  "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685ccced56b6b25f83851b16_Rectangle%20122.png",
  "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685cccdbb27d88d70428e32b_Rectangle%20121.png",
  "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685cccc53b71d6b9666d5133_Rectangle%20120.png",
  "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685cccaa58195b921fa2582e_Rectangle%20119.png",
];

const EventsDashboard = () => {
  const { account } = useContext(DataProvider.DataContext);
  const { isSignedIn } = useAuth();

  // Permission-based check — replaces hardcoded role/ID check
  const canManageEvents = usePermission('manage_fellowships');

  const [activeTab, setActiveTab] = useState('upcoming');
  const [showAddForm, setShowAddForm] = useState(false);
  const [file, setFile] = useState();
  const [editingEvent, setEditingEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    registrationLink: '',
    slackLink: '',
    image: '',
    locationType: '',
  });

  const loadEvents = async () => {
    try {
      const data = await fetchUpcomingEvents();
      setUpcomingEvents(data);

      const pastEventsData = await fetchPastEvents();
      sortAccordingToDate(pastEventsData);
      setPastEvents(pastEventsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [account._id]);

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name.includes(".")) {
    const [parent, child] = name.split(".");

    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value,
      },
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const { data } = await axiosInstance.post("/api/events/get-thumbnail-url", {
      fileName: file.name,
      fileSize: file.size,
      thumbnailType: file.type,
      user_id: account._id,
    });


    await axios.put(data.presignedUrl, file,{
      headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setPdfUploadProgress(progress);
        },
    });

    console.log("PDF upload completed");
    const formDataToSend = new FormData();

    // append all text fields
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("location", formData.location);
    formDataToSend.append(
      "eventDate",
      JSON.stringify(formData.eventDate)
    );
    formDataToSend.append("type", formData.type);
    formDataToSend.append("locationType", formData.locationType);
    formDataToSend.append("registrationLink", formData.registrationLink);
    formDataToSend.append("slackLink", formData.slackLink);
    formDataToSend.append("createdBy", account._id);

    if (editingEvent) {
      await axiosInstance.patch(
        `/api/events/updateEvent/${editingEvent._id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } else {
      await axiosInstance.post(
        "/api/events/addEvent",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    }

    resetForm();
    loadEvents();
    toast.success(`Event ${editingEvent ? 'updated' : 'added'} successfully!`);

  } catch (error) {
    console.error('Error saving event:', error);
    toast.error("Some server error occurred, try again in a minute.");
  }
};

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
      registrationLink: event.registrationLink,
      slackLink: event.slackLink,
    });
    setShowAddForm(true);
  };

  const handleDelete = (eventId) => {
    ConfirmDelete(eventId, async () => {
      try {
        await axiosInstance.delete(`/api/events/delete/${eventId}`);
        loadEvents();
        toast.success('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    });
  };

  // Determines if the current user can edit/delete a specific event.
  // They can if they have manage permission OR if they created the event.
  const canManageEvent = (event) =>
    canManageEvents || event.createdBy === account?._id;

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      eventDate: '',
      registrationLink: '',
      slackLink: '',
    });
    setEditingEvent(null);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div id='event-header-wrapper' className='bg-black pb-[100px] relative'>
        <div
          id='event-header'
          className='relative h-[550px] bg-[image:url(https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6858c9cd351d819e7a409c47_hero%20blue%20aurora.png)] bg-[-100px_-10px] overflow-hidden mx-auto px-16'
        >
          <div id='div-block-126' className='flex flex-row items-stretch h-[591.92px] mx-[5%] px-[5%] gap-[25px]'>
            <div
              id='title-wrapper'
              className='relative z-[5] flex flex-col flex-none w-1/2 h-full justify-center text-[rgb(51,51,51)] items-start text-base overflow-visible flex-shrink-1 leading-[20px]'
            >
              <h1
                id='dark-hero'
                className='relative z-[1] h-[155.51px] flex justify-center items-stretch w-auto text-[43.2px] font-semibold text-white leading-[1.2] font-montserrat capitalize-normal'
              >
                <strong>Join the Conversation on Global Impact</strong>
              </h1>
              <h4
                id='Header-subtitle events dark'
                className='relative z-[1] h-[99.85px] flex justify-center items-stretch w-auto font-normal text-white text-[18px] leading-[1.2] font-sans'
              >
                <em
                  id='italic-subheader-events-dark'
                  className='z-[1] flex justify-center items-stretch w-auto font-normal italic text-white-400 text-[21px] leading-[1.2] font-dmsans'
                >
                  Explore our global convenings where systems thinkers and changemakers exchange insights, shape policy, and spark collective action.
                </em>
              </h4>
            </div>
            <div id='infinite-scroll-events' className='box-border z-[1] text-[#333333] block basis-0 grow shrink text-[14px] h-[188.712px] leading-[20px]'>
              <VerticalCarouselTailwind duplicatedImages={images} />
            </div>
          </div>

          <div id='fade-overlay' className="pointer-events-none absolute bottom-0 left-0 h-80 w-full bg-gradient-to-b from-transparent from-[25%] to-black z-[10]" />
        </div>
        <div id='fade-overlay' className="absolute pointer-events-none top-0 left-0 h-80 w-full bg-gradient-to-t from-transparent from-[25%] to-black z-[10]" />
      </div>

      <UpcomingEventsSection upcomingEvents={upcomingEvents} role={account.role} onClick={setShowAddForm}/>
      <EventsList pastEvents={pastEvents} />
      <SubscribeToNewsletter />
      <Footer />{/* 

      Event management UI — uncomment when ready to use.
          canManageEvents and canManageEvent() are already wired up above. */}


        {showAddForm && (
          <AddEditModal
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            formData={formData}
            resetForm={resetForm}
            editingEvent={editingEvent}
            file={file}
            setFile={setFile}
            X={X}
          />
        )}
     
    </div>
  );
};

export default EventsDashboard;