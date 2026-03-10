import mongoose from "mongoose"

const eventsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    }, 
    subtitle:{
        type: String,
    },
    description:{
        type: String,
        required: true,
    },
    type:{
      type:String,
      required:true,  
    },
    image: {
        url: { type: String, default: "https://tde-assets-events.s3.eu-north-1.amazonaws.com/69395caf541181e114939124/default.jpg" },
        key: { type: String, default: "69395caf541181e114939124/default.jpg" }
    },
    locationType:{
        type:String,
    },
    location: {
        type: String, 
        required: true
    },
    eventDate:{
        start:{type: Date},
        end: {type: Date}
    },
    registrationLink:{
        type: String,
        required: true,
    },
    workgroup:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workgroup",
    }],
    slackLink:{
        type:String,
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