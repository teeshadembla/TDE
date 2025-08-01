import eventsModel from "../Models/eventsModel.js";
import mongoose from "mongoose";

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

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ msg: "Invalid event ID" });
    }

    const deleted = await eventsModel.findByIdAndDelete(eventId);

    if (!deleted) {
      return res.status(404).json({ msg: "Event not found" });
    }

    console.log("Event deleted:", eventId);

    return res.status(200).json({
      msg: "Event deleted successfully",
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

export default {addEvents, getCurrentEvents, updateEvent, deleteEvent}
