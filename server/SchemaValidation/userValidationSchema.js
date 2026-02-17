import Joi from "joi";

const userValidationSchema = Joi.object({
  clerkUserId: Joi.string().required(),

  FullName: Joi.string().max(100).required(),
  
  email: Joi.string().email().required(),
  
  password: Joi.string().min(6).required(), // You may adjust length/security policy as needed

  role: Joi.string()
    .valid("core", "user", "chair")
    .default("user"),

  fellowshipId: Joi.string().optional().allow(null, ''), // MongoDB ObjectId
  profilePicture: Joi.any().optional(),

  socialLinks: Joi.object({
    twitter: Joi.string().uri().allow(""),
    LinkedIn: Joi.string().uri().allow(""),
    Instagram: Joi.string().uri().allow("")
  }).optional(),

  membership: Joi.object({
    isActive: Joi.boolean().default(false),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional()
  }).optional(),

  workgroupId: Joi.string().optional().allow(null, ''),

  eventsRegistered: Joi.array().items(Joi.string()).optional(),
  eventsParticipated: Joi.array().items(Joi.string()).optional(),
  eventsSpokenAt: Joi.array().items(Joi.string()).optional(),

  referencesGiven: Joi.array().items(Joi.string()).optional(),
  followedTopics: Joi.string().optional().allow(""),
  followedTopicsArray: Joi.array().items(Joi.string()).optional(),

  isSubscribedToNewsletter: Joi.boolean().default(false),

  location: Joi.string().max(100).allow("").optional(),
  title: Joi.string().max(100).allow("").optional(),
  department: Joi.string().max(100).allow("").optional(),
  company: Joi.string().max(100).allow("").optional(),
  expertise: Joi.string().optional().allow(""),
  expertiseArray: Joi.array().items(Joi.string()).optional(),
  introduction : Joi.string().max(3000).allow("", null).optional(),

  discoverySource: Joi.string()
    .valid(
      "LinkedIn", "Twitter/X", "Instagram", "Email Newsletter", "College/University",
      "Company/Organization", "Hackathon or Event", "Friend", "Family", "Colleague",
      "Google Search", "News Article or Blog", "Other"
    )
    .required(),
});

export default userValidationSchema;
