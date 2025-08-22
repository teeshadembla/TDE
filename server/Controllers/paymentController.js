import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import fellowshipModel from "../Models/fellowshipModel.js";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Create PaymentIntent (instead of Checkout Session)
export const createPaymentIntent = async (req, res) => {
  const { userId, workGroupId, cycle,  experience, motivation, organization, position, } = req.body;
  console.log("Creating payment intent for user:", userId);
  try {
    // Find or create fellowship
    let fellowship = await fellowshipModel.findOne({ workGroupId, cycle });
    
    if (!fellowship) {
      console.log("This is the fellowship being saved: ",{ workGroupId, cycle, startDate: new Date(), endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
      fellowship = new fellowshipModel({ workGroupId, cycle, startDate: new Date(), endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
      await fellowship.save();
    }

    // Check existing registration
    const existingRegistration = await fellowshipRegistrationModel.findOne({
      fellowshipId: fellowship._id,
      userId,
    });
    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered" });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: experience === "0-2" || experience === "3-5" ? 400000 : 800000, // $50 or $100 in cents
      currency: "usd",
      metadata: {
        userId,
        fellowshipId: fellowship._id.toString(),
        workgroupId: workGroupId,
        workex: experience,
        motivation: motivation,
        organization: organization,
        position: position,
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Error creating PaymentIntent:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify payment after frontend confirmation
export const verifyPaymentAndRegister = async (req, res) => {
  console.log("Verifying payment...");
  
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const { userId, fellowshipId, workex, workgroupId} = paymentIntent.metadata;
      const amount = paymentIntent.amount;

      console.log("Payment succeeded for user:", userId, "fellowship:", fellowshipId);

      const alreadyExists = await fellowshipRegistrationModel.findOne({
        user: req.body.userId || userId,
        fellowship: fellowshipId,
      });

      if (!alreadyExists) {
        await fellowshipRegistrationModel.create({
          user: userId,
          fellowship: fellowshipId,
          status: "PENDING",
          userStat: (workex === "0-2" || workex === "3-5") ? "Fellow" : "Senior Fellow",
          workgroupId: workgroupId,
          amount: amount,
        });
      }

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (err) {
    console.log("Error verifying payment:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
