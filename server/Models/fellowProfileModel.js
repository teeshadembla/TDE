// models/fellowProfileModel.js
import mongoose from 'mongoose';

const fellowProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One profile per user
  },
  // PUBLIC PROFILE DATA (what appears on Fellows page)
  displayName: {
    type: String,
    maxlength: 100
  },
  professionalHeadshotUrl: {
    type: String, // URL to image
  },
  professionalHeadshotKey: {
    type: String,
  },
  headline: {
    type: String, // e.g., "AI Researcher | Senior Fellow"
    maxlength: 150
  },
  bio: {
    type: String,
    minlength: 0,
    maxlength: 500
  },
  expertise: [{
    type: String,
  }], // Minimum 3 tags
  currentRole: {
    title: { type: String },
    organization: { type: String }
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  portfolioItems: [{
    title: String,
    description: String,
    url: String,
    type: { type: String, enum: ['project', 'publication', 'talk', 'other'] }
  }],

  //IMAGE UPLOAD STATUS AND RELATED FIELDS
  imageUploadStatus: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'pending',
  },
  
  // MODERATION FIELDS
  status: {
    type: String,
    enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'REVISION_NEEDED', 'APPROVED'],
    default: 'DRAFT'
  },
  adminComments: [{
    comment: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: { type: Date, default: Date.now }
  }],
  submittedAt: { type: Date },
  reviewedAt: { type: Date },
  approvedAt: { type: Date },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Visibility
  isPublic: {
    type: Boolean,
    default: false // Only true after admin approval
  }
}, {
  timestamps: true
});

export default mongoose.model('FellowProfile', fellowProfileSchema);