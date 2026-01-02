import userModel from "../Models/userModel.js";
import {
  sendEmail,
  accountApprovalTemplate,
} from "../utils/NewEmail/index.js";

/* ============================
   Fetch users (admin review)
============================ */
export const fetchNonVerifiedUsers = async (req, res) => {
  try {
    const { status, sort, search } = req.query;

    let query = {};

    if (status && status !== "all") {
      if (status === "pending") query.isVerifiedbyAdmin = false;
      if (status === "approved") query.isVerifiedbyAdmin = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption = sort === "oldest"
      ? { createdAt: 1 }
      : { createdAt: -1 };

    const users = await userModel
      .find(query)
      .select("-__v")
      .sort(sortOption)
      .lean();

    return res.status(200).json({
      msg: "Successfully fetched users",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      error: "Failed to fetch users",
      message: error.message,
    });
  }
};

/* ============================
   Verify user by admin
============================ */
export const verifyUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { sendEmail: shouldSendEmail = true } = req.body;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User does not exist",
      });
    }

    if (user.isVerifiedbyAdmin) {
      return res.status(400).json({
        error: "Already verified",
        message: "User is already verified",
      });
    }

    user.isVerifiedbyAdmin = true;
    user.verifiedAt = new Date();
    await user.save();

    /* ---------------- Email (fire-and-forget) ---------------- */
    if (shouldSendEmail) {
      sendEmail({
        to: user.email,
        ...accountApprovalTemplate({
          name: user.name || user.FullName,
        }),
      }).catch((err) =>
        console.error("Account approval email failed:", err)
      );
    }

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
    console.error("Error verifying user:", error);
    return res.status(500).json({
      error: "Failed to verify user",
      message: error.message,
    });
  }
};

/* ============================
   Reject user by admin
============================ */
export const rejectUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User does not exist",
      });
    }

    if (user.isVerifiedbyAdmin) {
      return res.status(400).json({
        error: "Cannot reject",
        message: "Cannot reject an already approved user",
      });
    }

    user.isVerifiedbyAdmin = false;
    await user.save();

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
    console.error("Error rejecting user:", error);
    return res.status(500).json({
      error: "Failed to reject user",
      message: error.message,
    });
  }
};

/* ============================
   Get pending verification users
============================ */
export const getPendingVerificationUsers = async (req, res) => {
  try {
    const pendingUsers = await userModel
      .find({ isVerifiedbyAdmin: false })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return res.status(500).json({
      error: "Failed to fetch pending users",
      message: error.message,
    });
  }
};
