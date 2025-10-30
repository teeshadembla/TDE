import userModel from "../Models/userModel.js";
import workgroupModel from "../Models/workgroupModel.js";
import { workgroupValidationSchema } from "../SchemaValidation/workgroupValidationSchema.js";

const addNewWorkgroup = async(req, res)=>{
    try{
        console.log("backend call is starting..");
        const {error } =await workgroupValidationSchema.validateAsync(req.body);

        if (error) {
            return res.status(400).json({
                msg: "Validation Error",
                details: error.details[0]
            });
        }

        const existing = await workgroupModel.findOne({
            title: req.body.title,
            slackChannelName: req.body.slackChannelName
        });
        if (existing) {
            return res.status(400).json({ msg: "Workgroup already exists" });
        }
        console.log("there is no error");
    
        const {title, description, researchFocus, maxMembers, slackChannelName, coordinator, objectives} = req.body;
        console.log("This is the data being saved into the backend--->", {title, description, researchFocus, maxMembers, slackChannelName, coordinator, objectives})
        const newWorkgroup = new workgroupModel({title, description, researchFocus, maxMembers, slackChannelName, coordinator, objectives});

        await newWorkgroup.save();

        console.log("Database saved data");
        return res.status(200).json({msg:"New Workgroup added successfully"});
    }catch(err){
        if (err.code === 11000) {
            return res.status(400).json({
            msg: "A workgroup with this title and Slack channel already exists."
            });
        }
        console.log("This error occurred in the backend while adding new work group--->", err);
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

const getWorkgroups = async(req, res)=>{
    try{
        const result = await workgroupModel.find();
        console.log("This is the result that has come out of finding all work groups--->", result);
        
        return res.status(200).json({msg: "Work groups fetched successfully", data: result});
    }catch(err){
        console.log("This error has occured in backend callback of getting all workgroups---->", err);
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Admin control to edit a workgorup */
const editWorkgroup = async(req, res) =>{
    try{
        const {id} = req.params;
        const updatedData = req.body;

        const result = await workgroupModel.findByIdAndUpdate(id, updatedData, {new: true});
        if (!result) {
            return res.status(404).json({msg: "Workgroup not found"});
        }

        return res.status(200).json({msg: "Workgroup updated successfully", data: result});
    }catch(err){
        console.log("This error occurred while trying to edit a workgroup --> ", err);
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Admin control to delete a workgroup */

const deleteWorkgroup = async(req, res) =>{
    try{
        const {id} = req.params;
        const result = await workgroupModel.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({msg: "Workgroup not found"});
        }

        return res.status(200).json({msg: "Workgroup deleted successfully"});
    }catch(err){
        console.log("This error occurred while trying to delete a workgroup --> ", err);
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Get users by workgroup */

const getUsersByWorkgroup = async(req, res) =>{
    try{
        const workgroupId = req.params.workgroupId;
        console.log("Fetching users for workgroupId ---> ", workgroupId);

        if(!workgroupId){
            return res.status(400).json({msg: "Undefined workgroupId"});
        }

        const usersByWorkgroup =await userModel.find({workGroupId: workgroupId});

        return res.status(200).json({msg: "Users by workgroup successfullu fetched", data: usersByWorkgroup});
    }catch(err){
        console.log("This error has occurred in backend while trying to fetch users by certaiin workgroup ---> ", err);
        return res.status(500).json({msg:"Internal Server Error"});
    }
}
export {addNewWorkgroup, getWorkgroups, editWorkgroup, deleteWorkgroup, getUsersByWorkgroup}