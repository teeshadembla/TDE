import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import fellowshipModel from "../Models/fellowshipModel.js";
import {
  sendApprovalEmailWithPaymentLink, 
  sendRejectionEmail,
  sendPaymentConfirmationEmail} from "../utils/sendMail.js";
// Import your email service
// import { sendApprovalEmailWithPaymentLink, sendRejectionEmail } from "../services/emailService.js";


// UPDATED: Get all applications for admin review
const getAllFellowshipRegistrations = async (req, res) => {
  const { id } = req.params;
  try {
    const registrations = await fellowshipRegistrationModel
      .find({ status: { $in: ["PENDING_REVIEW", "APPROVED", "CONFIRMED"] }, user: id }) // Fixed: changed userId to user
      .populate("fellowship", "cycle startDate endDate")
      .populate("user", "FullName email company title")
      .populate("workgroupId", "title description")
      .sort({ appliedAt: -1 }); // Most recent first

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

    const currReg = registrations.filter(reg => {
      const fellowship = reg.fellowship;
      const startDate = new Date(fellowship.startDate);
      const endDate = new Date(fellowship.endDate);
      
      // Set dates to start of day for comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      // Current fellowships: either upcoming (startDate > today) or ongoing (startDate <= today AND endDate >= today)
      return startDate > today || (startDate <= today && endDate >= today);
    });

    const pastReg = registrations.filter(reg => {
      const fellowship = reg.fellowship;
      const endDate = new Date(fellowship.endDate);
      
      // Set date to start of day for comparison
      endDate.setHours(0, 0, 0, 0);
      
      // Past fellowships: endDate < today
      return endDate < today;
    });

    return res.status(200).json({ 
      current: currReg, 
      past: pastReg,
      total: registrations.length,
      counts: {
        current: currReg.length,
        past: pastReg.length
      }
    });
  } catch (error) {
    console.error('Error fetching fellowship registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATED: Approve/Reject Fellowship Application
const reviewFellowshipApplication = async (req, res) => {
  const { id } = req.params;
  const { action, adminComments } = req.body; // action: "APPROVED" or "REJECTED"
  
  try {
    const application = await fellowshipRegistrationModel
      .findById(id)
      .populate('user')
      .populate('fellowship');
    
    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }

    if (application.status !== "PENDING_REVIEW") {
      return res.status(400).json({ msg: "Application has already been reviewed" });
    }

    // Update application
    application.status = action;
    application.adminComments = adminComments;
    application.reviewedAt = new Date();
    await application.save();

    // Send appropriate email
    if (action === "APPROVED") {
      const paymentAmount = application.experience === "0-2" || application.experience === "3-5" ? 4000 : 8000;
      
      // TODO: Uncomment when email service is set up
      
      await sendApprovalEmailWithPaymentLink({
        to: application.user.email,
        name: application.user.FullName,
        fellowshipName: `${application.workgroupId} - Cycle ${application.fellowship.cycle}`,
        applicationId: application._id,
        paymentAmount
      });
     
      
      console.log(`Approval email should be sent to ${application.user.email}`);
      
    } else if (action === "REJECTED") {
      // TODO: Uncomment when email service is set up
      
      await sendRejectionEmail({
        to: application.user.email,
        name: application.user.FullName,
        fellowshipName: `${application.workgroupId} - Cycle ${application.fellowship.cycle}`,
        reason: adminComments
      });
     
      
      console.log(`Rejection email should be sent to ${application.user.email}`);
    }

    res.status(200).json({ 
      success: true, 
      message: `Application ${action.toLowerCase()}`,
      application: application 
    });

  } catch (err) {
    console.log("Error reviewing fellowship application:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// LEGACY: Keep for backward compatibility but update logic
const acceptFellowshipRegistration = async (req, res) => {
  req.body = { action: "APPROVED", adminComments: req?.body?.adminComments || "" };
  return await reviewFellowshipApplication(req, res);
};

const rejectFellowshipRegistration = async (req, res) => {
  req.body = { action: "REJECTED", adminComments: req?.body?.adminComments || "" };
  return await reviewFellowshipApplication(req, res);
};

// UPDATED: Get applications by status for admin dashboard
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

    res.status(200).json({
      pendingReview,
      approved,
      confirmed,
      rejected,
      counts: {
        pendingReview: pendingReview.length,
        approved: approved.length,
        confirmed: confirmed.length,
        rejected: rejected.length
      }
    });
  } catch (error) {
    console.error('Error fetching applications by status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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
    console.log("Error deleting fellowship registration:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATED: Get user's applications with better status handling
const getAllRegistrationsByUser = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const currentDate = new Date();
    
    // Get all registrations for user
    const allRegistrations = await fellowshipRegistrationModel
      .find({ user: userId})
      .populate("fellowship")
      .populate("workgroupId", "title description")
      .sort({ appliedAt: -1 });

    // Categorize registrations
    const categorized = {
      pendingReview: [],
      approved: [],
      confirmed: [],
      rejected: [],
      current: [],
      past: []
    };
    
        

    allRegistrations.forEach(reg => {
      
      const endDate = new Date(reg.fellowship.endDate);
      // First categorize by status
      switch (reg.status) {
        case "PENDING_REVIEW":
          categorized.pendingReview.push(reg);
          if (endDate >= currentDate) {
              categorized.current.push(reg);
            } else{
              categorized.past.push(reg);
            }
          break;
        case "APPROVED":
          categorized.approved.push(reg);
          if (endDate >= currentDate) {
              categorized.current.push(reg);
            } else{
              categorized.past.push(reg);
            }
          break;
        case "CONFIRMED":
          categorized.confirmed.push(reg);
          if (endDate >= currentDate) {
              categorized.current.push(reg);
            } else{
              categorized.past.push(reg);
            }
        case "REJECTED":
          categorized.rejected.push(reg);
          break;
        
      }
    });

    return res.status(200).json({ registrations: categorized });
    
  } catch (err) {
    console.log("Error getting user registrations:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Keep existing getYears function as is
const getYears = async (req, res) => {
  try {
    const uniqueYears = await fellowshipModel.aggregate([
      {
        $addFields: {
          year: {
            $arrayElemAt: [
              { $split: ['$cycle', '-'] },
              -1
            ]
          }
        }
      },
      {
        $group: {
          _id: '$year'
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id'
        }
      },
      {
        $sort: { year: -1 }
      }
    ]);

    const years = uniqueYears.map(item => item.year);
    return res.status(200).json({ years: years });
    
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  getAllFellowshipRegistrations,
  reviewFellowshipApplication, // NEW: Main review function
  acceptFellowshipRegistration, // LEGACY: For backward compatibility
  rejectFellowshipRegistration, // LEGACY: For backward compatibility
  getApplicationsByStatus, // NEW: Better admin dashboard data
  deleteFellowshipRegistration,
  getAllRegistrationsByUser,
  getYears
};