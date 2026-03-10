import fs from "fs";
import csv from "csv-parser";

const USERS = [];

fs.createReadStream("./Data Fetching - User Data.csv")
  .pipe(csv())
  .on("data", (row) => {
    const email = row["Email"]?.trim();
    const name = row["Full Name"]?.trim();

    // skip invalid rows
    if (!email || !name) return;

    const expertiseRaw = row["Areas of Expertise (comma separated)"];
    const expertise = expertiseRaw
      ? expertiseRaw.split(",").map(e => e.trim()).filter(Boolean)
      : [];

    USERS.push({
      email,
      FullName: name,
      role: "user",
      title: row["Title/Designation"] || null,
      company: row["Company/Organization"] || null,
      location: row["Location"] || null,
      department: row["Department"] || null,
      introduction: row["Introduction(max 2000 chars)"] || null,
      discoverySource: null,
      isSubscribedToNewsletter:
        row["Newsletter Subscriber? (Yes/No)"] === "Yes",
      expertise,
      followedTopics: [],
      socialLinks: {
        twitter: row["Twitter URL"] || "",
        LinkedIn: row["LinkedIn URL"] || "",
        Instagram: row["Instagram URL"] || "",
      },
      profilePicture: row["Profile Picture Link"] || null,
    });
  })
  .on("end", () => {
    fs.writeFileSync(
      "./USERS.json",
      JSON.stringify(USERS, null, 2)
    );
    console.log("USERS.json generated");
  });
