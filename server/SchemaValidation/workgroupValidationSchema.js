import Joi from "joi";
import workgroupModel from "../Models/workgroupModel.js";
// Slack channel URL regex (supports custom domains and slack.com workspaces)
// Examples:
//   https://workspace.slack.com/archives/C12345678
//   https://myteam.slack.com/archives/C87654321
const slackChannelUrlRegex = /^https:\/\/[a-zA-Z0-9-]+\.slack\.com\/archives\/[A-Z0-9]+$/;

export const workgroupValidationSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.min": "Title should be at least 3 characters long",
      "string.max": "Title cannot exceed 100 characters"
    }),

  description: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      "string.empty": "Description is required",
      "string.min": "Description should be at least 10 characters long",
      "string.max": "Description cannot exceed 1000 characters"
    }),

  researchFocus: Joi.string()
    .allow("")
    .max(200)
    .messages({
      "string.max": "Research focus cannot exceed 200 characters"
    }),

  maxMembers: Joi.number()
    .integer()
    .min(1)
    .max(1000)
    .default(100)
    .messages({
      "number.base": "Max members must be a number",
      "number.integer": "Max members must be an integer",
      "number.min": "There must be at least 1 member allowed",
      "number.max": "Max members cannot exceed 1000"
    }),

  slackChannelName: Joi.string()
    .pattern(slackChannelUrlRegex)
    .required()
    .messages({
      "string.pattern.base": "Slack channel must be a valid Slack channel link (e.g., https://workspace.slack.com/archives/C12345678)"
    }),

  coordinator: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Coordinator must be a valid email address",
      "string.empty": "Coordinator email is required"
    }),

  objectives: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      "string.empty": "Objectives are required",
      "string.min": "Objectives should be at least 5 characters long",
      "string.max": "Objectives cannot exceed 500 characters"
    }),

  researchPapers: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)) 
    .optional()
})
