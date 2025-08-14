import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";

const getAllFellowshipRegistrations = async (req, res) => {
  try {
    const registrations = await fellowshipRegistrationModel.find({status : "PENDING"}).populate("fellowship").populate("user", "FullName email").populate("fellowship", "cycle startDate endDate").populate("workgroupId", "title description") ;
    res.status(200).json({ registrations });
  } catch (error) {
    console.error('Error fetching fellowship registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const acceptFellowshipRegistration = async(req, res) =>{
  const {id} = req.params;
  try{
    const registration = await fellowshipRegistrationModel.findById(id);
    if(!registration){
      return res.status(401).json({msg: "The following registration does not exist"});
    }
    const updatedRegistration = await fellowshipRegistrationModel.findByIdAndUpdate(id, {status: "ACCEPTED"}, {new: true});
    return res.status(200).json({ registration: updatedRegistration });
  }
  catch(err){
    console.log("Some error occured in the backend callback of accepting fellowship--->", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const rejectFellowshipRegistration = async(req, res) =>{
  try{
    const {id} = req.params;
    const registration = await fellowshipRegistrationModel.findById(id);
    if(!registration){
      return res.status(401).json({msg: "The following registration does not exist"});
    }
    const updatedRegistration = await fellowshipRegistrationModel.findByIdAndUpdate(id, {status: "REJECTED"}, {new: true});
    return res.status(200).json({ registration: updatedRegistration });
  }catch(err){
    console.log("Some error occured in the backend callback of rejecting fellowship--->", err);
    return res.status(500).json({ error: 'Internal server error' });  
  }
}

const deleteFellowshipRegistration = async(req, res)=>{
  try{
    const {id} = req.params;
    const registration = await fellowshipRegistrationModel.findById(id);
    if(!registration){
      return res.status(401).json({msg: "The following registration does not exist"});
    }
    await fellowshipRegistrationModel.findByIdAndDelete(id);
    return res.status(200).json({ msg: "The following registration has been deleted successfully" });
  }catch(err){
    console.log("Some error occurred in the backend callback of deleting fellowship--->", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default {getAllFellowshipRegistrations, acceptFellowshipRegistration, rejectFellowshipRegistration, deleteFellowshipRegistration};