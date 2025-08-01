import mongoose from "mongoose"

const eventsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    }, 
    description:{
        type: String,
        required: true,
    },
    location: {
        type: String, 
        required: true
    },
    eventDate:{
        type: Date,
        default: Date.now,
    },
    registrationLink:{
        type: String,
        required: true,
    },
    slackLink:{
        type:String,
        required: true
    },
    speakers:[{
        speakerRef:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        link:{
            type: String,
        }
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

const eventsModel = mongoose.model("Event", eventsSchema);
export default eventsModel;