import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import fellowshipModel from "../Models/fellowshipModel.js";
import userModel from "../Models/userModel.js";
import logger from "../utils/logger.js";
import { fellowshipReviewEmailTemplate } from "../utils/SendGrid/htmlTemplateFellowshipApplication.js";
import sgMail from "../utils/SendGrid/emailSetup.js";
import dotenv from "dotenv";
dotenv.config();

/* ============================
   Get all applications for user
============================ */
const getAllFellowshipRegistrations = async (req, res) => {
  const { id } = req.params;

  try {
    const registrations = await fellowshipRegistrationModel
      .find({
        status: { $in: ["PENDING_REVIEW", "APPROVED", "CONFIRMED"] },
        user: id,
      })
      .populate("fellowship", "cycle startDate endDate")
      .populate("user", "FullName email company title")
      .populate("workgroupId", "title description")
      .sort({ appliedAt: -1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const current = [];
    const past = [];

    registrations.forEach((reg) => {
      const start = new Date(reg.fellowship?.startDate);
      const end = new Date(reg.fellowship?.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (start > today || (start <= today && end >= today)) {
        current.push(reg);
      } else {
        past.push(reg);
      }
    });

    return res.status(200).json({
      current,
      past,
      total: registrations.length,
      counts: { current: current.length, past: past.length },
    });
  } catch (error) {
    logger.error({userId: req.params.id, errorMsg: error.message, stack: error.stack}, "Error fetching fellowship registrations");
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================
   Review application (approve / reject)
============================ */
const reviewFellowshipApplication = async (req, res) => {
  const { id } = req.params;
  const { action, adminComments } = req.body;

  try {
    const application = await fellowshipRegistrationModel
      .findById(id)
      .populate("user")
      .populate("fellowship");

    if (!application) {
      logger.warn({applicationId: id}, "Application review failed: Application not found");
      return res.status(404).json({ msg: "Application not found" });
    }

    if (application.status !== "PENDING_REVIEW") {
      logger.warn({applicationId: id, currentStatus: application.status}, "Application review failed: Already reviewed");
      return res.status(400).json({ msg: "Application already reviewed" });
    }

    application.status = action;
    application.adminComments = adminComments;
    application.reviewedAt = new Date();
    await application.save();

    const user = application.user;
    const dashboardUrl = `${process.env.FRONTEND_URL}/${user.role}/profile`;
    const paymentAmount = (application.originalAmount || application.amount) / 100;

    const emailContent = fellowshipReviewEmailTemplate({
        name: user.FullName,
        fellowshipName: application.fellowship.cycle,
        action,
        paymentAmount,
        dashboardUrl,
      })

    const msg = {
      to: user.email,
      from: "teesha@thedigitaleconomist.com",
      subject: action === "APPROVED" ? "Congratulations! Your Fellowship Application is Approved" : "Fellowship Application Update",
      html: emailContent.html
    };

    sgMail.send(msg)
      .then(() => logger.info({ userId: user._id, action }, "Fellowship review email sent"))
      .catch((err) => logger.error({ userId: user._id, errorMsg: err.message }, "Fellowship review email failed"));

    logger.info({applicationId: id, action, userId: user._id}, "Fellowship application reviewed successfully");
    return res.status(200).json({
      success: true,
      message: `Application ${action.toLowerCase()}`,
      application,
    });
  } catch (err) {
    logger.error({applicationId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error reviewing fellowship application");
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================
   Get applications by status (admin dashboard)
============================ */
const getApplicationsByStatus = async (req, res) => {
  try {
    const pendingReview = await fellowshipRegistrationModel
      .find({ status: "PENDING_REVIEW" })
      .populate("fellowship", "cycle")
      .populate("user", "FullName email")
      .populate("workgroupId", "title")
      .sort({ appliedAt: -1 });

    const approved = await fellowshipRegistrationModel
      .find({ status: "APPROVED" })
      .populate("fellowship", "cycle")
      .populate("user", "FullName email")
      .populate("workgroupId", "title")
      .sort({ reviewedAt: -1 });

    const confirmed = await fellowshipRegistrationModel
      .find({ status: "CONFIRMED" })
      .populate("fellowship", "cycle")
      .populate("user", "FullName email")
      .populate("workgroupId", "title")
      .sort({ paidAt: -1 });

    const rejected = await fellowshipRegistrationModel
      .find({ status: "REJECTED" })
      .populate("fellowship", "cycle")
      .populate("user", "FullName email")
      .populate("workgroupId", "title")
      .sort({ reviewedAt: -1 });

    return res.status(200).json({
      pendingReview,
      approved,
      confirmed,
      rejected,
      counts: {
        pendingReview: pendingReview.length,
        approved: approved.length,
        confirmed: confirmed.length,
        rejected: rejected.length,
      },
    });
  } catch (error) {
    logger.error({errorMsg: error.message, stack: error.stack}, "Error fetching applications by status");
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================
   Delete registration
============================ */
const deleteFellowshipRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await fellowshipRegistrationModel.findById(id);

    if (!registration) {
      logger.warn({registrationId: id}, "Deletion failed: Registration not found");
      return res.status(404).json({ msg: "Registration not found" });
    }

    await fellowshipRegistrationModel.findByIdAndDelete(id);
    logger.info({registrationId: id}, "Fellowship registration deleted successfully");
    return res.status(200).json({ msg: "Registration deleted successfully" });
  } catch (err) {
    logger.error({registrationId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error deleting fellowship registration");
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================
   Get registrations by user
============================ */
const getAllRegistrationsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const currentDate = new Date();

    const registrations = await fellowshipRegistrationModel
      .find({ user: userId })
      .populate("fellowship", "cycle startDate endDate")
      .populate("workgroupId", "title description")
      .sort({ appliedAt: -1 });

    const categorized = {
      pendingReview: [],
      approved: [],
      confirmed: [],
      rejected: [],
      current: [],
      past: [],
    };

    registrations.forEach((reg) => {
      const endDate = new Date(reg.fellowship?.endDate);

      if (endDate >= currentDate) {
        categorized.current.push(reg);
      } else {
        categorized.past.push(reg);
      }

      categorized[reg.status.toLowerCase()]?.push(reg);
    });

    return res.status(200).json({ registrations: categorized });
  } catch (err) {
    logger.error({userId: req.params.userId, errorMsg: err.message, stack: err.stack}, "Error fetching user registrations");
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================
   Get fellowship years
============================ */
const getYears = async (req, res) => {
  try {
    const years = await fellowshipModel.aggregate([
      {
        $addFields: {
          year: { $arrayElemAt: [{ $split: ["$cycle", "-"] }, -1] },
        },
      },
      { $group: { _id: "$year" } },
      { $project: { _id: 0, year: "$_id" } },
      { $sort: { year: -1 } },
    ]);

    return res.status(200).json({ years: years.map((y) => y.year) });
  } catch (err) {
    logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching fellowship years");
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* ============================
   Get all applications (admin)
============================ */
const getAllApplications = async (req, res) => {
  try {
    const applications = await fellowshipRegistrationModel
      .find()
      .populate("user", "FullName email socialLinks company title")
      .populate("fellowship", "cycle")
      .populate("workgroupId", "title")
      .sort({ appliedAt: -1 });

    return res.status(200).json({ success: true, applications });
  } catch (err) {
    logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching all applications");
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   Approve application (no payment)
============================ */
const approveApplication = async (req, res) => {
  const { id } = req.params;
  const action = "APPROVED"

  try {
    const application = await fellowshipRegistrationModel.findById(id).populate("user fellowship");
    if (!application) {
      logger.warn({applicationId: id}, "Approval failed: Application not found");
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "APPROVED";
    application.reviewedAt = new Date();
    await application.save();

    const user = application.user;
    const dashboardUrl = `${process.env.FRONTEND_URL}/${user.role}/profile`;
    const paymentAmount = (application.originalAmount || application.amount) / 100;

    const emailContent = fellowshipReviewEmailTemplate({
        name: user.FullName,
        fellowshipName: application.fellowship.cycle,
        action,
        paymentAmount,
        dashboardUrl,
      })

    const msg = {
      to: user.email,
      from: "teesha@thedigitaleconomist.com",
      subject: action === "APPROVED" ? "Congratulations! Your Fellowship Application is Approved" : "Fellowship Application Update",
      html: emailContent.html
    };

    sgMail.send(msg)
      .then(() => logger.info({ userId: user._id, action }, "Fellowship review email sent"))
      .catch((err) => logger.error({ userId: user._id, errorMsg: err.message }, "Fellowship review email failed"));

    logger.info({applicationId: id}, "Application approved successfully");
    return res.status(200).json({
      success: true,
      message: "Application approved",
      application,
    });
  } catch (err) {
    logger.error({applicationId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error approving application");
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   Reject application
============================ */
const rejectApplication = async (req, res) => {
  const { id } = req.params;
  const action = "REJECTED";

  try {
    const application = await fellowshipRegistrationModel
      .findById(id)
      .populate("user")
      .populate("fellowship");

    if (!application) {
      logger.warn({applicationId: id}, "Rejection failed: Application not found");
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "REJECTED";
    application.reviewedAt = new Date();
    await application.save();

   const user = application.user;
    const dashboardUrl = `${process.env.FRONTEND_URL}/${user.role}/profile`;
    const paymentAmount = (application.originalAmount || application.amount) / 100;

    const emailContent = fellowshipReviewEmailTemplate({
        name: user.FullName,
        fellowshipName: application.fellowship.cycle,
        action,
        paymentAmount,
        dashboardUrl,
      })

    const msg = {
      to: user.email,
      from: "teesha@thedigitaleconomist.com",
      subject: action === "APPROVED" ? "Congratulations! Your Fellowship Application is Approved" : "Fellowship Application Update",
      html: emailContent.html
    };

    sgMail.send(msg)
      .then(() => logger.info({ userId: user._id, action }, "Fellowship review email sent"))
      .catch((err) => logger.error({ userId: user._id, errorMsg: err.message }, "Fellowship review email failed"));

    logger.info({applicationId: id, userId: application.user._id}, "Application rejected successfully");
    return res.status(200).json({
      success: true,
      message: "Application rejected",
      application,
    });
  } catch (err) {
    logger.error({applicationId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error rejecting application");
    return res.status(500).json({ message: "Server error" });
  }
};




export default {
  getAllFellowshipRegistrations,
  reviewFellowshipApplication,
  getApplicationsByStatus,
  deleteFellowshipRegistration,
  getAllRegistrationsByUser,
  getYears,
  getAllApplications,
  approveApplication,
  rejectApplication,
};
