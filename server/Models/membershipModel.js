import mongoose from 'mongoose';

const membershipSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
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
    // Billing
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
    metadata: {
        type: Map,
        of: String,
        default: {}
    }
}, { timestamps: true });

membershipSchema.index({ user: 1, status: 1 });
membershipSchema.index({ stripeSubscriptionId: 1 });
membershipSchema.index({ currentPeriodEnd: 1 });

membershipSchema.virtual('isActive').get(function () {
    return this.status === 'active' &&
           this.currentPeriodEnd > new Date() &&
           !this.cancelAtPeriodEnd;
});

membershipSchema.methods.hasPublicationAccess = function () {
    return ['active', 'trialing'].includes(this.status) &&
           this.currentPeriodEnd > new Date();
};

const membershipModel = mongoose.model("Membership", membershipSchema);
export default membershipModel;