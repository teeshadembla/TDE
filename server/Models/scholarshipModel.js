import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fellowship-Registration",
      required: true,
      unique: true, // One scholarship request per application
    },
    requestReason: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["REQUESTED", "APPROVED", "REJECTED"],
      default: "REQUESTED",
    },
    // Set by admin on approval
    scholarshipType: {
      type: String,
      enum: ["full", "partial"],
      default: null,
    },
    // For partial scholarships: how the discount is calculated
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: null,
    },
    discountValue: {
      type: Number,
      default: null,
      // percentage: 1-100, fixed: amount in dollars
    },
    // Final amount user must pay in cents (0 for full scholarship)
    finalAmount: {
      type: Number,
      default: null,
    },
    adminComments: {
      type: String,
      default: null,
    },
    grantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

scholarshipSchema.index({ user: 1 });
scholarshipSchema.index({ application: 1 });
scholarshipSchema.index({ status: 1 });

const scholarshipModel = mongoose.model("Scholarship", scholarshipSchema);
export default scholarshipModel;
