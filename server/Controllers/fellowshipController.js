import fellowshipModel from "../Models/fellowshipModel.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import logger from "../utils/logger.js";


/* Admin fellowship control, must have middleware for authorization */
const addNewFellowship = async(req, res) =>{
    try{
        const {description, cycle, startDate, endDate, applicationDeadline, requirements} = req.body;
        if(!description|| !cycle||  !startDate||  !applicationDeadline){
            logger.warn({description, cycle, startDate, applicationDeadline}, "Add fellowship failed: Missing required fields");
            return res.status(400).json({msg: "Incomplete fields. Kindly fill all the fields and try again."});
        }

        const newFellowship = new fellowshipModel({description, cycle, startDate, endDate, applicationDeadline, requirements});
        await newFellowship.save();

        logger.info({fellowshipId: newFellowship._id, cycle}, "New fellowship added successfully");
        return res.status(200).json({msg: "New Fellowship have been added!"});
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error adding new fellowship");
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

const updateFellowship = async(req, res) =>{
    try{
        const {id} = req.params;
        const {startDate,  applicationDeadline} = req.body;

        const updatedFellowship = await fellowshipModel.findByIdAndUpdate(id, {
            startDate, applicationDeadline
        }, {new: true});

        if(!updatedFellowship){
            logger.warn({fellowshipId: id}, "Fellowship update failed: Fellowship not found");
            return res.status(404).json({msg: "Fellowship not found"});
        }

        logger.info({fellowshipId: id, startDate,  applicationDeadline}, "Fellowship updated successfully");
        return res.status(200).json({msg: "Fellowship updated successfully", updatedFellowship});
    }catch(err){
        logger.error({fellowshipId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error updating fellowship");
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

const deleteFellowship = async(req, res) =>{
    try{
        const {id} = req.params;

        const deletedFellowship = await fellowshipModel.findByIdAndDelete(id);

        if(!deletedFellowship){
            logger.warn({fellowshipId: id}, "Fellowship deletion failed: Fellowship not found");
            return res.status(404).json({msg: "Fellowship not found"});
        }

        logger.info({fellowshipId: id, cycle: deletedFellowship.cycle}, "Fellowship deleted successfully");
        return res.status(200).json({msg: "Fellowship deleted successfully", deletedFellowship});
    }catch(err){
        logger.error({fellowshipId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error deleting fellowship");
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Admin control to view all existing fellowships */

const getAllRegistrations = async(req, res) =>{
    try{
        const registration = await fellowshipRegistrationModel.find({status: "PENDING_REVIEW"}).populate("user", "FullName email company title socialLinks").populate("fellowship").populate("workgroupId", "title");

        logger.debug({registrationCount: registration.length}, "Pending fellowship registrations retrieved successfully");
        return res.status(200).json({msg: "All pending fellowships have been retrieved.", registrations: registration});
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching pending fellowship registrations");
        return res.status(500).json({msg: "Internal Server error", error: err});
    }
}



const getAllPastFellowships = async(req, res) =>{
    try{
        const pastFellowships = await fellowshipModel.find({startDate: {$lt: new Date()}});
        logger.debug({fellowshipCount: pastFellowships.length}, "Past fellowships retrieved successfully");
        return res.status(200).json({msg: "All past fellowships have been retrieved.", fellowships: pastFellowships});
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching past fellowships");
        return res.status(500).json({msg: "Internal Server error", error: err});
    }
}

/* Admin control to fetch all future fellowship details */
const getAllFutureFellowships = async(req, res) =>{
    try{
        const futureFellowships = await fellowshipModel.find({startDate: {$gte: new Date()}}).populate("workGroupId", "title description maxMembers");
        logger.debug({fellowshipCount: futureFellowships.length}, "Future fellowships retrieved successfully");
        return res.status(200).json({msg: "All future fellowships have been retrieved.", fellowships: futureFellowships});
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching future fellowships");
        return res.status(500).json({msg: "Internal Server error", error: err});
    }
}

/* Get registration counts for each fellowship cycle */
const getFellowshipRegistrationCounts = async (req, res) => {
    try {
        const counts = await fellowshipRegistrationModel.aggregate([
            {
                $lookup: {
                    from: "fellowships",  // The name of the fellowships collection
                    localField: "fellowship",
                    foreignField: "_id",
                    as: "fellowshipInfo"
                }
            },
            {
                $unwind: "$fellowshipInfo"
            },
            {
                $group: {
                    _id: "$fellowshipInfo.cycle",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert array to object with cycle as key
        const registrationCounts = {};
        counts.forEach(count => {
            registrationCounts[count._id] = count.count;
        });

        logger.debug({cycleCount: Object.keys(registrationCounts).length, registrationCounts}, "Fellowship registration counts retrieved successfully");
        return res.status(200).json({ 
            msg: "Fellowship registration counts retrieved successfully", 
            registrationCounts 
        });
    } catch (err) {
        logger.error({errorMsg: err.message, stack: err.stack}, "Error getting fellowship registration counts");
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

export {
    addNewFellowship,
    getAllPastFellowships,
    getFellowshipRegistrationCounts,
    getAllRegistrations,
    getAllFutureFellowships,
    deleteFellowship,
    updateFellowship,
};