import Joi from "joi";

// Alternative validation schema for optional file (if you want to make file optional later)
const communityPostValidationSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .pattern(/^[a-zA-Z0-9\s\-_.!?(),]+$/)
    .required()
    .messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 50 characters',
      'string.pattern.base': 'Title contains invalid characters',
      'any.required': 'Title is required'
    }),

  content: Joi.string()
    .min(10)
    .max(1500)
    .trim()
    .required()
    .messages({
      'string.base': 'Content must be a string',
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 10 characters long',
      'string.max': 'Content cannot exceed 1500 characters',
      'any.required': 'Content is required'
    }),

  author: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.base': 'Author must be a string',
      'string.pattern.base': 'Author must be a valid MongoDB ObjectId',
      'any.required': 'Author is required'
    }),

  /* file: Joi.string()
    .allow(null, '')
    .optional()
    .uri()
    .pattern(/^https:\/\/.*\.(jpg|jpeg|png|gif|pdf|doc|docx|txt)$/i)
    .max(500)
    .messages({
      'string.base': 'File must be a string',
      'string.uri': 'File must be a valid URL',
      'string.pattern.base': 'File must be a valid URL ending with supported file extensions (jpg, jpeg, png, gif, pdf, doc, docx, txt)',
      'string.max': 'File URL cannot exceed 500 characters'
    }) */
});

export default communityPostValidationSchema;