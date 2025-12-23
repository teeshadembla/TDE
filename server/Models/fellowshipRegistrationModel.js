// Updated fellowshipRegistrationModel schema
import mongoose from "mongoose";
const fellowshipRegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fellowship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fellowship',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'CONFIRMED'],
    default: 'PENDING_REVIEW'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  userStat: {
    type: String,
    enum: ['Fellow', 'Senior Fellow'],
    required: true
  },
  workgroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workgroup',
    required: true
  },
  
  // Application fields
  experience: { type: String, required: true },
  motivation: { type: String, required: true },
  organization: { type: String, required: true },
  position: { type: String, required: true },

  // Admin review fields
  adminComments: { type: String },
  reviewedAt: { type: Date},

  // Payment fields
  amount: { type: Number, required: true },
  paymentIntentId: { type: String },
  paidAt: { type: Date },

  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now
  },
  onboardingStatus: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED'],
    default: 'PENDING'
  },
  onboardingStartedAt: { type: Date },
  onboardingSubmittedAt: { type: Date },
  onboardingCompletedAt: { type: Date },
  
  // Email tracking
  lastReminderSent: { type: Date },
  reminderCount: { type: Number, default: 0 },
  paymentDeadline: {
    type: Date
  },
  // Reference to public profile (once created)
  fellowProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FellowProfile',
    default: null
  },
  paymentMethodId: {
    type: String,
    default: null
  },
  paymentIntentId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const fellowshipRegistrationModel = mongoose.model('Fellowship-Registration', fellowshipRegistrationSchema);
export default fellowshipRegistrationModel