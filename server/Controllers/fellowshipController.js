import fellowshipModel from "../Models/fellowshipModel.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";


/* Admin fellowship control, must have middleware for authorization */
const addNewFellowship = async(req, res) =>{
    try{
        const {description, cycle, startDate, endDate, applicationDeadline, requirements} = req.body;
        if(!description|| !cycle||  !startDate||  !applicationDeadline){
            return res.status(400).json({msg: "Incomplete fields. Kindly fill all the fields and try again."});
        }

        const newFellowship = new fellowshipModel({description, cycle, startDate, endDate, applicationDeadline, requirements});
        await newFellowship.save();

        return res.status(200).json({msg: "New Fellowship have been added!"});
    }catch(err){
        console.log("This error occurred while trying to add new fellowship --> ", err);
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Admin Control to update and delete fellowships */
const updateFellowship = async(req, res) =>{
    try{
        const {id} = req.params;
        const {startDate,  applicationDeadline} = req.body;

        const updatedFellowship = await fellowshipModel.findByIdAndUpdate(id, {
            startDate, applicationDeadline
        }, {new: true});

        if(!updatedFellowship){
            return res.status(404).json({msg: "Fellowship not found"});
        }

        return res.status(200).json({msg: "Fellowship updated successfully", updatedFellowship});
    }catch(err){
        console.log("This error occurred while trying to update fellowship --> ", err);
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

const deleteFellowship = async(req, res) =>{
    try{
        const {id} = req.params;

        const deletedFellowship = await fellowshipModel.findByIdAndDelete(id);

        if(!deletedFellowship){
            return res.status(404).json({msg: "Fellowship not found"});
        }

        return res.status(200).json({msg: "Fellowship deleted successfully", deletedFellowship});
    }catch(err){
        console.log("This error occurred while trying to delete fellowship --> ", err);
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Admin control to view all existing fellowships */

const getAllRegistrations = async(req, res) =>{
    try{
        const registration = await fellowshipRegistrationModel.find({status: "PENDING_REVIEW"}).populate("user", "FullName email company title socialLinks").populate("fellowship").populate("workgroupId", "title");

        return res.status(200).json({msg: "All pending fellowships have been retrieved.", registrations: registration});
    }catch(err){
        console.log("This error occured in the backend while trying to fetch registration data--->", err);
        return res.status(500).json({msg: "Internal Server error", error: err});
    }
}



/* Admin control to fetch all previous fellowship details */
const getAllPastFellowships = async(req, res) =>{
    try{
        const pastFellowships = await fellowshipModel.find({startDate: {$lt: new Date()}});
        return res.status(200).json({msg: "All past fellowships have been retrieved.", fellowships: pastFellowships});
    }catch(err){
        console.log("This error occured in the backend while trying to fetch past fellowship data--->", err);
        return res.status(500).json({msg: "Internal Server error", error: err});
    }
}

/* Admin control to fetch all future fellowship details */
const getAllFutureFellowships = async(req, res) =>{
    try{
        const futureFellowships = await fellowshipModel.find({startDate: {$gte: new Date()}}).populate("workGroupId", "title description maxMembers");
        return res.status(200).json({msg: "All future fellowships have been retrieved.", fellowships: futureFellowships});
    }catch(err){
        console.log("This error occured in the backend while trying to fetch future fellowship data--->", err);
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

        return res.status(200).json({ 
            msg: "Fellowship registration counts retrieved successfully", 
            registrationCounts 
        });
    } catch (err) {
        console.error("Error getting fellowship registration counts:", err);
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