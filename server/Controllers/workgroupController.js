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


export {addNewWorkgroup, getWorkgroups}