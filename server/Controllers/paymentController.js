// paymentController.js — Fellowship payment flow
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import fellowshipModel from "../Models/fellowshipModel.js";
import userModel from "../Models/userModel.js";
import discountModel from "../Models/discountModel.js";
import paymentHistoryModel from "../Models/paymentHistroyModel.js";
import { applicationSubmittedTemplate, paymentConfirmationTemplate } from "../utils/NewEmail/index.js";
import sgMail from "../utils/SendGrid/emailSetup.js";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

/* ====================================================
   Submit Fellowship Application (no card collected)
==================================================== */
export const submitFellowshipApplication = async (req, res) => {
  const {
    userId,
    workGroupId,
    cycle,
    experience,
    motivation,
    organization,
    position,
  } = req.body;

  logger.debug({ userId }, "Submitting fellowship application");

  try {
    /* ---- Fellowship lookup / creation ---- */
    let fellowship = await fellowshipModel.findOne({ workGroupId, cycle });

    const cycleDate = new Date(`${cycle} 15`);
    const endDate = new Date(cycleDate);
    endDate.setDate(endDate.getDate() + 365);

    if (!fellowship) {
      fellowship = new fellowshipModel({
        workGroupId,
        cycle,
        startDate: cycleDate,
        endDate,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      await fellowship.save();
    }

    /* ---- Prevent duplicate application ---- */
    const existingRegistration = await fellowshipRegistrationModel.findOne({
      fellowship: fellowship._id,
      user: userId,
    });
    if (existingRegistration) {
      return res.status(400).json({ message: "Already applied for this fellowship" });
    }

    const baseAmount =
      experience === "0-2" || experience === "3-5" ? 400000 : 800000;

    /* ---- Create application (no payment method) ---- */
    const application = await fellowshipRegistrationModel.create({
      user: userId,
      fellowship: fellowship._id,
      status: "PENDING_REVIEW",
      userStat: experience === "0-2" || experience === "3-5" ? "Fellow" : "Senior Fellow",
      workgroupId: workGroupId,
      experience,
      motivation,
      organization,
      position,
      paymentStatus: "PENDING",
      amount: baseAmount,
      originalAmount: baseAmount,
    });

    /* ---- Confirmation email ---- */
    const user = await userModel.findById(userId).select("FullName email");
    if (user?.email) {
      const emailContent = applicationSubmittedTemplate({
        name: user.FullName,
        userId,
        FRONTEND_URL: process.env.FRONTEND_URL,
      });
      
      sgMail.send({
        to: user.email,
        from: "teesha@thedigitaleconomist.com",
        subject: "Fellowship Application Received",
        html: emailContent.html,
        text: emailContent.text,
      }).catch((err) =>
        logger.error({ userId, email: user.email, errorMsg: err.message }, "Application submission email failed")
      );
    }

    logger.info({ userId, applicationId: application._id }, "Fellowship application submitted");
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully. We will notify you once it has been reviewed.",
      applicationId: application._id,
    });
  } catch (err) {
    logger.error({ userId: req.body.userId, errorMsg: err.message, stack: err.stack }, "Error submitting fellowship application");
    return res.status(500).json({ message: "Server error" });
  }
};

/* ====================================================
   Create Setup Intent for an APPROVED application
   (called when user is about to complete payment)
==================================================== */
export const createSetupIntent = async (req, res) => {
  const { userId, applicationId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const application = await fellowshipRegistrationModel.findById(applicationId);
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.status !== "APPROVED") {
      return res.status(400).json({ message: "Application is not approved" });
    }
    if (application.paymentStatus === "COMPLETED") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.FullName,
        metadata: { userId: user._id.toString() },
      });
      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // If user already has a saved card, return it so frontend can skip card entry
    if (user.stripePaymentMethodId) {
      const pm = await stripe.paymentMethods.retrieve(user.stripePaymentMethodId).catch(() => null);
      if (pm) {
        return res.status(200).json({
          hasSavedCard: true,
          savedCard: {
            brand: pm.card.brand,
            last4: pm.card.last4,
            expMonth: pm.card.exp_month,
            expYear: pm.card.exp_year,
          },
          customerId: stripeCustomerId,
          applicationAmount: application.amount,
          originalAmount: application.originalAmount || application.amount,
        });
      }
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      metadata: { userId: user._id.toString(), applicationId },
    });

    return res.status(200).json({
      hasSavedCard: false,
      clientSecret: setupIntent.client_secret,
      customerId: stripeCustomerId,
      applicationAmount: application.amount,
      originalAmount: application.originalAmount || application.amount,
    });
  } catch (err) {
    logger.error({ userId: req.body.userId, errorMsg: err.message, stack: err.stack }, "Error creating SetupIntent");
    return res.status(500).json({ message: "Server error" });
  }
};

/* ====================================================
   Complete Payment for an APPROVED application
   (called after user confirms card + optional discount)
==================================================== */
export const completeApplicationPayment = async (req, res) => {
  const { userId, applicationId, paymentMethodId, discountCode } = req.body;

  try {
    const application = await fellowshipRegistrationModel
      .findById(applicationId)
      .populate("fellowship");

    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (application.status !== "APPROVED") {
      return res.status(400).json({ message: "Application must be approved before payment" });
    }
    if (application.paymentStatus === "COMPLETED") {
      return res.status(400).json({ message: "Payment already completed" });
    }
    if (application.isScholarshipApplied && application.amount === 0) {
      // Full scholarship — mark confirmed without charging
      application.status = "CONFIRMED";
      application.paymentStatus = "COMPLETED";
      application.paidAt = new Date();
      await application.save();
      return res.status(200).json({ success: true, message: "Full scholarship applied — no payment required." });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.stripeCustomerId) return res.status(400).json({ message: "No Stripe customer found" });

    /* ---- Apply discount code if provided ---- */
    let discountAmountApplied = 0;
    let discountRecord = null;
    let finalAmount = application.originalAmount || application.amount;

    if (discountCode && !application.discountCodeId && !application.isScholarshipApplied) {
      discountRecord = await discountModel.findOne({
        code: discountCode.toUpperCase().trim(),
        isActive: true,
      });

      if (!discountRecord) {
        return res.status(400).json({ message: "Invalid or inactive discount code" });
      }
      if (new Date(discountRecord.expiresAt) < new Date()) {
        return res.status(400).json({ message: "This discount code has expired" });
      }
      const alreadyUsed = discountRecord.usedBy.some(
        (e) => e.user.toString() === userId.toString()
      );
      if (alreadyUsed) {
        return res.status(400).json({ message: "You have already used this discount code" });
      }

      if (discountRecord.type === "percentage") {
        discountAmountApplied = Math.round(finalAmount * (discountRecord.value / 100));
      } else {
        discountAmountApplied = Math.min(discountRecord.value * 100, finalAmount);
      }
      finalAmount = Math.max(0, finalAmount - discountAmountApplied);
    } else if (application.isScholarshipApplied) {
      // Use the scholarship-adjusted amount already stored
      finalAmount = application.amount;
    }

    /* ---- Save / use payment method ---- */
    let pmId = paymentMethodId || user.stripePaymentMethodId;
    if (!pmId) {
      return res.status(400).json({ message: "No payment method provided" });
    }

    // Attach payment method to customer if it's new
    if (paymentMethodId && paymentMethodId !== user.stripePaymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: user.stripeCustomerId });
      await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      user.stripePaymentMethodId = paymentMethodId;
      await user.save();
    }

    /* ---- Charge ---- */
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "usd",
      customer: user.stripeCustomerId,
      payment_method: pmId,
      off_session: true,
      confirm: true,
      metadata: {
        applicationId: application._id.toString(),
        userId: user._id.toString(),
        fellowshipId: application.fellowship._id.toString(),
        discountCode: discountCode || "",
      },
    });

    /* ---- Persist discount usage ---- */
    if (discountRecord) {
      discountRecord.usedBy.push({
        user: userId,
        application: applicationId,
        usedAt: new Date(),
      });
      await discountRecord.save();
    }

    /* ---- Update application ---- */
    application.status = "CONFIRMED";
    application.paymentStatus = "COMPLETED";
    application.paidAt = new Date();
    application.paymentIntentId = paymentIntent.id;
    application.paymentMethodId = pmId;
    application.amount = finalAmount;
    if (discountRecord) {
      application.discountCodeId = discountRecord._id;
      application.discountCode = discountRecord.code;
      application.discountAmount = discountAmountApplied;
    }
    await application.save();

    /* ---- Save payment history ---- */
    await paymentHistoryModel.create({
      user: userId,
      paymentType: "fellowship",
      fellowshipApplication: applicationId,
      stripeInvoiceId: paymentIntent.id, // reusing field for fellowship
      stripePaymentIntentId: paymentIntent.id,
      amount: finalAmount,
      currency: "usd",
      status: "paid",
      paidAt: new Date(),
      description: `Fellowship payment — ${application.fellowship?.cycle || ""}`,
      metadata: {
        discountCode: discountCode || "",
        originalAmount: String(application.originalAmount || finalAmount),
        discountAmount: String(discountAmountApplied),
      },
    });

    /* ---- Confirmation email ---- */
    const emailContent = paymentConfirmationTemplate({
      name: user.FullName,
      fellowshipName: application.fellowship?.cycle || "",
      amount: finalAmount / 100,
      dashboardUrl: `${process.env.FRONTEND_URL}/${user.role}/profile`,
    });

    sgMail.send({
      to: user.email,
      from: "teesha@thedigitaleconomist.com",
      subject: "Your fellowship payment is confirmed!",
      html: emailContent.html,
      text: emailContent.text,
    }).catch((err) =>
      logger.error({ userId, applicationId, errorMsg: err.message }, "Payment confirmation email failed")
    );

    logger.info({ userId, applicationId, finalAmount }, "Fellowship payment completed");
    return res.status(200).json({
      success: true,
      message: "Payment completed successfully",
      amountCharged: finalAmount / 100,
    });
  } catch (err) {
    logger.error({ applicationId: req.body.applicationId, errorMsg: err.message, stack: err.stack }, "Error completing fellowship payment");

    if (err.type === "StripeCardError") {
      return res.status(400).json({
        message: "Payment failed: " + err.message,
        requiresAction: err.code === "authentication_required",
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

/* ====================================================
   Admin: Charge an approved application manually
   (kept for admin-side override capability)
==================================================== */
export const chargeApprovedApplication = async (req, res) => {
  const { applicationId } = req.body;

  try {
    const application = await fellowshipRegistrationModel
      .findById(applicationId)
      .populate("user")
      .populate("fellowship");

    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.status !== "APPROVED") {
      return res.status(400).json({ message: "Application must be approved" });
    }
    if (application.paymentStatus === "COMPLETED") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    const user = await userModel.findById(application.user);
    if (!user?.stripeCustomerId) return res.status(400).json({ message: "No Stripe customer found" });

    const pmId = application.paymentMethodId || user.stripePaymentMethodId;
    if (!pmId) return res.status(400).json({ message: "No payment method on file" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: application.amount,
      currency: "usd",
      customer: user.stripeCustomerId,
      payment_method: pmId,
      off_session: true,
      confirm: true,
      metadata: {
        applicationId: application._id.toString(),
        userId: user._id.toString(),
        fellowshipId: application.fellowship._id.toString(),
      },
    });

    application.status = "CONFIRMED";
    application.paymentStatus = "COMPLETED";
    application.paidAt = new Date();
    application.paymentIntentId = paymentIntent.id;
    await application.save();

    await paymentHistoryModel.create({
      user: user._id,
      paymentType: "fellowship",
      fellowshipApplication: applicationId,
      stripeInvoiceId: paymentIntent.id,
      stripePaymentIntentId: paymentIntent.id,
      amount: application.amount,
      currency: "usd",
      status: "paid",
      paidAt: new Date(),
      description: `Fellowship payment — ${application.fellowship?.cycle || ""}`,
    });

    const emailContent = paymentConfirmationTemplate({
      name: user.FullName,
      fellowshipName: application.fellowship?.cycle || "",
      amount: application.amount / 100,
      dashboardUrl: `${process.env.FRONTEND_URL}/${user.role}/profile`,
    });

    sgMail.send({
      to: user.email,
      from: "teesha@thedigitaleconomist.com",
      subject: "Payment for your fellowship application is complete!",
      html: emailContent.html,
      text: emailContent.text,
    }).catch((err) =>
      logger.error({ userId: user._id, applicationId, errorMsg: err.message }, "Payment confirmation email failed")
    );

    return res.status(200).json({ success: true, message: "Payment charged successfully" });
  } catch (err) {
    logger.error({ applicationId: req.body.applicationId, errorMsg: err.message, stack: err.stack }, "Error charging payment");

    if (err.type === "StripeCardError") {
      return res.status(400).json({
        message: "Payment failed: " + err.message,
        requiresAction: err.code === "authentication_required",
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

/* ====================================================
   Get Application Details (for payment page)
==================================================== */
export const getApplicationForPayment = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const application = await fellowshipRegistrationModel
      .findById(applicationId)
      .populate("fellowship")
      .populate("user", "FullName email")
      .populate("scholarshipId")
      .populate("discountCodeId", "code type value");

    if (!application) return res.status(404).json({ message: "Application not found" });

    return res.status(200).json({
      application: {
        id: application._id,
        fellowshipName: `${application.workgroupId} — Cycle ${application.fellowship?.cycle}`,
        userStat: application.userStat,
        amount: application.amount / 100,
        originalAmount: (application.originalAmount || application.amount) / 100,
        discountAmount: application.discountAmount / 100,
        scholarshipAmount: application.scholarshipAmount / 100,
        isScholarshipApplied: application.isScholarshipApplied,
        discountCode: application.discountCode,
        status: application.status,
        paymentStatus: application.paymentStatus,
        experience: application.experience,
        motivation: application.motivation,
        organization: application.organization,
        position: application.position,
        scholarship: application.scholarshipId || null,
      },
    });
  } catch (err) {
    logger.error({ applicationId: req.params.applicationId, errorMsg: err.message, stack: err.stack }, "Error fetching application for payment");
    return res.status(500).json({ message: "Server error" });
  }
};
