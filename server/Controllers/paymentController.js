// fellowshipRegistrationController.js
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import fellowshipModel from "../Models/fellowshipModel.js";
import userModel from "../Models/userModel.js";
import {sendApplicationSubmissionEmail, sendPaymentConfirmationEmail} from "../utils/sendMail.js";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// NEW: Create Setup Intent (for saving card at application time)
export const createSetupIntent = async (req, res) => {
  const { userId } = req.body;
  
  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.FullName,
        metadata: {
          userId: user._id.toString()
        }
      });
      stripeCustomerId = customer.id;
      
      // Save Stripe customer ID to user record
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // Create Setup Intent
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      metadata: {
        userId: user._id.toString()
      }
    });

    res.status(200).json({
      clientSecret: setupIntent.client_secret,
      customerId: stripeCustomerId
    });

  } catch (err) {
    console.error("Error creating SetupIntent:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATED: Submit Fellowship Application (with payment method)
export const submitFellowshipApplication = async (req, res) => {
  const { 
    userId, 
    workGroupId, 
    cycle, 
    experience, 
    motivation, 
    organization, 
    position,
    account,
    paymentMethodId // NEW: Saved payment method ID
  } = req.body;
  
  console.log("Submitting application for user:", userId);
  
  try {
    // Find or create fellowship
    let fellowship = await fellowshipModel.findOne({ workGroupId, cycle });
    const cycleDate = new Date(`${cycle} 15`);
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

    // Create application record with saved payment method
    const application = await fellowshipRegistrationModel.create({
      user: userId,
      fellowship: fellowship._id,
      status: "PENDING_REVIEW",
      userStat: (experience === "0-2" || experience === "3-5") ? "Fellow" : "Senior Fellow",
      workgroupId: workGroupId,
      experience,
      motivation,
      organization,
      position,
      paymentStatus: "PENDING",
      amount: (experience === "0-2" || experience === "3-5") ? 400000 : 800000,
      paymentMethodId: paymentMethodId // NEW: Store payment method
    });

    await sendApplicationSubmissionEmail({
      to: account?.email,
      name: account?.name,
      fellowshipName: `${workGroupId} - Cycle ${cycle}`,
      applicationId: application._id
    });

    console.log("Email is being sent");
    res.status(201).json({ 
      success: true, 
      message: "Application submitted successfully with payment method saved.",
      applicationId: application._id 
    });

  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// NEW: Automatically Charge Approved Application
export const chargeApprovedApplication = async (req, res) => {
  const { applicationId } = req.body;
  
  try {
    const application = await fellowshipRegistrationModel
      .findById(applicationId)
      .populate('user')
      .populate('fellowship');
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "APPROVED") {
      return res.status(400).json({ message: "Application must be approved" });
    }

    if (application.paymentStatus === "COMPLETED") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    if (!application.paymentMethodId) {
      return res.status(400).json({ message: "No payment method on file" });
    }

    const user = await userModel.findById(application.user);
    
    if (!user.stripeCustomerId) {
      return res.status(400).json({ message: "No Stripe customer found" });
    }

    // Charge the saved payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: application.amount,
      currency: "usd",
      customer: user.stripeCustomerId,
      payment_method: application.paymentMethodId,
      off_session: true, // Charge without customer present
      confirm: true, // Automatically confirm
      metadata: {
        applicationId: application._id.toString(),
        userId: user._id.toString(),
        fellowshipId: application.fellowship._id.toString(),
      },
    });

    // Update application
    application.status = "CONFIRMED";
    application.paymentStatus = "COMPLETED";
    application.paidAt = new Date();
    application.paymentIntentId = paymentIntent.id;
    await application.save();

    // Send confirmation email
    await sendPaymentConfirmationEmail({
      to: user.email,
      name: user.FullName,
      fellowshipName: `${application.workgroupId} - Cycle ${application.fellowship.cycle}`,
      applicationId: application._id,
      amount: application.amount / 100
    });

    res.status(200).json({ 
      success: true,
      message: "Payment charged successfully",
      paymentIntent: paymentIntent
    });

  } catch (err) {
    console.error("Error charging payment:", err);
    
    // Handle payment failures
    if (err.type === 'StripeCardError') {
      return res.status(400).json({ 
        message: "Payment failed: " + err.message,
        requiresAction: err.code === 'authentication_required'
      });
    }
    
    res.status(500).json({ message: "Server error" });
  }
};

// KEPT: Get Application Details (for viewing application info)
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

    const amount = application.amount / 100; // Convert cents to dollars

    res.status(200).json({
      application: {
        id: application._id,
        fellowshipName: `${application.workgroupId} - Cycle ${application.fellowship.cycle}`,
        userStat: application.userStat,
        amount: amount,
        status: application.status,
        paymentStatus: application.paymentStatus,
        experience: application.experience,
        motivation: application.motivation,
        organization: application.organization,
        position: application.position
      }
    });

  } catch (err) {
    console.error("Error fetching application:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// REMOVED: createPaymentIntent - No longer needed since we charge automatically
// REMOVED: verifyPaymentAndRegister - No longer needed since we charge automatically