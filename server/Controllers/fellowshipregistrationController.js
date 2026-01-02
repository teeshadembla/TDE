import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import fellowshipModel from "../Models/fellowshipModel.js";
import userModel from "../Models/userModel.js";

import {
  sendEmail,
  applicationApprovalTemplate,
  applicationRejectionTemplate,
} from "../services/email/index.js";

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
    console.error("Error fetching fellowship registrations:", error);
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
      return res.status(404).json({ msg: "Application not found" });
    }

    if (application.status !== "PENDING_REVIEW") {
      return res.status(400).json({ msg: "Application already reviewed" });
    }

    application.status = action;
    application.adminComments = adminComments;
    application.reviewedAt = new Date();
    await application.save();

    const user = application.user;

    if (action === "APPROVED") {
      const paymentAmount =
        application.experience === "0-2" || application.experience === "3-5"
          ? 4000
          : 8000;

      sendEmail({
        to: user.email,
        ...applicationApprovalTemplate({
          name: user.FullName,
          fellowshipName: `${application.workgroupId} - Cycle ${application.fellowship.cycle}`,
          applicationId: application._id,
          paymentAmount,
        }),
      }).catch((err) =>
        console.error("Approval email failed:", err)
      );
    }

    if (action === "REJECTED") {
      sendEmail({
        to: user.email,
        ...applicationRejectionTemplate({
          name: user.FullName,
          fellowshipName: `${application.workgroupId} - Cycle ${application.fellowship.cycle}`,
          reason: adminComments,
        }),
      }).catch((err) =>
        console.error("Rejection email failed:", err)
      );
    }

    return res.status(200).json({
      success: true,
      message: `Application ${action.toLowerCase()}`,
      application,
    });
  } catch (err) {
    console.error("Error reviewing fellowship application:", err);
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
    console.error("Error fetching applications by status:", error);
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
      return res.status(404).json({ msg: "Registration not found" });
    }

    await fellowshipRegistrationModel.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Registration deleted successfully" });
  } catch (err) {
    console.error("Error deleting fellowship registration:", err);
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
    console.error("Error getting user registrations:", err);
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
    console.error("Error fetching years:", err);
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
    console.error("Error fetching applications:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   Approve application (no payment)
============================ */
const approveApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await fellowshipRegistrationModel.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "APPROVED";
    application.reviewedAt = new Date();
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application approved",
      application,
    });
  } catch (err) {
    console.error("Error approving application:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   Reject application
============================ */
const rejectApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await fellowshipRegistrationModel
      .findById(id)
      .populate("user")
      .populate("fellowship");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "REJECTED";
    application.reviewedAt = new Date();
    await application.save();

    sendEmail({
      to: application.user.email,
      ...applicationRejectionTemplate({
        name: application.user.FullName,
        fellowshipName: `${application.workgroupId} - Cycle ${application.fellowship.cycle}`,
        reason:
          application.adminComments ||
          "Unfortunately, your application was not accepted at this time.",
      }),
    }).catch((err) =>
      console.error("Rejection email failed:", err)
    );

    return res.status(200).json({
      success: true,
      message: "Application rejected",
      application,
    });
  } catch (err) {
    console.error("Error rejecting application:", err);
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
