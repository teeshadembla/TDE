/**
 * ============================================================
 *  seedUsers.js — One-time user initialization script
 *  Stack: MERN + Clerk
 * ============================================================
 *
 *  BEFORE RUNNING:
 *  1. npm install @clerk/clerk-sdk-node mongoose dotenv
 *  2. Make sure your .env has:
 *       CLERK_SECRET_KEY=sk_...
 *       MONGODB_URI=mongodb+srv://...
 *  3. Fill in the USERS array below
 *  4. Run: node seedUsers.js
 *
 *  OUTPUT:
 *  - Creates each user in Clerk (bypasses email verification)
 *  - Creates matching document in MongoDB users collection
 *  - Saves credentials report to: seeded_credentials.json
 * ============================================================
 */

import 'dotenv/config';
import { createClerkClient } from '@clerk/backend';import mongoose from 'mongoose';
import fs from 'fs';
import crypto from 'crypto';

const MONGO_USER =process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.a7cnmoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


// ─────────────────────────────────────────────
//  MONGOOSE USER MODEL (paste your schema here)
// ─────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  clerkUserId:      { type: String, required: true, unique: true, index: true },
  FullName:         { type: String, required: true },
  email:            { type: String, required: true, unique: true },
  profilePicture:   { type: String, required: false, default: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg" },
  role:             { type: String, enum: ["admin", "core", "user", "chair"], required: true },
  fellowshipId:     { type: mongoose.Schema.Types.ObjectId, ref: "Fellowship", default: null },
  socialLinks: {
    twitter:        { type: String, default: "" },
    LinkedIn:       { type: String, default: "" },
    Instagram:      { type: String, default: "" },
  },
  activeMembership: { type: mongoose.Schema.Types.ObjectId, ref: "Membership", default: null },
  organization:     { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
  workGroupId:      { type: mongoose.Schema.Types.ObjectId, ref: "Workgroup" },
  eventsRegistered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  eventsParticipated:[{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  eventsSpokenAt:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  referencesGiven:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followedTopics:   [{ type: String }],
  isSubscribedToNewsletter: { type: Boolean, default: false },
  location:         { type: String, maxlength: 100, default: null },
  title:            { type: String, maxlength: 100, default: null },
  department:       { type: String, maxlength: 100, default: null },
  company:          { type: String, maxlength: 100, default: null },
  expertise:        [{ type: String }],
  discoverySource: {
    type: String,
    enum: [
      "LinkedIn", "Twitter/X", "Instagram", "Email Newsletter", "College/University",
      "Company/Organization", "Hackathon or Event", "Friend", "Family", "Colleague",
      "Google Search", "News Article or Blog", "Other"
    ],
  },
  isVerifiedbyAdmin:  { type: Boolean, required: true, default: false },
  isRejectedByAdmin:  { type: Boolean, required: true, default: true },
  isMFAenabled:       { type: Boolean, required: true, default: false },
  lastPasswordReset:  { type: Date, default: null },
  passwordResetHistory: [{ resetAt: Date, ipAddress: String }],
  introduction:       { type: String, maxlength: 2000, default: null },
  stripeCustomerId:   { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);


// ─────────────────────────────────────────────
//  FILL IN YOUR USERS HERE
//
//  REQUIRED fields (must fill):
//    - email      : string  — user's email address
//    - FullName   : string  — user's full name
//    - role       : string  — "admin" | "core" | "user"
//
//  OPTIONAL fields (leave as null/"" to use defaults):
//    - title          : string  — job title e.g. "Software Engineer"
//    - company        : string  — e.g. "Google"
//    - location       : string  — e.g. "New York, USA"
//    - department     : string  — e.g. "Engineering"
//    - introduction   : string  — short bio (max 2000 chars)
//    - discoverySource: string  — one of the enum values above
//    - isSubscribedToNewsletter: boolean
//    - expertise      : array   — e.g. ["AI", "Web Dev"]
//    - followedTopics : array   — e.g. ["Climate", "Startups"]
//    - socialLinks    : object  — { twitter, LinkedIn, Instagram }
//    - profilePicture : string  — URL to profile image (or leave null for default)
// ─────────────────────────────────────────────
const USERS = [
  // ── TEMPLATE — duplicate this block for each user ──
 {
  "email": "teeshadembla0507@gmail.com",
  "FullName": "Resham Kataria",
  "role": "user",
  "title": "Program Support Lead",
  "company": "The Digital Economist",
  "location": null,
  "department": "Our Team",
  "introduction": "Resham Kataria serves as Program Support Lead at The Digital Economist, where she supports program coordination across research, convenings, and digital initiatives. Her role focuses on operational execution, stakeholder coordination, and day-to-day program support across technology-, policy-, and research-driven workstreams within the organization’s global fellowship ecosystem.\n\nWith a background in information technology, Resham brings a detail-oriented and execution-focused approach to her work. She supports cross-functional teams through structured coordination, clear communication, and reliable follow-through, helping ensure that programs move efficiently from planning to delivery. Motivated by continuous learning, Resham contributes to initiatives at the intersection of technology, strategy, and digital transformation. Her work reflects a growing focus on operational rigor and systems thinking within complex, globally distributed programs.",
  "discoverySource": null,
  "isSubscribedToNewsletter": false,
  "expertise": [],
  "followedTopics": [],
  "socialLinks": {
    "twitter": "",
    "LinkedIn": "https://www.linkedin.com/in/reshamkataria/",
    "Instagram": ""
  },
  "profilePicture": null
}


  // ── ADD MORE USERS BELOW ──
  // {
  //   email:      "admin@example.com",
  //   FullName:   "Admin User",
  //   role:       "admin",
  //   title:      "Director",
  //   company:    "Org HQ",
  //   location:   "San Francisco, USA",
  //   department: "Leadership",
  //   introduction: "Heads the admin team.",
  //   discoverySource: "LinkedIn",
  //   isSubscribedToNewsletter: true,
  //   expertise:  ["Strategy", "Operations"],
  //   followedTopics: ["Governance"],
  //   socialLinks: { twitter: "", LinkedIn: "https://linkedin.com/in/admin", Instagram: "" },
  //   profilePicture: null,
  // },
];


// ─────────────────────────────────────────────
//  SEED LOGIC — do not edit below this line
// ─────────────────────────────────────────────

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
async function generatePassword() {
  // Produces something like: Seed#a3f8B2c1
  // Strong enough for Clerk, easy to hand off to users who must reset it
  const random = crypto.randomBytes(6).toString('hex');
  return `Seed#${random.charAt(0).toUpperCase()}${random.slice(1)}`;
}

async function seedUsers() {
  // ── Connect to MongoDB ──
  console.log('\n🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected.\n');

  const results   = [];
  const failures  = [];

  for (const userData of USERS) {
    const { email, FullName, role, ...optionals } = userData;

    // Basic validation
    if (!email || !FullName || !role) {
      console.error(`❌ Skipping entry — missing required field (email/FullName/role):`, userData);
      failures.push({ email, reason: 'Missing required field' });
      continue;
    }

    const tempPassword = await generatePassword();

    try {
      // ── 1. Create user in Clerk ──
      console.log(`⏳ Creating Clerk user: ${email}`);
      const clerkUser = await clerkClient.users.createUser({
        emailAddress:     [email],
        password:         tempPassword,
        firstName:        FullName.split(' ')[0],
        lastName:         FullName.split(' ').slice(1).join(' ') || '',
        skipPasswordChecks: true,          // allows temp/weak passwords
        publicMetadata: {
          role,
          title:      optionals.title      ?? "",
          company:    optionals.company    ?? "",
          location:   optionals.location   ?? "",
          department: optionals.department ?? "",
        },
        privateMetadata: {
          discoverySource:          optionals.discoverySource          ?? null,
          isSubscribedToNewsletter: optionals.isSubscribedToNewsletter ?? false,
        },
      });

      console.log(`   ✅ Clerk user created — ID: ${clerkUser.id}`);

      // ── 2. Create user in MongoDB ──
      console.log(`   💾 Inserting into MongoDB...`);
      const mongoUser = new User({
        clerkUserId:   clerkUser.id,
        FullName,
        email,
        role,

        // Seeded users are immediately active
        isVerifiedbyAdmin: true,
        isRejectedByAdmin: false,

        // Optional profile fields
        title:          optionals.title          ?? null,
        company:        optionals.company        ?? null,
        location:       optionals.location       ?? null,
        department:     optionals.department     ?? null,
        introduction:   optionals.introduction   ?? null,
        discoverySource: optionals.discoverySource ?? undefined,
        isSubscribedToNewsletter: optionals.isSubscribedToNewsletter ?? false,
        expertise:      optionals.expertise      ?? [],
        followedTopics: optionals.followedTopics ?? [],
        socialLinks:    optionals.socialLinks    ?? { twitter: "", LinkedIn: "", Instagram: "" },
        profilePicture: optionals.profilePicture ?? undefined, // falls back to schema default
      });

      await mongoUser.save();
      console.log(`   ✅ MongoDB document created — _id: ${mongoUser._id}\n`);

      results.push({
        email,
        FullName,
        role,
        clerkId:       clerkUser.id,
        mongoId:       mongoUser._id.toString(),
        tempPassword,  // ⚠️ distribute securely and ask user to reset on first login
      });

    } catch (err) {
      console.error(`   ❌ Failed for ${email}:`, err?.errors?.[0]?.message ?? err.message);
      failures.push({ email, reason: err?.errors?.[0]?.message ?? err.message });
    }
  }

  // ── Write credentials report ──
  const reportPath = './seeded_credentials.json';
  fs.writeFileSync(reportPath, JSON.stringify({ success: results, failures }, null, 2));

  // ── Summary ──
  console.log('═══════════════════════════════════════');
  console.log(`  SEED COMPLETE`);
  console.log(`  ✅ Seeded : ${results.length} user(s)`);
  console.log(`  ❌ Failed : ${failures.length} user(s)`);
  console.log(`  📄 Credentials saved to: ${reportPath}`);
  console.log('═══════════════════════════════════════');
  console.log('  ⚠️  IMPORTANT:');
  console.log('  - Distribute temp passwords securely (not plain email)');
  console.log('  - Ask users to reset their password on first login');
  console.log('  - Delete seeded_credentials.json after distribution');
  console.log('═══════════════════════════════════════\n');

  await mongoose.disconnect();
}

seedUsers().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});