import userModel from "../Models/userModel.js";
import workgroupModel from "../Models/workgroupModel.js";
import { workgroupValidationSchema } from "../SchemaValidation/workgroupValidationSchema.js";
import  logger  from "../utils/logger.js";

const addNewWorkgroup = async(req, res)=>{
    try{
        logger.debug({body: req.body}, "Adding new workgroup");
        const {error } =await workgroupValidationSchema.validateAsync(req.body);

        if (error) {
            logger.warn({validationError: error.details[0]}, "Workgroup validation failed");
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
            logger.warn({title: req.body.title, slackChannelName: req.body.slackChannelName}, "Workgroup already exists");
            return res.status(400).json({ msg: "Workgroup already exists" });
        }
    
        const {title, description, researchFocus, maxMembers, slackChannelName, coordinator, objectives} = req.body;
        logger.debug({title, description, researchFocus, maxMembers, slackChannelName, coordinator, objectives}, "Creating new workgroup document");
        const newWorkgroup = new workgroupModel({title, description, researchFocus, maxMembers, slackChannelName, coordinator, objectives});

        await newWorkgroup.save();

        logger.info({workgroupId: newWorkgroup._id, title}, "Workgroup created and saved successfully");
        return res.status(200).json({msg:"New Workgroup added successfully"});
    }catch(err){
        if (err.code === 11000) {
            logger.warn({error: err.message}, "Duplicate workgroup: Title and Slack channel already exist");
            return res.status(400).json({
            msg: "A workgroup with this title and Slack channel already exists."
            });
        }
        logger.error({errorMsg: err.message, stack: err.stack}, "Error adding new workgroup");
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

const getWorkgroups = async(req, res)=>{
    try{
        logger.debug({}, "Fetching all workgroups");
        const result = await workgroupModel.find();
        logger.debug({count: result.length}, "Workgroups retrieved successfully");
        
        return res.status(200).json({msg: "Work groups fetched successfully", data: result});
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching all workgroups");
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Admin control to edit a workgorup */
const editWorkgroup = async(req, res) =>{
    try{
        const {id} = req.params;
        const updatedData = req.body;
        logger.debug({workgroupId: id}, "Updating workgroup");

        const result = await workgroupModel.findByIdAndUpdate(id, updatedData, {new: true});
        if (!result) {
            logger.warn({workgroupId: id}, "Workgroup not found for update");
            return res.status(404).json({msg: "Workgroup not found"});
        }

        logger.info({workgroupId: id}, "Workgroup updated successfully");
        return res.status(200).json({msg: "Workgroup updated successfully", data: result});
    }catch(err){
        logger.error({workgroupId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error updating workgroup");
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Admin control to delete a workgroup */

const deleteWorkgroup = async(req, res) =>{
    try{
        const {id} = req.params;
        logger.debug({workgroupId: id}, "Deleting workgroup");
        const result = await workgroupModel.findByIdAndDelete(id);
        if (!result) {
            logger.warn({workgroupId: id}, "Workgroup not found for deletion");
            return res.status(404).json({msg: "Workgroup not found"});
        }

        logger.info({workgroupId: id}, "Workgroup deleted successfully");
        return res.status(200).json({msg: "Workgroup deleted successfully"});
    }catch(err){
        logger.error({workgroupId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error deleting workgroup");
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Get users by workgroup */

const getUsersByWorkgroup = async(req, res) =>{
    try{
        const workgroupId = req.params.workgroupId;
        logger.debug({workgroupId}, "Fetching users for workgroup");

        if(!workgroupId){
            logger.warn({}, "Undefined workgroupId provided");
            return res.status(400).json({msg: "Undefined workgroupId"});
        }

        const usersByWorkgroup =await userModel.find({workGroupId: workgroupId});
        logger.debug({workgroupId, count: usersByWorkgroup.length}, "Users retrieved for workgroup");

        return res.status(200).json({msg: "Users by workgroup successfullu fetched", data: usersByWorkgroup});
    }catch(err){
        logger.error({workgroupId: req.params.workgroupId, errorMsg: err.message, stack: err.stack}, "Error fetching users by workgroup");
        return res.status(500).json({msg:"Internal Server Error"});
    }
}
export {addNewWorkgroup, getWorkgroups, editWorkgroup, deleteWorkgroup, getUsersByWorkgroup}