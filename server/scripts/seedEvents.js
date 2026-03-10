import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";

import Event from "../Models/eventsModel.js";
import { transformCSV } from "./transformEvents.js";

const MONGO_USER =process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.a7cnmoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`



const s3 = new AWS.S3({
  region: process.env.AWS_REGION_PP,
  accessKeyId: process.env.AWS_ACCESS_KEY_PP,
  secretAccessKey: process.env.AWS_SECRET_KEY_PP,
});


async function uploadToS3(filePath, key) {
  const fileContent = fs.readFileSync(filePath);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME_EVENT,
    Key: key,
    Body: fileContent,
  };

  const data = await s3.upload(uploadParams).promise();

  return {
    url: data.Location,
    key
  };
}

async function seed() {
  await mongoose.connect(MONGO_URI);

  const csvPath = path.join(process.cwd(), "scripts",
  "Data Fetching - Events.csv");

  const events = await transformCSV(csvPath);

  for (const event of events) {
    try {
      let image = {
        url: "",
        key: ""
      };

      if (event.imagePath && fs.existsSync(event.imagePath)) {
        const ext = path.extname(event.imagePath);
        const key = `${event.createdBy}/${event.__slug}${ext}`;

        image = await uploadToS3(event.imagePath, key);
      }

      const upsertData = {
        title: event.title,
        description: event.description,
        type: event.type,
        image,
        locationType: event.locationType,
        location: event.location,
        eventDate: event.eventDate,
        registrationLink: event.registrationLink,
        workgroup: event.workgroup,
        slackLink: event.slackLink,
        speakers: event.speakers,
        tags: event.tags,
        createdBy: event.createdBy
      };

      await Event.updateOne(
        {
          title: event.title,
          "eventDate.start": event.eventDate.start
        },
        { $set: upsertData },
        { upsert: true }
      );

      console.log(`Upserted: ${event.title}`);
    } catch (err) {
      console.error(`Failed: ${event.title}`, err);
    }
  }

  console.log("Seeding complete.");
  process.exit();
}

seed();