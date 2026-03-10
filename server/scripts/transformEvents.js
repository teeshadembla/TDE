import fs from "fs";
import csv from "csv-parser";
import slugify from "slugify";
import mongoose from "mongoose";

const CREATED_BY = new mongoose.Types.ObjectId("69395caf541181e114939124");

const WORKGROUP_SLUG_TO_ID = {
  "cyber-studio": "698cdd95a0d9354807be9bc7",
  "tech-policy-and-governance": "698cdd95a0d9354807be9ba9",
  "digital-assets-and-blockchain": "698cdd95a0d9354807be9bae",
  "sustainability-in-tech": "698cdd95a0d9354807be9bb3",
  "healthcare-innovation": "698cdd95a0d9354807be9bbd",
  "applied-artificial-intelligence": "698cdd95a0d9354807be9bb8",
  "quantum-computing": "698cdd95a0d9354807be9bc2"
};

function normalizeSlug(str) {
  return str?.toLowerCase().trim().replace(/\s+/g, "-");
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function splitField(field) {
  if (!field) return [];
  return field
    .split(/[,;]+/)
    .map(v => v.trim())
    .filter(Boolean);
}

export async function transformCSV(filePath) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        try {
          const startDate = parseDate(row["eventDate - Start"]);
          const endDate = parseDate(row["eventDate - end"]);

          const year = startDate ? startDate.getUTCFullYear() : "";
          const slug = slugify(row.title || "", {
            lower: true,
            strict: true
          });
          const generatedSlug = year ? `${slug}-${year}` : slug;

          const tags = splitField(row.tags).map(t => t.toLowerCase());

          const workgroups = splitField(row.Workgroup)
            .map(w => normalizeSlug(w))
            .map(w => WORKGROUP_SLUG_TO_ID[w])
            .filter(Boolean)
            .map(id => new mongoose.Types.ObjectId(id));

          results.push({
            title: row.title || "",
            description: row.description || "",
            type: row.category || "",
            imagePath: row["thumbnail Image"] || "",
            locationType: row.locationType || "",
            location:
              row.locationType?.toLowerCase() === "virtual"
                ? "Online"
                : row.location || "",
            eventDate: {
              start: startDate,
              end: endDate
            },
            registrationLink: row.registrationLink || "",
            workgroup: workgroups,
            slackLink: "",
            speakers: [],
            tags,
            createdBy: CREATED_BY,
            __slug: generatedSlug
          });
        } catch (err) {
          console.error("Row parsing error:", err);
        }
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}