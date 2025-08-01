import mongoose, { mongo } from 'mongoose';

const userSchema = mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["core","user"],
        required: true
    },
    fellowshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fellowship",
        default: null
    },
    socialLinks: {
        twitter: { type: String, default: "" },
        LinkedIn: { type: String, default: "" },
        Instagram: { type: String, default: "" }
    },
    membership: {
        isActive: { type: Boolean, default: false },
        startDate: { type: Date },
        endDate: { type: Date }
    },
    workGroupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workgroup",
        default: null,
    },
    eventsRegistered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    eventsParticipated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    eventsSpokenAt: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    referencesGiven: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    followedTopics: [{
        type: String
    }],
    isSubscribedToNewsletter: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        maxlength: 100,
        default: null,
    },
    title: {
        type: String,
        maxlength: 100,
        default: null,
    },
    department: {
        type: String,
        maxlength: 100,
        default: null,
    },
    company: {
        type: String,
        maxlength: 100,
        default: null,
    },
    expertise: [{
        type: String
    }],
    discoverySource: {
        type: String,
        enum: [
        "LinkedIn", "Twitter/X", "Instagram", "Email Newsletter", "College/University",
        "Company/Organization", "Hackathon or Event", "Friend", "Family", "Colleague",
        "Google Search", "News Article or Blog", "Other"
        ]
    }
})

const userModel = mongoose.model("User", userSchema);
export default userModel;
    