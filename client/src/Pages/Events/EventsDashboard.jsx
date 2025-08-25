import React, { useState, useEffect, useContext, createContext, act } from 'react';
import { Calendar, MapPin, Users, Link, MessageSquare, Plus, Edit, Trash2, X } from 'lucide-react';
import DataProvider from '../../context/DataProvider.jsx';
import AddEditModal from '../../components/Events/AddEditModal.jsx';
import Tabs from '../../components/Events/Tabs.jsx';
import EventsList from '../../components/Events/EventsList.jsx';
import axiosInstance from "../../config/apiConfig.js";
import ConfirmDelete from '../../components/Events/ConfirmDelete.jsx';
import axios from 'axios';
import {toast} from "react-toastify";


const EventsDashboard = () => {
  const { account } = useContext(DataProvider.DataContext);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    registrationLink: '',
    slackLink: ''
  });
  const [registeredEvents, setRegisteredEvents] = useState({});

  useEffect(() => {
    if (account?._id) {
      fetchEvents();
    }
  }, [activeTab, account]);

  const fetchEvents = async()=>{
        setLoading(true);
        try{
            switch(activeTab){
                case 'upcoming':
                    const response = await axiosInstance.get("/api/events/getCurrentEvents");
                    const fetchedEvents = response.data.events;
                      const updatedStatus = {};
/*                       console.log(`Checking registration for  user: ${account?._id}`);
 */
                      for (const event of fetchedEvents) {
                        try {
                          console.log("This is event id: ", event._id);
                          const res = await axiosInstance.get(`/api/user-event/isExistregistration/${event._id}/${account._id}`);
                          updatedStatus[event._id] = res?.data?.isRegistered || false;
                        } catch (err) {
                          console.error("Error checking registration:", err);
                          updatedStatus[event._id] = false;
                        }
                      }

                      setRegisteredEvents(updatedStatus);

                      const unregisteredEvents = fetchedEvents.filter(
                        event => !updatedStatus[event._id]
                      );
/* 
                    console.log("These are the current events --->",fetchedEvents);
                    console.log("These are the unregistered Events--->",unregisteredEvents); */

                    setEvents(unregisteredEvents);
                    break;
                
                case 'participated':
                    const participateResponse = await axiosInstance.get(`/api/user-event/registrations/${account._id}`);
                    console.log("participate response",participateResponse);
                    const eventList = [];

                    for(const ele of participateResponse?.data?.registeredEvents){
                      if(ele.event){
                        eventList.push(ele.event);
                      }
                    }
                    console.log("These are participated events: ", eventList);
                    setEvents(eventList);
                    break;
                case 'past':
                    const pastEvents = await axiosInstance.get("/api/events/getPastEvents");
                    console.log("These are past events: ", pastEvents.data.events);
                    setEvents(pastEvents.data.events);
                    break;
                default:
                    setEvents([]);
                }
        }catch(err){
            console.log("Error occurred in the frontend while executing functionality for tab switching-->", err);
        }
        setLoading(false);
    }

  //recording input data
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
      const eventData = {
        ...formData,
        createdBy: account._id
      };

      if (editingEvent) {
        // Update event
        const response = await axiosInstance.patch(`/api/events/updateEvent/${editingEvent._id}`, eventData);
        console.log("This is response after editing event---->", response);
        console.log('Updating event:', eventData);
      } else {
        // Add new event
        const response = await axiosInstance.post("/api/events/addEvent", eventData);
        console.log(response);
        
        console.log('Adding new event:', eventData);
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error("Some server error occurred, try again in a minute.");
    }
  };

  const handleEdit = (event) => {
    console.log(event);
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      eventDate: new Date(event.eventDate).toISOString().slice(0, 16),
      registrationLink: event.registrationLink,
      slackLink: event.slackLink
    });
    setShowAddForm(true);
  };

  const handleDelete = (eventId) => {
    ConfirmDelete(eventId, async () => {
        try {
        await axiosInstance.delete(`/api/events/delete/${eventId}`);
        console.log('Deleting event:', eventId);
        fetchEvents();
        toast.success('Event deleted successfully!');
        } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
        }
    });
    };


  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      eventDate: '',
      registrationLink: '',
      slackLink: ''
    });
    setEditingEvent(null);
    setShowAddForm(false);
  };

  const isAdmin = account?.role === 'core' || account?._id === '68811543bfb6788e458bb89b';
  const canManageEvent = (event) => isAdmin || event.createdBy === account?._id;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light tracking-wide">Events Dashboard</h1>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors border border-black"
            >
              <Plus size={16} />
              Add Event
            </button>
          )}
        </div>

        {/* Tabs */}
        <Tabs setActiveTab={setActiveTab} activeTab={activeTab}></Tabs>

        {/* Events List */}
        <EventsList activeTab={activeTab} loading={loading} formatDate={formatDate} canManageEvent={canManageEvent} handleEdit={handleEdit} handleDelete={handleDelete} events={events}></EventsList>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
            <AddEditModal handleInputChange={handleInputChange} handleSubmit={handleSubmit} formData={formData} resetForm={resetForm} editingEvent={editingEvent} X={X}/>
        )}
      </div>
    </div>
  );
};

// Wrap with mock provider for demo
/* const App = () => (
  <MockAccountProvider>
    <EventsDashboard />
  </MockAccountProvider>
);
 */
export default EventsDashboard;