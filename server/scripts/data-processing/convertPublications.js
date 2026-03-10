import fs from "fs";
import path from "path";
import xlsx from "xlsx";

const FILE_PATH = "./Data fetching.xlsx"; // adjust if needed
const OUTPUT_PATH = "./publicationData.js";

const CONSTANT_USER_ID = "69395caf541181e114939124";

const WORKGROUP_MAP = {
  "applied-artificial-intelligence": "698cdd95a0d9354807be9bb8",
  "tech-policy-and-governance": "698cdd95a0d9354807be9ba9",
  "government": "698cdd95a0d9354807be9ba9",
  "digital-assets-blockchain": "698cdd95a0d9354807be9bae",
  "sustainability-in-tech": "698cdd95a0d9354807be9bb3",
  "healthcare-innovation": "698cdd95a0d9354807be9bbd",
  "cyber-studio": "698cdd95a0d9354807be9bc7",
  "quantum-computing": "698cdd95a0d9354807be9bc2"
};

const VALID_OBJECTID_REGEX = /^[a-f\d]{24}$/i;

const capitalizeDocumentType = (type) => {
  if (!type) return "";
  return type
    .toLowerCase()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const extractValidObjectIds = (value) => {
  if (!value) return [];

  return value
    .toString()
    .replace(/\n/g, ",")
    .split(",")
    .map(v => v.trim())
    .filter(v => VALID_OBJECTID_REGEX.test(v));
};

const splitTags = (value) => {
  if (!value) return [];
  return value
    .toString()
    .split("|")
    .map(t => t.trim())
    .filter(Boolean);
};

const splitWorkgroups = (value) => {
  if (!value) return [];

  return value
    .toString()
    .split(";")
    .map(w => w.trim())
    .map(w => WORKGROUP_MAP[w])
    .filter(Boolean);
};

const workbook = xlsx.readFile(FILE_PATH);
const sheet = workbook.Sheets["Publications"];

if (!sheet) {
  console.error("Sheet 'publications' not found.");
  process.exit(1);
}

const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

// Remove first row
rows.shift();

const publications = rows.map((row, index) => ({
  userId: CONSTANT_USER_ID,
  fileName: path.basename(row.s3Url || `file_${index + 1}.pdf`),
  originalName: path.basename(row.s3Url || `file_${index + 1}.pdf`),
  s3Url: row.s3Url,
  s3Key: `TEMP_KEY_${index + 1}`,
  thumbnailUrl: "TEMP_THUMBNAIL_URL",
  thumbnailKey: `TEMP_THUMBNAIL_KEY_${index + 1}`,
  fileSize: 0,
  mimeType: "application/pdf",
  uploadStatus: "completed",
  title: row.title || "",
  subtitle: row.subtitle || "",
  publishingDate: new Date(row.publicationDate),
  description: row.Description || "",
  workgroupId: splitWorkgroups(row.workgroup),
  Authors: extractValidObjectIds(row["Authors(comma separated)"]),
  Contributers: extractValidObjectIds(row["Contributers(comma separated)"]),
  documentType: capitalizeDocumentType(row.documentType),
  tags: splitTags(row["tags(comma separated)"])
}));

const fileContent = `
const publications = ${JSON.stringify(publications, null, 2)};
export default publications;
`;

fs.writeFileSync(OUTPUT_PATH, fileContent);

console.log("publicationData.js generated successfully.");