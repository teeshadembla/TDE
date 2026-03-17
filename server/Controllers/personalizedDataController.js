import eventsModel from "../Models/eventsModel.js";
import researchPaperModel from "../Models/researchPaperModel.js";
import userModel from "../Models/userModel.js";
import { getAuth } from "@clerk/express";
export const personalizedData = async (req, res) => {
  try {

    console.log("----- Personalized Data API Called -----");

    const { userId } = getAuth(req);

    console.log("User ID from request:", userId);

    if (!userId) {
      console.error("User ID missing in request");
      return res.status(400).json({ msg: "User ID missing" });
    }

    console.log("Fetching user from DB...");
    const user = await userModel.findById(userId).select("interestEmbedding");

    if (!user) {
      console.error("User not found in database");
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("User found");
    console.log(
      "Interest embedding length:",
      user.interestEmbedding ? user.interestEmbedding.length : "None"
    );

    if (!user.interestEmbedding || user.interestEmbedding.length === 0) {
      console.warn("User has no interest embeddings");

      return res.status(200).json({
        publications: [],
        events: [],
        msg: "User has no interest embeddings"
      });
    }

    const userVector = user.interestEmbedding;

    console.log("Running vector search for publications...");

    const publications = await researchPaperModel.aggregate([
      {
        $vectorSearch: {
          index: "publication_embedding_index",
          path: "embedding",
          queryVector: userVector,
          numCandidates: 100,
          limit: 4
        }
      },
      {
        $project: {
          title: 1,
          subtitle: 1,
          description: 1,
          publishingDate: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);

    console.log("Publications found:", publications.length);

    console.log("Running vector search for events...");

    const events = await eventsModel.aggregate([
      {
        $vectorSearch: {
          index: "event_embedding_index",
          path: "embedding",
          queryVector: userVector,
          numCandidates: 100,
          limit: 4
        }
      },
      {
        $project: {
          title: 1,
          subtitle: 1,
          description: 1,
          eventDate: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);

    console.log("Events found:", events.length);

    console.log("Returning personalized data response");

    return res.status(200).json({
      publications,
      events
    });

  } catch (err) {

    console.error("----- ERROR in personalizedData API -----");
    console.error("Error message:", err.message);
    console.error("Stack trace:", err.stack);

    return res.status(500).json({
      msg: "Internal Server Error",
      err: err.message
    });
  }
};