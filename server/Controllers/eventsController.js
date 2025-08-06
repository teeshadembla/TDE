import eventsModel from "../Models/eventsModel.js";
import mongoose from "mongoose";
import registrationModel from "../Models/regitrationsModel.js";

// GET: Upcoming Events
const getCurrentEvents = async (req, res) => {
  try {
    const today = new Date();
    const { limit = 10, skip = 0 } = req.query;

    const currentEvents = await eventsModel
      .find({ eventDate: { $gt: today } })
      .sort({ eventDate: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    console.log(" Current events fetched:", currentEvents.length);

    return res.status(200).json({
      msg: "Upcoming events retrieved successfully",
      events: currentEvents,
    });
  } catch (err) {
    console.error(" Error fetching current events:", err);
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

// POST: Create Event
const addEvents = async (req, res) => {
  try {
    const { title, description, location, eventDate, registrationLink, slackLink, createdBy } = req.body;

    if (!title || !description || !location || !eventDate || !registrationLink || !slackLink || !createdBy) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newEvent = new eventsModel({
      title,
      description,
      location,
      eventDate,
      registrationLink,
      slackLink,
      createdBy,
    });

    await newEvent.save();

    console.log(" New event created:", newEvent);

    return res.status(201).json({
      msg: "Event created successfully",
      event: newEvent,
    });
  } catch (err) {
    console.error(" Error creating event:", err);
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

// DELETE: Remove Event by ID
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log("Starting deletion of event:", eventId);

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ msg: "Invalid event ID" });
    }


    const deleted = await eventsModel.findByIdAndDelete(eventId);
    console.log("Deletion done");
    if (!deleted) {
      return res.status(404).json({ msg: "Event not found" });
    }
    console.log("preparing response message");

    let respMsg = "";
    const regDelete = await registrationModel.deleteMany({event: eventId});
    if(!regDelete){
      respMsg = "No registrations were found for this event";
    }else{
      respMsg = "All registrations for the event are also deleted.";
    }
    console.log("Event deleted:", eventId);
    console.log("Response message prepared: ", respMsg);

    return res.status(200).json({
      msg: "Event deleted successfully! "+respMsg,
      deletedId: eventId,
    });
  } catch (err) {
    console.error("Error deleting event:", err);
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

// PATCH: Update Event by ID
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ msg: "Invalid event ID" });
    }

    const updatedEvent = await eventsModel.findByIdAndUpdate(eventId, updates, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ msg: "Event not found" });
    }

    console.log("Event updated:", eventId);

    return res.status(200).json({
      msg: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    console.error(" Error updating event:", err);
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

//GET: past events
const getPastEvents = async (req, res) => {
  try {
    const today = new Date();
    const { limit = 10, skip = 0 } = req.query;

    const pastEvents = await eventsModel
      .find({ eventDate: { $lt: today } })
      .sort({ eventDate: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    console.log(" Current events fetched:", pastEvents.length);

    return res.status(200).json({
      msg: "Upcoming events retrieved successfully",
      events: pastEvents,
    });
  } catch (err) {
    console.error(" Error fetching current events:", err);
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

export default {addEvents, getCurrentEvents, updateEvent, deleteEvent, getPastEvents}
