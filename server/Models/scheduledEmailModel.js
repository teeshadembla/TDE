import mongoose from 'mongoose';

const scheduledEmailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  email: {
    type: String,
    required: true
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
    required: true,
    index: true
  },
  
  fellowship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fellowship',
    required: true
  },
  
  // Scheduling details
  scheduledFor: {
    type: Date,
    required: true,
    index: true
  },
  
  status: {
    type: String,
    enum: ['PENDING', 'SENT', 'CANCELLED', 'FAILED'],
    default: 'PENDING',
    index: true
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
  
  // Variables to be used in the template
  templateVariables: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Priority (for future use)
  priority: {
    type: String,
    enum: ['LOW', 'NORMAL', 'HIGH'],
    default: 'NORMAL'
  },
  
  // Processing tracking
  processedAt: {
    type: Date
  },
  
  emailLogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailLog'
  },
  
  // Error tracking
  error: {
    message: String,
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
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
  
}, { 
  timestamps: true 
});

// Compound indexes for efficient queries
scheduledEmailSchema.index({ status: 1, scheduledFor: 1 });
scheduledEmailSchema.index({ fellowshipRegistration: 1, emailType: 1 });
scheduledEmailSchema.index({ user: 1, status: 1 });

// Method to mark as sent
scheduledEmailSchema.methods.markAsSent = function(emailLogId) {
  this.status = 'SENT';
  this.processedAt = new Date();
  this.emailLogId = emailLogId;
  return this.save();
};

// Method to mark as cancelled
scheduledEmailSchema.methods.cancel = function(reason) {
  this.status = 'CANCELLED';
  this.processedAt = new Date();
  this.metadata.cancellationReason = reason;
  return this.save();
};

// Method to mark as failed
scheduledEmailSchema.methods.markAsFailed = function(error) {
  this.status = 'FAILED';
  this.error = {
    message: error.message,
    details: error
  };
  this.retryCount += 1;
  this.lastRetryAt = new Date();
  return this.save();
};

// Static method to get pending emails ready to be sent
scheduledEmailSchema.statics.getPendingEmails = function(limit = 100) {
  return this.find({
    status: 'PENDING',
    scheduledFor: { $lte: new Date() }
  })
  .populate('user', 'FullName email')
  .populate('fellowshipRegistration')
  .populate('fellowship')
  .limit(limit)
  .sort({ scheduledFor: 1 });
};

// Static method to cancel all pending emails for a registration
scheduledEmailSchema.statics.cancelAllForRegistration = async function(registrationId, reason) {
  const result = await this.updateMany(
    {
      fellowshipRegistration: registrationId,
      status: 'PENDING'
    },
    {
      $set: {
        status: 'CANCELLED',
        processedAt: new Date(),
        'metadata.cancellationReason': reason
      }
    }
  );
  return result;
};

const ScheduledEmail = mongoose.model('ScheduledEmail', scheduledEmailSchema);
export default ScheduledEmail;