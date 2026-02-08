import mongoose from "mongoose";
import User from "./Models/userModel.js"; // adjust path if needed
import dotenv from "dotenv";
dotenv.config();

const MONGO_USER =process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.a7cnmoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const user = {
  clerkUserId: "user_39OeIADg2kQCi3APZNzSYmKL2xT",
  FullName: "Navroop Sahdev",
  email: "navroop@thedigitaleconomist.com",
  profilePicture: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/696a5cc9dafd7f5f215190d7_Navroop%20Sahdev.jpg",
  role: "admin",
  fellowshipId: null,

  socialLinks: {
    twitter: "",
    LinkedIn: "https://www.linkedin.com/in/navroopsahdev/",
    Instagram: ""
  },

  membership: [],
  workGroupId: null,

  eventsRegistered: [],
  eventsParticipated: [],
  eventsSpokenAt: [],
  referencesGiven: [],
  followedTopics: [],

  isSubscribedToNewsletter: true,

  location: "Global",
  title: "Founder & CEO",
  department: "Leadership",
  company: "The Digital Economist",

  expertise: [
    "Artificial Intelligence",
    "Blockchain",
    "Economic Policy",
    "Technology Governance",
    "Digital Identity",
    "Decentralized Finance",
    "Sustainability"
  ],

  discoverySource: "LinkedIn",

  isVerifiedbyAdmin: true,
  isRejectedByAdmin: false,
  isMFAenabled: false,

  lastPasswordReset: null,
  passwordResetHistory: [],

  introduction: "Navroop Sahdev is a visionary serial entrepreneur, economist, and technology futurist, and the Founder and CEO of The Digital Economist, a global think tank advancing human-centered economics, technology governance, and institutional resilience. She operates at the intersection of artificial intelligence, blockchain, economic policy, and global governance, advising governments, enterprises, and multilateral institutions on navigating systemic transformation in an era of rapid technological change.",

  stripeCustomerId: null,

  createdAt: new Date(),
  updatedAt: new Date()
};

async function addUser() {
  try {
    await mongoose.connect(MONGO_URI);

    const existing = await User.findOne({ email: user.email });
    if (existing) {
      console.log("User already exists");
      return process.exit();
    }

    const newUser = new User(user);
    await newUser.save();

    console.log("User inserted successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

addUser();
