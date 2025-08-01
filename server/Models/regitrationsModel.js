import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},{timestamps: true});

registrationSchema.index({ event: 1, user: 1 }, { unique: true });

const registrationModel = mongoose.model("Registration", registrationSchema);
export default registrationModel;