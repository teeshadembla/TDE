import mongoose from 'mongoose';

const fellowshipSchema = new mongoose.Schema({
    cycle:{
        type: String,
        required: true,
    },
    workGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workgroup",
    },
    startDate:{
        type: Date,
        required: true,
    },
    endDate:{
        type:Date,
        default: ()=>{
            new Date(Date.now + 365 * 24 * 60 * 60 * 1000)
        }
    },
    applicationDeadline:{
        type: Date,
        required: true,
    }
},{timestamps: true});

// The collection name will be 'fellowships'
const Fellowship = mongoose.model("Fellowship", fellowshipSchema);
export default Fellowship;