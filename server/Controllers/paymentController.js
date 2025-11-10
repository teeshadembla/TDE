import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import fellowshipModel from "../Models/fellowshipModel.js";
import {sendApplicationSubmissionEmail, sendPaymentConfirmationEmail} from "../utils/sendMail.js";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// NEW: Submit Fellowship Application (No Payment)
export const submitFellowshipApplication = async (req, res) => {
  const { 
    userId, 
    workGroupId, 
    cycle, 
    experience, 
    motivation, 
    organization, 
    position,
    account
  } = req.body;
  
  console.log("Submitting application for user:", userId);
  
  try {
    // Find or create fellowship
    let fellowship = await fellowshipModel.findOne({ workGroupId, cycle });
    const cycleDate = new Date(`${cycle} 15`); // e.g. "June 2026 15"
    const endDate = new Date(cycleDate);
    endDate.setDate(endDate.getDate() + 365);

    if (!fellowship) {
      console.log("Creating new fellowship:", { workGroupId, cycle });
      fellowship = new fellowshipModel({
        workGroupId,
        cycle,
        startDate: cycleDate,
        endDate: endDate,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      await fellowship.save();
    }

    // Check existing registration
    const existingRegistration = await fellowshipRegistrationModel.findOne({
      fellowship: fellowship._id,
      user: userId,
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: "Already applied for this fellowship" });
    }

    // Create application record (NO PAYMENT YET)
    const application = await fellowshipRegistrationModel.create({
      user: userId,
      fellowship: fellowship._id,
      status: "PENDING_REVIEW", // Changed from "PENDING" to be more specific
      userStat: (experience === "0-2" || experience === "3-5") ? "Fellow" : "Senior Fellow",
      workgroupId: workGroupId,
      experience,
      motivation,
      organization,
      position,
      paymentStatus: "PENDING", // Will change to COMPLETED after payment
      amount: (experience === "0-2" || experience === "3-5") ? 400000 : 800000
      
    });

    // TODO: Send confirmation email to user here
    await sendApplicationSubmissionEmail({
      to: account?.email,
      name: account?.name,
      fellowshipName: `${workGroupId} - Cycle ${cycle}`,
      applicationId: application._id
    });

    console.log("Email is being sent");
    res.status(201).json({ 
      success: true, 
      message: "Application submitted successfully. You'll receive an email once it's reviewed.",
      applicationId: application._id 
    });

  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATED: Create Payment Intent (Only for Approved Applications)
export const createPaymentIntent = async (req, res) => {
  console.log("Request body for payment intent:", req.body);
  console.log(req.body._id);
  const  applicationId  = req.body._id;
  console.log("Creating payment Intent for application:", applicationId);

  try {
    const application = await fellowshipRegistrationModel
      .findById(applicationId)
      .populate('fellowship')
      .populate('user');
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status != "APPROVED" ) {
      return res.status(400).json({ message: "Application must be approved before payment" });
    }

    if (application.paymentStatus === "COMPLETED") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    // Create PaymentIntent
    const amount = application.experience === "0-2" || application.experience === "3-5" ? 400000 : 800000;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: application?.amount || amount,
      currency: "usd",
      metadata: {
        applicationId: application._id.toString(),
        userId: application.user._id.toString(),
        fellowshipId: application.fellowship._id.toString(),
        workgroupId: application.workgroupId._id.toString(),
      },
    });

    // Update application with payment intent
    application.paymentIntentId = paymentIntent.id;
    //application.amount = amount;
    await application.save();

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100, // Send amount in dollars for frontend display
    });

  } catch (err) {
    console.error("Error creating PaymentIntent:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATED: Verify Payment
export const verifyPaymentAndRegister = async (req, res) => {
  console.log("Verifying payment...");
  
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const { applicationId } = paymentIntent.metadata;

      const application = await fellowshipRegistrationModel
        .findById(applicationId)
        .populate('user')
        .populate('fellowship');

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Update application status
      application.status = "CONFIRMED"; // Final confirmed status
      application.paymentStatus = "COMPLETED";
      application.paidAt = new Date();
      await application.save();

      console.log("Payment confirmed for application:", applicationId);

      // TODO: Send payment confirmation email
      await sendPaymentConfirmationEmail({
        to: application.user.email,
        name: application.user.FullName,
        fellowshipName: `${application.workgroupId} - Cycle ${application.fellowship.cycle}`,
        applicationId: application._id
      });

      res.status(200).json({ 
        success: true,
        message: "Payment confirmed! Welcome to the fellowship." 
      });

    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (err) {
    console.log("Error verifying payment:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// NEW: Get Application Details (for payment page)
export const getApplicationForPayment = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const application = await fellowshipRegistrationModel
      .findById(applicationId)
      .populate('fellowship')
      .populate('user', 'FullName email');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "APPROVED") {
      return res.status(400).json({ 
        message: "This application is not approved for payment",
        status: application.status 
      });
    }

    if (application.paymentStatus === "COMPLETED") {
      return res.status(400).json({ 
        message: "Payment already completed for this application" 
      });
    }

    const amount = application.experience === "0-2" || application.experience === "3-5" ? 4000 : 8000;

    res.status(200).json({
      application: {
        id: application._id,
        fellowshipName: `${application.workgroupId} - Cycle ${application.fellowship.cycle}`,
        userStat: application.userStat,
        amount: amount, // in dollars
        status: application.status,
        paymentStatus: application.paymentStatus
      }
    });

  } catch (err) {
    console.error("Error fetching application:", err);
    res.status(500).json({ message: "Server error" });
  }
};