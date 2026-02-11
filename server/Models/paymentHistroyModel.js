import mongoose from 'mongoose';

const paymentHistorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    membership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Membership",
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        default: null
    },
    // Stripe payment information
    stripeInvoiceId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    stripePaymentIntentId: {
        type: String,
        default: null
    },
    stripeChargeId: {
        type: String,
        default: null
    },
    // Payment details
    amount: {
        type: Number,
        required: true  // Amount in cents
    },
    currency: {
        type: String,
        default: "usd"
    },
    status: {
        type: String,
        enum: ["paid", "failed", "pending", "refunded", "partially_refunded"],
        required: true
    },
    paymentMethod: {
        type: {
            type: String,  // card, bank_account, etc.
        },
        brand: String,  // visa, mastercard, etc.
        last4: String,
        expMonth: Number,
        expYear: Number
    },
    // Invoice details
    invoiceNumber: {
        type: String,
        default: null
    },
    invoicePdf: {
        type: String,  // URL to invoice PDF
        default: null
    },
    billingPeriod: {
        start: Date,
        end: Date
    },
    // Refund information
    refundedAmount: {
        type: Number,
        default: 0
    },
    refundReason: {
        type: String,
        default: null
    },
    refundedAt: {
        type: Date,
        default: null
    },
    // Timestamps
    paidAt: {
        type: Date,
        default: null
    },
    attemptedAt: {
        type: Date,
        default: Date.now
    },
    // Metadata
    description: {
        type: String,
        default: null
    },
    metadata: {
        type: Map,
        of: String,
        default: {}
    }
}, { timestamps: true });

// Indexes for efficient queries
paymentHistorySchema.index({ user: 1, createdAt: -1 });
paymentHistorySchema.index({ membership: 1, createdAt: -1 });
paymentHistorySchema.index({ stripeInvoiceId: 1 });
paymentHistorySchema.index({ status: 1 });
paymentHistorySchema.index({ paidAt: -1 });

const paymentHistoryModel = mongoose.model("PaymentHistory", paymentHistorySchema);
export default paymentHistoryModel;