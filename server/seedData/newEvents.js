import mongoose from "mongoose";

const { Types } = mongoose;
const ObjectId = Types.ObjectId;
const events = [
  {
    title: "We The People",
    subtitle: "Reclaiming Accountability in the Age of Intelligent Systems",
    description: "As part of its return to Washington, DC for the second convening in the We The People series—We The People: Reclaiming Accountability in the Age of Intelligent Systems—The Digital Economist will engage policymakers, financial institutions, and cross-sector leaders in conjunction with the World Bank Group and International Monetary Fund Spring Meetings to address a defining challenge: how to restore institutional legitimacy in systems increasingly mediated by digital infrastructure, artificial intelligence, and distributed networks. The engagement will move beyond how digital systems are financed and integrated into national development strategies to examine how transparency, accountability, and shared oversight can be embedded into the architectures shaping economic decision-making—spanning data infrastructures, algorithmic systems, and financial technologies—and how these systems can sustain trust through clearer lines of authority, traceability of decisions, and institutional mechanisms capable of serving the public interest in an era of accelerated, networked complexity.",
    type: "Summit", // e.g. workshop | webinar | conference | meetup
    image: {
      url: "https://tde-assets-events.s3.eu-north-1.amazonaws.com/69395caf541181e114939124/69bcf1b033cc1a0e269b092c_We+The+People+2026.jpg",
      key: "69395caf541181e114939124/69bcf1b033cc1a0e269b092c_We The People 2026.jpg"
    },
    locationType: "On-site", // or "offline" / "hybrid"
    location: "The Spire, 750 First St NE, Washington, D.C.",
    eventDate: {
      start: new Date("2026-04-13T09:00:00Z"),
      end: new Date("2026-01-01T17:00:00Z")
    },
    registrationLink: "https://thedigitaleconomist.typeform.com/wethepeople?typeform-source=thedigitaleconomist.com",
    workgroup: [new ObjectId('698cdd95a0d9354807be9ba9'),new ObjectId('698cdd95a0d9354807be9bae'),new ObjectId('698cdd95a0d9354807be9bb3'),new ObjectId('698cdd95a0d9354807be9bb8'),new ObjectId('698cdd95a0d9354807be9bbd')], 
    embedding: null,
    slackLink: "",
    speakers: [
      {
        speakerRef: new ObjectId('699624dde1e6c832bf80fc89'), // replace with ObjectId
      },
      {
        speakerRef: new ObjectId('699624dee1e6c832bf80fc8b'), // replace with ObjectId
      },
      {
        speakerRef: new ObjectId('699624dfe1e6c832bf80fc8d'), // replace with ObjectId
      },
      {
        speakerRef: new ObjectId('699624e2e1e6c832bf80fc91'), // replace with ObjectId
      },
      {
        speakerRef: new ObjectId('6996282396f9379a66b48999'), // replace with ObjectId
      },
      {
        speakerRef: new ObjectId('69a278b3547ba10651c4f192'),
      },
      {
        speakerRef: new ObjectId('69a27ea1c70eeeb5c07ec714'),
      },
      {
        speakerRef: new ObjectId('69a278b3547ba10651c4f190'),
      },
      {
        speakerRef: new ObjectId('69a00710fd4f0afde54dc93c'),
      },
      {
        speakerRef: new ObjectId('69a3bc7c774d2a748e4c36b9'),
      },
      {
        speakerRef: new ObjectId('69a278b2547ba10651c4f18e'),
      },{
        speakerRef: new ObjectId('69a3bc79774d2a748e4c36af'),
      },
      {
        speakerRef: new ObjectId('69a3bc7d774d2a748e4c36bd'),
      },
      {
        speakerRef: new ObjectId('69a278b0547ba10651c4f184'),
      },
      {
        speakerRef: new ObjectId('69a278b4547ba10651c4f196'),
      },
      {
        speakerRef: new ObjectId('69a3bc7b774d2a748e4c36b7'),
      },
      {
        speakerRef: new ObjectId('69a00713fd4f0afde54dc946'),
      },
      {
        speakerRef: new ObjectId('69a278b1547ba10651c4f188'),
      },
      {
        speakerRef: new ObjectId('69a00711fd4f0afde54dc940'),
      },
      {
        speakerRef: new ObjectId('69a27ea1c70eeeb5c07ec716'),
      }
    ],
    tags: ["AI", "Tech", "Innovation"],
    createdBy: null // replace with ObjectId
  },
/* {
    title: "The Digital Economist's April Roundtable",
    subtitle: "The Digital Economist will host the April 2026 Monthly Roundtable, organized by the Digital Assets & Blockchain Tech Workgroup, on April 16, 2026, from 11:00 AM to 12:00 PM EST. This virtual session will convene participants for a moderated discussion on developments at the intersection of blockchain technology, digital assets, and the evolving digital economy. The specific topic and confirmed speakers will be announced soon. Participants are invited to pre-register for the event to receive updates and access details.",
    description: "As part of its return to Washington, DC for the second convening in the We The People series—We The People: Reclaiming Accountability in the Age of Intelligent Systems—The Digital Economist will engage policymakers, financial institutions, and cross-sector leaders in conjunction with the World Bank Group and International Monetary Fund Spring Meetings to address a defining challenge: how to restore institutional legitimacy in systems increasingly mediated by digital infrastructure, artificial intelligence, and distributed networks. The engagement will move beyond how digital systems are financed and integrated into national development strategies to examine how transparency, accountability, and shared oversight can be embedded into the architectures shaping economic decision-making—spanning data infrastructures, algorithmic systems, and financial technologies—and how these systems can sustain trust through clearer lines of authority, traceability of decisions, and institutional mechanisms capable of serving the public interest in an era of accelerated, networked complexity.",
    type: "Roundtable", // e.g. workshop | webinar | conference | meetup
    image: {
      url: "https://tde-assets-events.s3.eu-north-1.amazonaws.com/69395caf541181e114939124/default.jpg",
      key: "69395caf541181e114939124/default.jpg"
    },
    locationType: "Online", // or "offline" / "hybrid"
    location: "Virtual",
    eventDate: {
      start: new Date("2026-04-16T11:00:00Z"),
      end: new Date("2026-04-16T12:00:00Z")
    },
    registrationLink: "https://thedigitaleconomist.typeform.com/blockchain-1?typeform-source=thedigitaleconomist.com",
    workgroup: [new ObjectId('698cdd95a0d9354807be9bae')], 
    embedding: null,
    slackLink: "",
    speakers: [
     
    ],
    tags: ["AI", "Tech", "Innovation"],
    createdBy: null // replace with ObjectId
  },
  {
    title: "We The People",
    subtitle: "Reclaiming Accountability in the Age of Intelligent Systems",
    description: "As part of its return to Washington, DC for the second convening in the We The People series—We The People: Reclaiming Accountability in the Age of Intelligent Systems—The Digital Economist will engage policymakers, financial institutions, and cross-sector leaders in conjunction with the World Bank Group and International Monetary Fund Spring Meetings to address a defining challenge: how to restore institutional legitimacy in systems increasingly mediated by digital infrastructure, artificial intelligence, and distributed networks. The engagement will move beyond how digital systems are financed and integrated into national development strategies to examine how transparency, accountability, and shared oversight can be embedded into the architectures shaping economic decision-making—spanning data infrastructures, algorithmic systems, and financial technologies—and how these systems can sustain trust through clearer lines of authority, traceability of decisions, and institutional mechanisms capable of serving the public interest in an era of accelerated, networked complexity.",
    type: "Summit", // e.g. workshop | webinar | conference | meetup
    image: {
      url: "https://tde-assets-events.s3.eu-north-1.amazonaws.com/69395caf541181e114939124/default.jpg",
      key: "69395caf541181e114939124/default.jpg"
    },
    locationType: "On-site", // or "offline" / "hybrid"
    location: "The Spire, 750 First St NE, Washington, D.C.",
    eventDate: {
      start: new Date("2026-04-13T09:00:00Z"),
      end: new Date("2026-01-01T17:00:00Z")
    },
    registrationLink: "https://thedigitaleconomist.typeform.com/wethepeople?typeform-source=thedigitaleconomist.com",
    workgroup: [new ObjectId('698cdd95a0d9354807be9ba9'),new ObjectId('698cdd95a0d9354807be9bae'),new ObjectId('698cdd95a0d9354807be9bb3'),new ObjectId('698cdd95a0d9354807be9bb8'),new ObjectId('698cdd95a0d9354807be9bbd')], 
    embedding: null,
    slackLink: "",
    speakers: [
      {
        speakerRef: new ObjectId('699624dde1e6c832bf80fc89'), // replace with ObjectId
      },
      {
        speakerRef: new ObjectId('699624dee1e6c832bf80fc8b'), // replace with ObjectId
      },
      {
        speakerRef: new ObjectId('699624dfe1e6c832bf80fc8d'), // replace with ObjectId
      },
      {
        speakerRef: new ObjectId('699624e2e1e6c832bf80fc91'), // replace with ObjectId
      },
      {
        speakerRef: new ObjectId('6996282396f9379a66b48999'), // replace with ObjectId
      }
    ],
    tags: ["AI", "Tech", "Innovation"],
    createdBy: null // replace with ObjectId
  },

  {
    title: "The Digital Economist's May Roundtable",
    subtitle: "",
    description: "The Digital Economist will host the May 2026 Monthly Roundtable, organized by the Applied Artificial Intelligence Workgroup, on May 14, 2026, from 11:00 AM to 12:00 PM EST. This virtual discussion will bring together participants to examine developments in applied AI and its implications for industry, governance, and innovation. The specific topic and confirmed speakers will be announced soon. Participants are invited to pre-register for the event to receive updates and access details.",
    type: "Roundtable", // e.g. workshop | webinar | conference | meetup
    image: {
      url: "https://tde-assets-events.s3.eu-north-1.amazonaws.com/69395caf541181e114939124/default.jpg",
      key: "69395caf541181e114939124/default.jpg"
    },
    locationType: "Online", // or "offline" / "hybrid"
    location: "Virtual",
    eventDate: {
      start: new Date("2026-05-14T11:00:00Z"),
      end: new Date("2026-05-14T12:00:00Z")
    },
    registrationLink: "https://thedigitaleconomist.typeform.com/applied-ai-1?typeform-source=thedigitaleconomist.com",
    workgroup: [new ObjectId('698cdd95a0d9354807be9bb8')], 
    embedding: null,
    slackLink: "",
    speakers: [
     
    ],
    tags: ["AI", "Tech", "Innovation"],
    createdBy: null // replace with ObjectId
  },
  
  {
    title: "The Digital Economist's July Roundtable",
    subtitle: "",
    description: "The Digital Economist will host the July 2026 Monthly Roundtable, organized by the Healthcare Innovation Workgroup, on July 16, 2026, from 11:00 AM to 12:00 PM EST. This virtual session will convene participants to explore emerging trends and strategic considerations shaping healthcare innovation and digital health systems. The specific topic and confirmed speakers will be announced soon. Participants are invited to pre-register for the event to receive updates and access details.",
    type: "Roundtable", // e.g. workshop | webinar | conference | meetup
    image: {
      url: "https://tde-assets-events.s3.eu-north-1.amazonaws.com/69395caf541181e114939124/default.jpg",
      key: "69395caf541181e114939124/default.jpg"
    },
    locationType: "Online", // or "offline" / "hybrid"
    location: "Virtual",
    eventDate: {
      start: new Date("2026-07-16T11:00:00Z"),
      end: new Date("2026-07-16T12:00:00Z")
    },
    registrationLink: "https://thedigitaleconomist.typeform.com/HI-roundtable?typeform-source=thedigitaleconomist.com",
    workgroup: [new ObjectId('698cdd95a0d9354807be9bbd')], 
    embedding: null,
    slackLink: "",
    speakers: [
     
    ],
    tags: ["AI", "Tech", "Innovation"],
    createdBy: null // replace with ObjectId
  },

   {
    title: "The Digital Economist's August Roundtable",
    subtitle: "",
    description: "The Digital Economist will host the August 2026 Monthly Roundtable, organized by the Sustainability in Tech Workgroup, on August 13, 2026, from 11:00 AM to 12:00 PM EST. This virtual discussion will bring together participants to examine how technological developments intersect with sustainability initiatives and climate-aligned innovation. The specific topic and confirmed speakers will be announced soon. Participants are invited to pre-register for the event to receive updates and access details.",
    type: "Roundtable", // e.g. workshop | webinar | conference | meetup
    image: {
      url: "https://tde-assets-events.s3.eu-north-1.amazonaws.com/69395caf541181e114939124/default.jpg",
      key: "69395caf541181e114939124/default.jpg"
    },
    locationType: "Online", // or "offline" / "hybrid"
    location: "Virtual",
    eventDate: {
      start: new Date("2026-08-13T11:00:00Z"),
      end: new Date("2026-08-13T12:00:00Z")
    },
    registrationLink: "https://thedigitaleconomist.typeform.com/sustainability?typeform-source=thedigitaleconomist.com",
    workgroup: [new ObjectId('698cdd95a0d9354807be9bb3')], 
    embedding: null,
    slackLink: "",
    speakers: [
     
    ],
    tags: ["AI", "Tech", "Innovation"],
    createdBy: null // replace with ObjectId
  },

  {
    title: "The Digital Economist's September Roundtable",
    subtitle: "",
    description: "The Digital Economist will host the September 2026 Monthly Roundtable, organized by the Tech Policy and Governance Workgroup, on September 17, 2026, from 11:00 AM to 12:00 PM EST. This virtual session will convene participants to discuss emerging policy frameworks, governance challenges, and institutional approaches shaping the digital economy. The specific topic and confirmed speakers will be announced soon. Participants are invited to pre-register for the event to receive updates and access details.",
    type: "Roundtable", // e.g. workshop | webinar | conference | meetup
    image: {
      url: "https://tde-assets-events.s3.eu-north-1.amazonaws.com/69395caf541181e114939124/default.jpg",
      key: "69395caf541181e114939124/default.jpg"
    },
    locationType: "Online", // or "offline" / "hybrid"
    location: "Virtual",
    eventDate: {
      start: new Date("2026-09-13T11:00:00Z"),
      end: new Date("2026-09-13T12:00:00Z")
    },
    registrationLink: "https://thedigitaleconomist.typeform.com/tech-policy-gov?typeform-source=thedigitaleconomist.com",
    workgroup: [new ObjectId('698cdd95a0d9354807be9ba9')], 
    embedding: null,
    slackLink: "",
    speakers: [
     
    ],
    tags: ["AI", "Tech", "Innovation"],
    createdBy: null // replace with ObjectId
  },

   {
    title: "The Digital Economist's October Roundtable",
    subtitle: "",
    description: "The Digital Economist will host the October 2026 Monthly Roundtable, organized by the Digital Assets & Blockchain Tech Workgroup, on October 15, 2026, from 11:00 AM to 12:00 PM EST. This virtual discussion will bring together participants to examine developments in blockchain infrastructure, digital assets, and the broader financial and technological ecosystem. The specific topic and confirmed speakers will be announced soon. Participants are invited to pre-register for the event to receive updates and access details.",
    type: "Roundtable", // e.g. workshop | webinar | conference | meetup
    image: {
      url: "https://tde-assets-events.s3.eu-north-1.amazonaws.com/69395caf541181e114939124/default.jpg",
      key: "69395caf541181e114939124/default.jpg"
    },
    locationType: "Online", // or "offline" / "hybrid"
    location: "Virtual",
    eventDate: {
      start: new Date("2026-10-15T11:00:00Z"),
      end: new Date("2026-10-15T12:00:00Z")
    },
    registrationLink: "https://thedigitaleconomist.typeform.com/blockchain-2",
    workgroup: [new ObjectId('698cdd95a0d9354807be9bae')], 
    embedding: null,
    slackLink: "",
    speakers: [
     
    ],
    tags: ["AI", "Tech", "Innovation"],
    createdBy: null // replace with ObjectId
  },

   {
    title: "The Digital Economist's December Roundtable",
    subtitle: "",
    description: "The Digital Economist will host the December 2026 Monthly Roundtable, organized by the Applied Artificial Intelligence Workgroup, on December 17, 2026, from 11:00 AM to 12:00 PM EST. This virtual session will convene participants to explore current developments and strategic considerations in applied artificial intelligence across sectors. The specific topic and confirmed speakers will be announced soon. Participants are invited to pre-register for the event to receive updates and access details.",
    type: "Roundtable", // e.g. workshop | webinar | conference | meetup
    image: {
      url: "https://tde-assets-events.s3.eu-north-1.amazonaws.com/69395caf541181e114939124/default.jpg",
      key: "69395caf541181e114939124/default.jpg"
    },
    locationType: "Online", // or "offline" / "hybrid"
    location: "Virtual",
    eventDate: {
      start: new Date("2026-12-17T11:00:00Z"),
      end: new Date("2026-12-17T12:00:00Z")
    },
    registrationLink: "https://thedigitaleconomist.typeform.com/applied-ai-2?typeform-source=thedigitaleconomist.com",
    workgroup: [new ObjectId('698cdd95a0d9354807be9bb8')], 
    embedding: null,
    slackLink: "",
    speakers: [
     
    ],
    tags: ["AI", "Tech", "Innovation"],
    createdBy: null // replace with ObjectId
  }, */
  
];

export default events;

import dotenv from "dotenv";
import eventsModel from "../Models/eventsModel.js"

dotenv.config();

const MONGO_USER =process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.a7cnmoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


const seedEvents = async () => {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("MongoDB connected");

    // Insert new events
    await eventsModel.insertMany(events);

    console.log("Events inserted successfully");

    process.exit();
  } catch (error) {
    console.error("Error seeding events:", error);
    process.exit(1);
  }
};

seedEvents();