import mongoose from "mongoose";
import { generateEmbedding } from "./utils/embedding.js";
import eventsModel from "../../Models/eventsModel.js";
import userModel from "../../Models/userModel.js";
import researchPaperModel from "../../Models/researchPaperModel.js"
import dotenv from "dotenv";
dotenv.config();

const MONGO_USER =process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.a7cnmoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`



async function backfillEmbeddings() {
        /* db.research-papers.updateMany({}, { $unset: { embedding: "" } })
db.events.updateMany({}, { $unset: { embedding: "" } })
db.users.updateMany({}, { $unset: { interestEmbedding: "" } })
 */
  try {



    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const publications = await researchPaperModel.find({
      embedding: { $exists: false }
    });

    for (const pub of publications) {
      const text = `
      ${pub.title}
      ${pub.subtitle || ""}
      ${pub.description || ""}
      ${pub.tags?.join(" ") || ""}
      `;

      const embedding = await generateEmbedding(text);

      pub.embedding = embedding;

      await researchPaperModel.updateOne(
        { _id: pub._id },
        { $set: { embedding } }
    );
    }

    console.log("Publications embedded");

    const events = await eventsModel.find({
      embedding: { $exists: false }
    });

    for (const event of events) {
      const text = `
      ${event.title}
      ${event.subtitle || ""}
      ${event.description || ""}
      ${event.tags?.join(" ") || ""}
      `;

      const embedding = await generateEmbedding(text);

      event.embedding = embedding;

      await eventsModel.updateOne(
  { _id: event._id },
  { $set: { embedding } }
);
    }

    console.log("Events embedded");

    const users = await userModel.find({
      interestEmbedding: { $exists: false }
    });

    for (const user of users) {

      const text = `
      ${user.expertise?.join(" ") || ""}
      ${user.title || ""}
      ${user.department || ""}
      ${user.company || ""}
      ${user.followedTopics?.join(" ") || ""}
      `;

      if (!text.trim()) continue;

      const embedding = await generateEmbedding(text);

      user.interestEmbedding = embedding;

      await userModel.updateOne(
  { _id: user._id },
  { $set: { interestEmbedding: embedding } }
);
    }

    console.log("Users embedded");

    console.log("Backfill completed");

    await mongoose.disconnect();

    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

backfillEmbeddings();

backfillEmbeddings();