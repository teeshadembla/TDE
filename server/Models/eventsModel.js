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
    type:{
      type:String,
      required:true,  
    },
    image:{
        type: String,
    },
    locationType:{
        type:String,
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
    workgroup:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workgroup",
        required: true
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
    tags:
    [{
        type:String,
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

const eventsModel = mongoose.model("Event", eventsSchema);
export default eventsModel;