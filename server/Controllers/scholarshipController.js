import scholarshipModel from "../Models/scholarshipModel.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import userModel from "../Models/userModel.js";
import logger from "../utils/logger.js";
import sgMail from "../utils/SendGrid/emailSetup.js";

/* ============================
   User: Request a scholarship
============================ */
export const requestScholarship = async (req, res) => {
  const { userId, applicationId, requestReason } = req.body;

  try {
    if (!userId || !applicationId || !requestReason?.trim()) {
      return res.status(400).json({ message: "userId, applicationId, and requestReason are required" });
    }

    const application = await fellowshipRegistrationModel.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (application.status !== "APPROVED") {
      return res.status(400).json({ message: "Scholarships can only be requested for approved applications" });
    }
    if (application.paymentStatus === "COMPLETED") {
      return res.status(400).json({ message: "Payment has already been completed for this application" });
    }
    if (application.discountCodeId) {
      return res.status(400).json({ message: "A discount code is already applied. Discounts and scholarships cannot be combined." });
    }

    // Check if a scholarship request already exists
    const existing = await scholarshipModel.findOne({ application: applicationId });
    if (existing) {
      return res.status(400).json({
        message: "A scholarship request already exists for this application",
        scholarship: existing,
      });
    }

    const scholarship = await scholarshipModel.create({
      user: userId,
      application: applicationId,
      requestReason: requestReason.trim(),
    });

    logger.info({ scholarshipId: scholarship._id, userId, applicationId }, "Scholarship requested");
    return res.status(201).json({ success: true, scholarship });
  } catch (err) {
    logger.error({ errorMsg: err.message, stack: err.stack }, "Error requesting scholarship");
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   User: Get scholarship for an application
============================ */
export const getScholarshipByApplication = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const scholarship = await scholarshipModel
      .findOne({ application: applicationId })
      .populate("grantedBy", "FullName");

    return res.status(200).json({ success: true, scholarship: scholarship || null });
  } catch (err) {
    logger.error({ applicationId, errorMsg: err.message }, "Error fetching scholarship");
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   Admin: Get all scholarship requests
============================ */
export const getAllScholarships = async (req, res) => {
  const { status } = req.query;

  try {
    const filter = {};
    if (status) filter.status = status;

    const scholarships = await scholarshipModel
      .find(filter)
      .populate("user", "FullName email")
      .populate({
        path: "application",
        select: "amount originalAmount userStat experience workgroupId fellowship",
        populate: [
          { path: "workgroupId", select: "title" },
          { path: "fellowship", select: "cycle" },
        ],
      })
      .populate("grantedBy", "FullName")
      .sort({ requestedAt: -1 });

    return res.status(200).json({ success: true, scholarships });
  } catch (err) {
    logger.error({ errorMsg: err.message, stack: err.stack }, "Error fetching scholarships");
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   Admin: Review (approve/reject) a scholarship
============================ */
export const reviewScholarship = async (req, res) => {
  const { id } = req.params;
  const { action, scholarshipType, discountType, discountValue, adminComments, adminId } = req.body;

  try {
    if (!["APPROVED", "REJECTED"].includes(action)) {
      return res.status(400).json({ message: "action must be APPROVED or REJECTED" });
    }

    const scholarship = await scholarshipModel
      .findById(id)
      .populate("user")
      .populate("application");

    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    if (scholarship.status !== "REQUESTED") {
      return res.status(400).json({ message: "This scholarship has already been reviewed" });
    }

    if (action === "APPROVED") {
      if (!scholarshipType || !["full", "partial"].includes(scholarshipType)) {
        return res.status(400).json({ message: "scholarshipType (full or partial) is required for approval" });
      }
      if (scholarshipType === "partial") {
        if (!discountType || !["percentage", "fixed"].includes(discountType)) {
          return res.status(400).json({ message: "discountType is required for partial scholarships" });
        }
        if (!discountValue || discountValue <= 0) {
          return res.status(400).json({ message: "discountValue must be greater than 0 for partial scholarships" });
        }
      }

      const application = scholarship.application;
      const originalAmount = application.originalAmount || application.amount;

      let scholarshipAmount = 0;
      let finalAmount = 0;

      if (scholarshipType === "full") {
        scholarshipAmount = originalAmount;
        finalAmount = 0;
      } else {
        if (discountType === "percentage") {
          scholarshipAmount = Math.round(originalAmount * (discountValue / 100));
        } else {
          scholarshipAmount = Math.min(discountValue * 100, originalAmount);
        }
        finalAmount = Math.max(0, originalAmount - scholarshipAmount);
      }

      scholarship.scholarshipType = scholarshipType;
      scholarship.discountType = scholarshipType === "full" ? null : discountType;
      scholarship.discountValue = scholarshipType === "full" ? null : discountValue;
      scholarship.finalAmount = finalAmount;

      // Update the fellowship application
      await fellowshipRegistrationModel.findByIdAndUpdate(application._id, {
        scholarshipId: scholarship._id,
        scholarshipAmount,
        isScholarshipApplied: true,
        amount: finalAmount,
        originalAmount: originalAmount,
      });

      // If full scholarship, mark payment as completed automatically
      if (scholarshipType === "full") {
        await fellowshipRegistrationModel.findByIdAndUpdate(application._id, {
          status: "CONFIRMED",
          paymentStatus: "COMPLETED",
          paidAt: new Date(),
        });
      }
    }

    scholarship.status = action;
    scholarship.adminComments = adminComments || null;
    scholarship.grantedBy = adminId || null;
    scholarship.reviewedAt = new Date();
    await scholarship.save();

    // Email user
    const user = scholarship.user;
    if (user?.email) {
      const subject = action === "APPROVED"
        ? "Your Scholarship Request Has Been Approved"
        : "Your Scholarship Request Has Been Reviewed";

      const approvedMsg = scholarship.scholarshipType === "full"
        ? "Your fellowship fee has been fully waived. Your enrollment is now confirmed — no further payment is required."
        : `A partial scholarship has been applied. Your new fellowship fee is $${(scholarship.finalAmount / 100).toFixed(2)}. Please log in to complete your payment.`;

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003172;">Scholarship Update</h2>
          <p>Dear ${user.FullName},</p>
          <p>${action === "APPROVED" ? approvedMsg : "We have reviewed your scholarship request and are unable to approve it at this time."}</p>
          ${adminComments ? `<p><strong>Note from the team:</strong> ${adminComments}</p>` : ""}
          <p>Please log in to your dashboard for more details.</p>
        </div>
      `;

      sgMail.send({
        to: user.email,
        from: "teesha@thedigitaleconomist.com",
        subject,
        html,
        text: html.replace(/<[^>]+>/g, ""),
      }).catch((err) =>
        logger.error({ userId: user._id, errorMsg: err.message }, "Scholarship review email failed")
      );
    }

    logger.info({ scholarshipId: id, action }, "Scholarship reviewed");
    return res.status(200).json({ success: true, scholarship });
  } catch (err) {
    logger.error({ scholarshipId: req.params.id, errorMsg: err.message, stack: err.stack }, "Error reviewing scholarship");
    return res.status(500).json({ message: "Server error" });
  }
};
