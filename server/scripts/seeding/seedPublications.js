import mongoose from "mongoose";
import dotenv from "dotenv";
import researchPaperModel from "../../Models/researchPaperModel.js";
import Connection from "../../db.js";
import publications from "./publicationData.js";

dotenv.config();

const toObjectIdArray = (arr = []) =>
  arr
    .filter(id => mongoose.Types.ObjectId.isValid(id))
    .map(id => new mongoose.Types.ObjectId(id));

const seedPublications = async () => {
  try {
    await Connection();

    let inserted = 0;
    let updated = 0;
    const warnings = [];

    for (const pub of publications) {

      if (!pub.workgroupId?.length) {
        warnings.push(`Missing workgroup for: ${pub.title}`);
      }

      if (!pub.Authors?.length) {
        warnings.push(`Missing authors for: ${pub.title}`);
      }

      const filter = { s3Url: pub.s3Url };

      const updateDoc = {
        userId: new mongoose.Types.ObjectId(pub.userId),
        fileName: pub.fileName,
        originalName: pub.originalName,
        s3Url: pub.s3Url,
        s3Key: pub.s3Key,
        thumbnailUrl: pub.thumbnailUrl,
        thumbnailKey: pub.thumbnailKey,
        fileSize: Number(pub.fileSize) || 0,
        mimeType: pub.mimeType || "application/pdf",
        uploadStatus: pub.uploadStatus || "completed",
        title: pub.title,
        subtitle: pub.subtitle || "",
        publishingDate: new Date(pub.publishingDate),
        description: pub.description || "",
        workgroupId: toObjectIdArray(pub.workgroupId),
        Authors: toObjectIdArray(pub.Authors),
        Contributers: toObjectIdArray(pub.Contributers),
        documentType: pub.documentType,
        tags: pub.tags || [],
      };

      const result = await researchPaperModel.updateOne(
        filter,
        { $set: updateDoc },
        { upsert: true, runValidators: true }
      );

      if (result.upsertedCount > 0) inserted++;
      else if (result.modifiedCount > 0) updated++;
    }

    console.log("Seeding Complete");
    console.log("Inserted:", inserted);
    console.log("Updated:", updated);

    if (warnings.length) {
      console.log("\nWarnings:");
      warnings.forEach(w => console.log("-", w));
    }

    process.exit();
  } catch (error) {
    console.error("Seeding Failed:", error);
    process.exit(1);
  }
};

seedPublications();