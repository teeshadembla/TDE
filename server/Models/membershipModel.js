import mongoose from 'mongoose';

const membershipSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        default: null
    },
    tier: {
        type: String,
        enum: ["premium", "pro", "organizational"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "past_due", "canceled", "incomplete", "incomplete_expired", "trialing", "unpaid"],
        default: "active",
        required: true
    },
    // Stripe-related fields
    stripeSubscriptionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    stripePriceId: {
        type: String,
        required: true
    },
    stripeProductId: {
        type: String,
        required: true
    },
    stripeCustomerId: {
        type: String,
        required: true
    },
    // Billing information
    currentPeriodStart: {
        type: Date,
        required: true
    },
    currentPeriodEnd: {
        type: Date,
        required: true
    },
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false
    },
    canceledAt: {
        type: Date,
        default: null
    },
    cancelReason: {
        type: String,
        default: null
    },
    endedAt: {
        type: Date,
        default: null
    },
    // Trial information (if needed in future)
    trialStart: {
        type: Date,
        default: null
    },
    trialEnd: {
        type: Date,
        default: null
    },
    // Metadata
    metadata: {
        type: Map,
        of: String,
        default: {}
    }
}, { timestamps: true });

// Indexes for efficient queries
membershipSchema.index({ user: 1, status: 1 });
membershipSchema.index({ organization: 1, status: 1 });
membershipSchema.index({ stripeSubscriptionId: 1 });
membershipSchema.index({ currentPeriodEnd: 1 });

// Virtual for checking if membership is currently active
membershipSchema.virtual('isActive').get(function() {
    return this.status === 'active' && 
           this.currentPeriodEnd > new Date() && 
           !this.cancelAtPeriodEnd;
});

// Method to check if user has access to publications
membershipSchema.methods.hasPublicationAccess = function() {
    return ['active', 'trialing'].includes(this.status) && 
           this.currentPeriodEnd > new Date();
};

const membershipModel = mongoose.model("Membership", membershipSchema);
export default membershipModel;