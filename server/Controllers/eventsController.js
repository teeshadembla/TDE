import eventsModel from "../Models/eventsModel.js";
import mongoose from "mongoose";
import registrationModel from "../Models/regitrationsModel.js";
import logger from "../utils/logger.js";

const getCurrentEvents = async (req, res) => {
  try {
    const today = new Date();
    const { limit = 10, skip = 0 } = req.query;

    const currentEvents = await eventsModel
      .find({ eventDate: { $gt: today } })
      .sort({ eventDate: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));


      logger.debug({fetchedCount: currentEvents.length}, "Current events fetched successfully");
    return res.status(200).json({
      msg: "Upcoming events retrieved successfully",
      events: currentEvents,
    });
  } catch (err) {
    logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching current events");
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

const addEvents = async (req, res) => {
  try {
    const { title, description, location, eventDate, registrationLink, slackLink, createdBy } = req.body;

    if (!title || !description || !location || !eventDate || !registrationLink || !slackLink || !createdBy) {
      logger.warn({title, description, location, eventDate, registrationLink, slackLink, createdBy}, "Add event failed: Missing required fields");
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

    logger.debug({eventId: newEvent._id}, "Event created successfully");
    return res.status(201).json({
      msg: "Event created successfully",
      event: newEvent,
    });
  } catch (err) {
    logger.error({errorMsg: err.message, stack: err.stack}, "Error creating new event");
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      logger.warn({eventId}, "Delete event failed: Invalid event ID");
      return res.status(400).json({ msg: "Invalid event ID" });
    }


    const deleted = await eventsModel.findByIdAndDelete(eventId);
    if (!deleted) {
      logger.warn({eventId}, "Delete event failed: Event not found");
      return res.status(404).json({ msg: "Event not found" });
    }

    let respMsg = "";
    const regDelete = await registrationModel.deleteMany({event: eventId});
    respMsg = regDelete.deletedCount > 0 
      ? "All registrations for the event are also deleted."
      : "No registrations were found for this event";

    logger.debug({eventId}, "Event deleted successfully");

    return res.status(200).json({
      msg: "Event deleted successfully! "+respMsg,
      deletedId: eventId,
    });
  } catch (err) {
    logger.error({errorMsg: err.message, stack: err.stack}, "Error deleting event");
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      logger.warn({eventId}, "Update event failed: Invalid event ID");
      return res.status(400).json({ msg: "Invalid event ID" });
    }

    const updatedEvent = await eventsModel.findByIdAndUpdate(eventId, updates, { new: true });

    if (!updatedEvent) {
      logger.warn({eventId}, "Update event failed: Event not found");
      return res.status(404).json({ msg: "Event not found" });
    }

    logger.debug({eventId}, "Event updated successfully");

    return res.status(200).json({
      msg: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    logger.error({errorMsg: err.message, stack: err.stack}, "Error updating event");
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

const getPastEvents = async (req, res) => {
  try {
    const today = new Date();
    const { limit = 10, skip = 0 } = req.query;

    const pastEvents = await eventsModel
      .find({ eventDate: { $lt: today } })
      .sort({ eventDate: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    
      logger.debug({fetchedCount: pastEvents.length}, "Past events fetched successfully");

    return res.status(200).json({
      msg: "Upcoming events retrieved successfully",
      events: pastEvents,
    });
  } catch (err) {

    logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching past events");
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

export default {addEvents, getCurrentEvents, updateEvent, deleteEvent, getPastEvents}
