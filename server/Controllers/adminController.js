import userModel from "../Models/userModel.js";
import {sendApprovalEmail} from "../utils/verificationEmailService.js";

export const fetchNonVerifiedUsers =  async (req, res) => {
  try {
    const { status, sort, search } = req.query;

    // Build query
    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      if (status === 'pending') {
        query.isVerifiedbyAdmin = false;
      } else if (status === 'approved') {
        query.isVerifiedbyAdmin = true;
      }
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default: recent first
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 }; // Oldest first
    }

    // Fetch users
    const users = await userModel.find(query)
      .select('-__v')
      .sort(sortOption)
      .lean();

    return res.status(200).json({msg:"Successfully fetched users", users} );
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      message: error.message 
    });
  }
}

export const verifyUserByAdmin =  async (req, res) => {
  try {
    const { id } = req.params;
    const { sendEmail = true } = req.body;

    // Find user
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User does not exist' 
      });
    }

    // Check if already verified
    if (user.isVerifiedbyAdmin) {
      return res.status(400).json({ 
        error: 'Already verified',
        message: 'User is already verified' 
      });
    }

    // Update user
    user.isVerifiedbyAdmin = true;

    await user.save();

    // Send email notification
    let emailResult = null;
    if (sendEmail) {
      emailResult = await sendApprovalEmail(user);
      
      if (!emailResult.success) {
        console.error('Email failed but user was verified:', emailResult.error);
      }
    }

    res.json({
      success: true,
      message: 'User verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerifiedbyAdmin: user.isVerifiedbyAdmin,
        status: user.status,
        verifiedAt: user.verifiedAt
      },
      emailSent: emailResult?.success || false
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ 
      error: 'Failed to verify user',
      message: error.message 
    });
  }
}

export const rejectUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User does not exist' 
      });
    }

    // Check if already approved
    if (user.isVerifiedbyAdmin) {
      return res.status(400).json({ 
        error: 'Cannot reject',
        message: 'Cannot reject an already approved user' 
      });
    }

    user.isVerifiedbyAdmin = false;

    await user.save();

    res.json({
      success: true,
      message: 'User rejected',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ 
      error: 'Failed to reject user',
      message: error.message 
    });
  }
}

export const getPendingVerificationUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      isVerifiedbyAdmin: false,
    })
    .select('-__v')
    .sort({ createdAt: -1 }) // Recent first
    .lean();

    res.json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch pending users',
      message: error.message 
    });
  }
};

