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
    profilePicture: {
        type: String, 
        required: false,
        default:"https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
    },
    role:{
        type: String,
        enum: ["core","user","chair"],
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
    membership: [{
        isActive: { type: Boolean, default: false },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { 
            type: String, 
            enum: ["active", "expired", "cancelled"],
            default: "active"
        },
        membershipType: {
            type: String,
            enum: ["digital-i", "digital-c", "strategic"],
            default: "annual"
        },
        renewalDate: { type: Date },
        cancellationDate: { type: Date },
        cancellationReason: { type: String }
    }],
    workGroupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workgroup",
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
    },
    introduction: {
        type: String,
        maxlength: 500,
        default: null
    }
})

const userModel = mongoose.model("User", userSchema);
export default userModel;
    