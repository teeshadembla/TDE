import mongoose from "mongoose";
import fellowshipModel from "./fellowshipModel";

const researchPaperSchema = new mongoose.Schema({
    fellowship:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fellowship"
    },
    workgroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workgroup",
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    submission_title:{
        type: String,
        required: true,
    },
    fileurl:{
        type: String,
        required: true,
    },
    publicationDate:{
        type: Date,
        default: null,
        required: true,
    }
})

const researchPaperModel = new mongoose.model("Research_Paper",  researchPaperSchema);
export default researchPaperModel;