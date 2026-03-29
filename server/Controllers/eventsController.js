import eventsModel from "../Models/eventsModel.js";
import mongoose from "mongoose";
import registrationModel from "../Models/regitrationsModel.js";
import logger from "../utils/logger.js";
import userModel from "../Models/userModel.js";
import generatePresignedUrl from "../utils/s3presigned.js";
import { generateEmbedding } from "../scripts/embeddings/utils/embedding.js";

const getCurrentEvents = async (req, res) => {
  try {
    const today = new Date();

    const currentEvents = await eventsModel
      .find({
        $or: [
          { "eventDate.start": { $gte: today } },
          { "eventDate.end": { $gte: today } }
        ]
      })
      .sort({ "eventDate.start": 1 })


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

const getPresignedThumbnailUrl = async (req, res) => {
  try {
    const { fileName, thumbnailType, fileSize, user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    if (!fileName || !fileSize || !thumbnailType) {
      return res.status(400).json({
        success: false,
        message: "fileName, fileSize, thumbnailType are required",
      });
    }

    if (!thumbnailType.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail must be an image file",
      });
    }

    // ✅ ALWAYS use thumbnailFileName
    const fileExtension = fileName.split(".").pop();
    const thumbnailFileName = `${Date.now()}-${fileName.replace(`.${fileExtension}`, "")}.jpg`;

    const {
      presignedUrl,
      fileUrl,
      key,
    } = await generatePresignedUrl(
      process.env.AWS_BUCKET_NAME_EVENT,
      user_id,
      thumbnailFileName,
      thumbnailType,
      "thumbnails", // ✅ folder
      true
    );

    return res.status(200).json({
      success: true,
      presignedUrl,
      fileUrl,
      key,
    });

  } catch (err) {
    logger.error({
      errorMsg: err.message,
      stack: err.stack,
    }, "Error generating thumbnail presigned URL");

    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const addEvents = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      registrationLink,
      slackLink,
      createdBy,
      imageUrl,
      imageKey,
      type
    } = req.body;

    const eventDate = JSON.parse(req.body.eventDate);

    if (
      !title ||
      !description ||
      !location ||
      !eventDate ||/* 
      !registrationLink ||
      !slackLink || */
      !createdBy,
      !type
    ) {
      return res.status(400).json({
        msg: "All required fields must be provided",
      });
    }

    const newEvent = new eventsModel({
      title,
      description,
      location,
      eventDate,
      registrationLink,
      slackLink,
      createdBy,
      type,

      // ✅ Save image correctly
      image: {
        url: imageUrl || undefined,
        key: imageKey || undefined,
      },
    });

    const embeddingText = `
      ${title}
      ${description || ''}
      ${req.body.tags?.join(' ') || ''}
    `.trim();

    const embedding = await generateEmbedding(embeddingText);
    if (embedding) {
      newEvent.embedding = embedding;
    }

    await newEvent.save();

    return res.status(201).json({
      msg: "Event created successfully",
      event: newEvent,
    });

  } catch (err) {
    logger.error({
      errorMsg: err.message,
      stack: err.stack,
    }, "Error creating new event");

    return res.status(500).json({
      msg: "Internal server error",
      error: err.message,
    });
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

    const pastEvents = await eventsModel
      .find({
        $or: [
          { "eventDate.end": { $lt: today } },
          {
            "eventDate.end": null,
            "eventDate.start": { $lt: today }
          }
        ]
      })
      .sort({ "eventDate.start": -1 })
      .populate("workgroup", "title")

    
      logger.debug({fetchedCount: pastEvents.length}, "Past events fetched successfully");

    return res.status(200).json({
      msg: "Past events retrieved successfully",
      events: pastEvents,
    });
  } catch (err) {

    logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching past events");
    return res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

const getEventById = async(req, res) => {
  try{  
    const {id} = req.params;

    console.log("This is the id we are trying to fetch event for--->", id);
    const event = await eventsModel.findById(id).populate("workgroup", "title").populate("speakers");
    console.log("Event has been fetch--->", event);

    if(!event){
      return res.status(400).json({msg: "Event with this id not found"});
    }

    return res.status(200).json({msg: "Event has been fetched successfully", event: event});
  }catch(err){
    return res.status(500).json({msg: "Internal Server error", error: err});
  }
}

const getDelegatesByEvent = async(req, res) => {
  try{
    const {id} = req.params;

    const delegates = await userModel.find({eventsParticipated: id});
    
    return res.status(200).json({msg: "Delegated fetched successfully", delegates: delegates});
  }catch(err){
    console.log("This error is occuring while trying to fetch all delegates of event-->", err);
    return res.status(500).json({msg:"Internal Server Error", err:err});
  }
}

export default {addEvents, getCurrentEvents, updateEvent, deleteEvent, getPastEvents, getEventById, getDelegatesByEvent,getPresignedThumbnailUrl}
