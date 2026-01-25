import userModel from "../Models/userModel.js";
import logger from "../utils/logger.js";
import {
  sendEmail,
  accountApprovalTemplate,
} from "../utils/NewEmail/index.js";


/**
 * Fetch users with optional filtering by status, searching by name/email, and sorting
 */
export const fetchNonVerifiedUsers = async (req, res) => {
  try {
    const { status, sort, search } = req.query;

    let query = {};

    // Build dynamic query based on status filter
    if (status && status !== "all") {
      if (status === "pending") query.isVerifiedbyAdmin = false;
      if (status === "approved") query.isVerifiedbyAdmin = true;
    }

    // Add regex search for name or email (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Apply sort order (newest first by default)
    const sortOption = sort === "oldest"
      ? { createdAt: 1 }
      : { createdAt: -1 };

    const users = await userModel
      .find(query)
      .select("-__v")
      .sort(sortOption)
      .lean();

    logger.info({userid: req.auth?.userId, resultCount: users.length,status, sort,search: Boolean(search)}, 'Admin fetched users successfully');

    return res.status(200).json({
      msg: "Successfully fetched users",
      users,
    });
  } catch (error) {

    logger.error({userid: req.auth?.userId, errorMsg: error.message, stack: error.stack, status: req.query.status,
    sort: req.query.sort,
    search: req.query.search,}, 'Error fetching users for admin');
    return res.status(500).json({
      error: "Failed to fetch users",
      message: error.message,
    });

  }
};

/**
 * Verify a pending user and optionally send approval email
 * Prevents re-verification of already approved users
 */
export const verifyUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { sendEmail: shouldSendEmail = true } = req.body;

    const user = await userModel.findById(id);

    if (!user) {
      logger.warn({userid: id}, "User could not be found because User ID does not exist");
      return res.status(404).json({
        error: "User not found",
        message: "User does not exist",
      });
    }

    // Prevent re-verification
    if (user.isVerifiedbyAdmin) {
      logger.debug({userid: id, verificationStatus: user.isVerifiedbyAdmin}, "User verification attempt failed because user is already verified");

      return res.status(400).json({
        error: "Already verified",
        message: "User is already verified",
      });
    }

    // Update verification status
    user.isVerifiedbyAdmin = true;
    user.verifiedAt = new Date();
    await user.save();

    /* Fire-and-forget email dispatch to avoid blocking response */
    if (shouldSendEmail) {
      sendEmail({
        to: user.email,
        ...accountApprovalTemplate({
          name: user.name || user.FullName,
        }),
      }).catch((err) =>
        logger.error(
        {
          targetUserId: id,
          errorMessage: err.message,
          stack: err.stack
        },
        'Account approval email failed'
      )
      );
    }

    logger.info({userid: id, verificationStatus: user.isVerifiedbyAdmin}, "User verified successfully by admin");

    return res.json({
      success: true,
      message: "User verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerifiedbyAdmin: user.isVerifiedbyAdmin,
        verifiedAt: user.verifiedAt,
      },
      emailTriggered: shouldSendEmail,
    });
  } catch (error) {
    logger.error({adminUserid: req.auth?.userId, targetUserId: id, errorMsg: error.message, stack: error.stack}, 'Error verifying user by admin');
    return res.status(500).json({
      error: "Failed to verify user",
      message: error.message,
    });
  }
};

/**
 * Reject a pending user (cannot reject already verified users)
 */
export const rejectUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      logger.warn({targetUserId: id}, "Rejection failed: User not found");
      return res.status(404).json({
        error: "User not found",
        message: "User does not exist",
      });
    }

    // Prevent rejection of verified users
    if (user.isVerifiedbyAdmin) {

      logger.debug({targetUserId: id, verificationStatus: user.isVerifiedbyAdmin}, "Rejection failed: User already verified");

      return res.status(400).json({
        error: "Cannot reject",
        message: "Cannot reject an already approved user",
      });
    }

    // Set rejection status (remains unverified)
    user.isVerifiedbyAdmin = false;
    await user.save();

    logger.info({targetUserId: id, adminUserId: req.auth?.userId , verificationStatus: user.isVerifiedbyAdmin}, "Rejection successful");

    return res.json({
      success: true,
      message: "User rejected",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    logger.error({adminUserId: req.auth?.userId, targetUserId: id, errorMsg: error.message, stack: error.stack}, 'Error rejecting user by admin');

    return res.status(500).json({
      error: "Failed to reject user",
      message: error.message,
    });
  }
};

/**
 * Retrieve all users pending admin verification (sorted by newest first)
 */
export const getPendingVerificationUsers = async (req, res) => {
  try {
    const pendingUsers = await userModel
      .find({ isVerifiedbyAdmin: false })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    logger.debug({adminUserId: req.auth?.userId, pendingCount: pendingUsers.length}, 'Fetched pending verification users');

    return res.json(pendingUsers);
  } catch (error) {
    
    logger.error({adminUserId: req.auth?.userId, errorMsg: error.message, stack: error.stack}, 'Error fetching pending verification users');

    return res.status(500).json({
      error: "Failed to fetch pending users",
      message: error.message,
    });
  }
};
