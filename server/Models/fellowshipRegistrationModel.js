import mongoose, { mongo } from "mongoose";

const fellowshipRegistrationSchema = new mongoose.Schema({
    fellowship:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fellowship",
        required: true,
    },
    workgroupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workgroup",
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 
    status:{
        type: String, 
        enum: ["PENDING", "ACCEPTED", "REJECTED"]
    },
    userStat:{
        type: String,
        enum: ["Senior Fellow","Fellow"],
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    },
    completedAt:{
        type: Date,
        default:() => {
            const now = new Date();
            now.setDate(now.getDate() + 365); 
            return now;
        } 
    }
})

const fellowshipRegistrationModel = mongoose.model("Fellowship-Registration", fellowshipRegistrationSchema);
export default fellowshipRegistrationModel;