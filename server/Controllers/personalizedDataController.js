import eventsModel from "../Models/eventsModel.js";
import researchPaperModel from "../Models/researchPaperModel.js";
import userModel from "../Models/userModel.js";
import { getAuth } from "@clerk/express";
import logger from "../utils/logger.js";
import workgroupModel from "../Models/workgroupModel.js";


export const personalizedData = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(400).json({ msg: "User ID missing" });
    }

    const user = await userModel
      .findOne({ clerkUserId: userId })
      .select("interestEmbedding");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const today = new Date();

    // ── No embedding — return fallbacks immediately ─────────────────
    if (!user.interestEmbedding || user.interestEmbedding.length === 0) {
      const [publications, upcomingEvents] = await Promise.all([
        // Latest 5 completed publications
        researchPaperModel
          .find({ uploadStatus: 'completed' })
          .sort({ publishingDate: -1 })
          .limit(5)
          .select('title subtitle description publishingDate documentType thumbnailUrl workgroupId')
          .lean(),

        // Soonest 3 upcoming events
        eventsModel
          .find({ 'eventDate.start': { $gt: today } })
          .sort({ 'eventDate.start': 1 })
          .limit(3)
          .populate('workgroup', 'title')
          .select('title subtitle description type image location locationType eventDate registrationLink workgroup tags')
          .lean(),
      ]);

      return res.status(200).json({ publications, upcomingEvents });
    }

    const userVector = user.interestEmbedding;

    // ── Vector search — publications ────────────────────────────────
    let publications = await researchPaperModel.aggregate([
      {
        $vectorSearch: {
          index: 'publication_embedding_index',
          path: 'embedding',
          queryVector: userVector,
          numCandidates: 100,
          limit: 5,
        },
      },
      {
        $lookup: {
          from: 'workgroups',
          localField: 'workgroupId',
          foreignField: '_id',
          as: 'workgroupData',
        },
      },
      {
        $addFields: {
          workgroupTitles: {
            $map: { input: '$workgroupData', as: 'wg', in: '$$wg.title' },
          },
        },
      },
      {
        $project: {
          title: 1,
          subtitle: 1,
          description: 1,
          publishingDate: 1,
          documentType: 1,
          thumbnailUrl: 1,
          workgroupId: 1,
          workgroupTitles: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);

    // ── Vector search — upcoming events ─────────────────────────────
    let upcomingEvents = await eventsModel.aggregate([
      {
        $vectorSearch: {
          index: 'event_embedding_index',
          path: 'embedding',
          queryVector: userVector,
          numCandidates: 100,
          limit: 10, // fetch more so we have enough after date filtering
        },
      },
      {
        // Filter to only future events after vector search
        $match: {
          'eventDate.start': { $gt: today },
        },
      },
      { $limit: 3 },
      {
        $lookup: {
          from: 'workgroups',
          localField: 'workgroup',
          foreignField: '_id',
          as:'workgroupData',
        },
      },
      {
        $addFields: {
          workgroupTitles: {
            $map: { input: '$workgroupData', as: 'wg', in: '$$wg.title' },
          },
        },
      },
      {
        $project: {
          title: 1,
          subtitle: 1,
          description: 1,
          type: 1,
          image: 1,
          location: 1,
          locationType: 1,
          eventDate: 1,
          registrationLink: 1,
          workgroup: 1,
          workgroupTitles: 1,
          tags: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);

    // ── Fallback if vector search returned empty arrays ──────────────
    if (!publications.length) {
      publications = await researchPaperModel
        .find({ uploadStatus: 'completed' })
        .sort({ publishingDate: -1 })
        .limit(5)
        .select('title subtitle description publishingDate documentType thumbnailUrl workgroupId')
        .lean();
    }

    if (!upcomingEvents.length) {
      upcomingEvents = await eventsModel
        .find({ 'eventDate.start': { $gt: today } })
        .sort({ 'eventDate.start': 1 })
        .limit(3)
        .populate('workgroup', 'title')
        .select('title subtitle description type image location locationType eventDate registrationLink workgroup tags')
        .lean();
    }

    return res.status(200).json({ publications, upcomingEvents });

  } catch (err) {
    console.error("Error in personalizedData:", err.message);
    return res.status(500).json({ msg: "Internal Server Error", err: err.message });
  }
};


export const workgroupPick = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(400).json({ msg: "User not authenticated" });
    }

    const user = await userModel.findOne({ clerkUserId: userId });

    let selectedWorkgroup = null;

    if (user?.workgroupId && user.workgroupId.length > 0) {
      selectedWorkgroup = user.workgroupId[0];
    } else {
      const randomWorkgroup = await workgroupModel.aggregate([
        { $sample: { size: 1 } }
      ]);
      selectedWorkgroup = randomWorkgroup[0]?._id;
    }

    if (!selectedWorkgroup) {
      return res.status(404).json({ msg: "No workgroup found" });
    }

    const workgroupObjectId =
      typeof selectedWorkgroup === "string"
        ? new mongoose.Types.ObjectId(selectedWorkgroup)
        : selectedWorkgroup;

    const workgroupDoc = await workgroupModel.findById(workgroupObjectId).select("title");

    const events = await eventsModel.find({
      workgroup: { $in: [workgroupObjectId] }
    }).limit(2);

    const publications = await researchPaperModel.find({
      workgroupId: { $in: [workgroupObjectId] }
    }).limit(2);

    return res.status(200).json({
      workgroup: {
        _id: workgroupObjectId,
        title: workgroupDoc?.title || null
      },
      events,
      publications
    });

  } catch (err) {
    console.error("Error in workgroupPick:", err);
    return res.status(500).json({
      msg: "Internal Server Error",
      err: err.message
    });
  }
};