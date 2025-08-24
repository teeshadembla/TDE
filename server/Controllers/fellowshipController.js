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

/* Admin control to fetch all accepted fellowships */

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

/* Admin control to change the status of a fellowship from pending to accepted or rejected */
const moveRegistraionStatus = async(req, res) =>{
    try{
        const {fellowshipId, status} = req.params; 
        const updated = await fellowshipRegistrationModel.findByIdAndUpdate(
        fellowshipId,
        { status },
        { new: true }
        ).populate("user", "fellowship");

        if (!updated) {
        return res.status(404).json({ error: "Registration not found." });
        }

        await sendApprovalEmail({
            to: updated.user_id.email,
            name: updated.user_id.name,
            status: updated.status,
            fellowshipName: updated.fellowship.title, // or get from DB
        });

        res.status(200).json({ success: true, data: updated });
    }catch(err){
        console.log("This error occurred in the backend while trying to change the status of application--->", err);
        return res.status(500).json({msg: "Internal Server Error", error: err});
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
    getAllRegistrations
};