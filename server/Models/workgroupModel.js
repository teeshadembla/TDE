import mongoose, { mongo } from "mongoose";

const workgroupSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    subtitle:{
        type:String,
        required:true,
    },
    bgImg:{
        type: String,
    },
    description:{
        type: String, 
        required: true,
    },
    keyThemes:[{
        title: {type: String},
        description: {type: String},
    }],
    maxMembers:{
        type: Number,
        default: 100,
    }, 
    slackChannelName:{
        type: String,
    }, 
    researchPapers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Research_Paper"
        }
    ],
    chair:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {timestamps: true});
workgroupSchema.index(
  { title: 1, slackChannelName: 1 },
  { unique: true }
);

const workgroupModel = mongoose.model("Workgroup", workgroupSchema);
export default workgroupModel;
