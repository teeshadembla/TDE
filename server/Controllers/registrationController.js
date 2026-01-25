import registrationModel from "../Models/regitrationsModel.js";
import { registrationValidationSchema } from "../SchemaValidation/registrationValidationSchema.js";
import { logger } from "../utils/logger.js";
const registerUser = async (req, res) => {
  try {
    // Joi validation
    const { error } = registrationValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: "Invalid input", error: error.details });
    }

    const { eventId, userId } = req.body;

    // Create registration
    const newRegistration = new registrationModel({ event: eventId, user: userId });

    await newRegistration.save();

    return res.status(200).json({ msg: "New registration successfully saved" });

  } catch (err) {
    // Duplicate error handling
    if (err.code === 11000) {
      logger.warn({eventId: req.body.eventId, userId: req.body.userId}, "User already registered for this event");
      return res.status(409).json({ msg: "User already registered for this event" });
    }

    logger.error({userId: req.body.userId, eventId: req.body.eventId, errorMsg: err.message, stack: err.stack}, "Error in registration");
    return res.status(500).json({ msg: "Internal Server Error while registering user" });
  }
};


const isExistRegistration = async(req,res)=>{
  try{
    const {userId, eventId} = req.params;
    logger.debug({userId, eventId}, "Checking if user registered for event");

    const response = await registrationModel.find({user: userId, event: eventId});

    if (response.length===0) {
      logger.debug({userId, eventId}, "User is not registered for this event");
      return res.status(200).json({
        msg: "User is not registered for this event",
        isRegistered: false
      });
    }
    
    logger.debug({userId, eventId}, "User already registered for event");
    return res.status(200).json({msg: "Already registered", isRegistered: true});

  }catch(err){
    logger.error({userId: req.params.userId, eventId: req.params.eventId, errorMsg: err.message, stack: err.stack}, "Error checking existing registration");
    return res.status(500).json({msg:"Internal Server Error, Kindly try again."});
  }
}

const getUserEvents = async(req, res) =>{
  try{
    const {userId} = req.params;
    logger.debug({userId}, "Fetching registered events for user");
    const response = await registrationModel.find({user: userId}).populate('event');
    
    if(!response){
      logger.warn({userId}, "Invalid userId or no events registered");
      return res.status(400).json({msg: "Invalid Id, or User has no registered yet"});
    }
    logger.debug({userId, eventCount: response.length}, "User events retrieved successfully");
    return res.status(200).json({msg:"Registered Events Found", registeredEvents: response});
  }catch(err){
    logger.error({userId: req.params.userId, errorMsg: err.message, stack: err.stack}, "Error fetching user events");
    return res.status(500).json({msg: "Internal Server Error"});
  }
}

const unregisterUser = async(req, res)=>{
  try{
    const {userId, eventId} = req.params;
    logger.debug({userId, eventId}, "Unregistering user from event");
    const response = await registrationModel.deleteOne({user: userId, event: eventId});

    if(response.deletedCount === 0){
      logger.warn({userId, eventId}, "Unregistration failed: Invalid user or event");
      return res.status(404).json({msg: "Invalid user or event, registration does not exist."});
    }

    logger.info({userId, eventId}, "User unregistered from event successfully");
    return res.status(200).json({msg:"Registration deleted successfully"});
  }catch(err){
    logger.error({userId: req.params.userId, eventId: req.params.eventId, errorMsg: err.message, stack: err.stack}, "Error unregistering user");
    return res.status(500).json({msg: "Internal Server Error"});
  }
}

const getRegistrationCounts = async (req, res) => {
  try {
    logger.debug({}, "Fetching registration counts by event");
    const counts = await registrationModel.aggregate([
      {
        $group: {
          _id: "$event",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object: { eventId: count }
    const result = {};
    counts.forEach(c => {
      result[c._id] = c.count;
    });

    logger.debug({eventCounts: Object.keys(result).length}, "Registration counts retrieved successfully");
    return res.status(200).json({ registrationCounts: result });
  } catch (err) {
    logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching registration counts");
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { registerUser, isExistRegistration, getUserEvents, unregisterUser, getRegistrationCounts };
