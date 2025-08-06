import registrationModel from "../Models/regitrationsModel.js";
import { registrationValidationSchema } from "../SchemaValidation/registrationValidationSchema.js";
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
      return res.status(409).json({ msg: "User already registered for this event" });
    }

    console.error("Error in registration:", err);
    return res.status(500).json({ msg: "Internal Server Error while registering user" });
  }
};


const isExistRegistration = async(req,res)=>{
  try{
    const {userId, eventId} = req.params;
    //console.log("user:", userId);
    //console.log("Event:", eventId);

    const response = await registrationModel.find({user: userId, event: eventId});
    //console.log("This is the existing registration: ",response);

    if (response.length===0) {
      return res.status(200).json({
        msg: "User is not registered for this event",
        isRegistered: false
      });
    }
    

    return res.status(200).json({msg: "Already registered", isRegistered: true});

  }catch(err){
    console.log("Some error occurred in backend callback of isExistingregistration--->", err);
    return res.status(500).json({msg:"Internal Server Error, Kindly try again."});
  }
}

const getUserEvents = async(req, res) =>{
  try{
    const {userId} = req.params;
    const response = await registrationModel.find({user: userId}).populate('event');
/*     console.log(`There are all user no. ${userId}'s events---->`,response);
 */    
    if(!response){
      return res.status(400).json({msg: "Invalid Id, or User has no registered yet"});
    }
    return res.status(200).json({msg:"Registered Events Found", registeredEvents: response});
  }catch(err){
    console.log("Some error occurred in the backend callback of getting user specific events---->", err);
    return res.status(500).json({msg: "Internal Server Error"});
  }
}

const unregisterUser = async(req, res)=>{
  try{
    const {userId, eventId} = req.params;
    const response = await registrationModel.deleteOne({user: userId, event: eventId});

    if(response.deletedCount === 0){
      return res.status(404).json({msg: "Invalid user or event, registration does not exist."});
    }

    return res.status(200).json({msg:"Registration deleted successfully"});
  }catch(err){
    console.log("Some error occurred in the backend callback of unregistering user--->", err);
    return res.status(500).json({msg: "Internal Server Error"});
  }
}

const getRegistrationCounts = async (req, res) => {
  try {
    console.log("getting registration counts now");
    const counts = await registrationModel.aggregate([
      {
        $group: {
          _id: "$event",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to object: { eventId: count }
    console.log("These our details of count", counts);
    const result = {};
    counts.forEach(c => {
      result[c._id] = c.count;
    });

    console.log(result);
    return res.status(200).json({ registrationCounts: result });
  } catch (err) {
    console.error("Error fetching registration counts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { registerUser, isExistRegistration, getUserEvents, unregisterUser, getRegistrationCounts };
