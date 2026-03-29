import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      // For percentage: 1-100. For fixed: amount in dollars (not cents).
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Tracks which users have used this code (1x per user limit)
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        application: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Fellowship-Registration",
        },
        usedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

discountSchema.index({ code: 1 });
discountSchema.index({ expiresAt: 1 });
discountSchema.index({ isActive: 1 });

const discountModel = mongoose.model("Discount", discountSchema);
export default discountModel;
