import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./Models/userModel.js";
import fellowProfilModel from "./Models/fellowProfileModel.js";

dotenv.config(); 

const MONGO_USER =process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.a7cnmoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const getDisplayAs = (role) => {
  if (!role) return "";
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "admin" || normalizedRole === "chair") return "leadership";
  if (normalizedRole === "core") return "team";

  return "";
};

const migrateUsersToFellowProfiles = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const users = await userModel.find({ email: { $exists: true } });

    const uniqueIds = new Set(users.map(u => u._id.toString()));

console.log("Total users:", users.length);
console.log("Unique userIds:", uniqueIds.size);

    console.log(`Users found: ${users.length}`);

let successCount = 0;
let failCount = 0;

for (const user of users) {
  const profile = {
    userId: user._id,

    displayName: user.FullName || "",
    displayAs: getDisplayAs(user.role),

    professionalHeadshotUrl: user.profilePicture || "",
    professionalHeadshotKey: "",

    headline: user.title || "",
    bio: user.introduction || "",

    expertise: Array.isArray(user.expertise)
      ? user.expertise
      : user.expertise
        ? [user.expertise]
        : [],

    currentRole: {
      title: user.title || "",
      organization: user.company || ""
    },

    socialLinks: {
      linkedin: user.socialLinks?.LinkedIn || "",
      twitter: user.socialLinks?.twitter || "",
      github: "",
      website: ""
    },

    portfolioItems: [],

    imageUploadStatus: "completed",
    status: "SUBMITTED",
    adminComments: [],
    isPublic: false
  };

  try {
    await fellowProfilModel.create(profile);
    successCount++;
    console.log(`Inserted profile for userId: ${user._id}`);
  } catch (err) {
    failCount++;

    console.log("\nFAILED inserting profile");
    console.log("UserId:", user._id);
    console.log("Error name:", err.name);
    console.log("Error message:", err.message);

    if (err.errors) {
      Object.keys(err.errors).forEach(field => {
        console.log(`Field error → ${field}:`, err.errors[field].message);
      });
    }

    if (err.code === 11000) {
      console.log("Duplicate key error:", err.keyValue);
    }

    console.log("Raw user data causing failure:");
    console.dir(user.toObject(), { depth: null });
    console.log("------------------------------------------------");
  }
}

console.log("\nMigration summary:");
console.log("Successful inserts:", successCount);
console.log("Failed inserts:", failCount);


  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
};

migrateUsersToFellowProfiles();
