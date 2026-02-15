import mongoose from "mongoose";

const newsletterSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }, 
});

const newsletterSubscriberModel = new mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);

export default newsletterSubscriberModel;
