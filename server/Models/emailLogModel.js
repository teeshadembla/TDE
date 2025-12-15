import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  email: {
    type: String,
    required: true,
    index: true
  },
  
  emailType: {
    type: String,
    enum: [
      'WELCOME',
      'REGISTRATION_ACCEPTED',
      'PAYMENT_REMINDER_DAY3',
      'PAYMENT_REMINDER_DAY6',
      'PAYMENT_CONFIRMED',
      'REGISTRATION_CANCELLED',
      'FELLOWSHIP_STARTING_SOON',
      'FELLOWSHIP_REMINDER'
    ],
    required: true,
    index: true
  },
  
  // Reference to related entities
  fellowshipRegistration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fellowship-Registration',
    default: null
  },
  
  fellowship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fellowship',
    default: null
  },
  
  // Email content details
  subject: {
    type: String,
    required: true
  },
  
  brevoTemplateId: {
    type: Number,
    required: true
  },
  
  // Variables used in the template
  templateVariables: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['PENDING', 'SENT', 'FAILED', 'BOUNCED'],
    default: 'PENDING',
    index: true
  },
  
  // AWS SES response
  sesMessageId: {
    type: String,
    default: null
  },
  
  // Error tracking
  error: {
    message: String,
    code: String,
    details: mongoose.Schema.Types.Mixed
  },
  
  // Retry tracking
  retryCount: {
    type: Number,
    default: 0
  },
  
  lastRetryAt: {
    type: Date
  },
  
  sentAt: {
    type: Date
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
  
}, { 
  timestamps: true 
});

// Indexes for faster queries
emailLogSchema.index({ user: 1, emailType: 1 });
emailLogSchema.index({ status: 1, createdAt: -1 });
emailLogSchema.index({ fellowshipRegistration: 1 });
emailLogSchema.index({ sentAt: -1 });

// Method to mark as sent
emailLogSchema.methods.markAsSent = function(sesMessageId) {
  this.status = 'SENT';
  this.sentAt = new Date();
  this.sesMessageId = sesMessageId;
  return this.save();
};

// Method to mark as failed
emailLogSchema.methods.markAsFailed = function(error) {
  this.status = 'FAILED';
  this.error = {
    message: error.message,
    code: error.code || 'UNKNOWN',
    details: error
  };
  this.retryCount += 1;
  this.lastRetryAt = new Date();
  return this.save();
};

const EmailLog = mongoose.model('EmailLog', emailLogSchema);
export default EmailLog;