import userModel from "../Models/userModel.js";
import tokenModel from "../Models/tokenModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {getAuth} from "@clerk/express"
import userValidationSchema from "../SchemaValidation/userValidationSchema.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import fellowshipModel from "../Models/fellowshipModel.js";
import { uploadToS3 } from '../utils/s3config.js';
import  clerkClient  from "../utils/clerkConfig.js";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import { handle2FASetupEmail } from "../utils/sendMail.js";
import { sendEmail, twoFAEnabledTemplate } from "../utils/NewEmail/index.js";

dotenv.config();

// ============================================
// Backend Signup Function with Clerk Integration
// ============================================

// First, install Clerk backend SDK: npm install @clerk/backend



const signup = async (req, res) => {
    try {
        // Parse JSON strings from FormData
        if (typeof req.body.socialLinks === 'string') {
            req.body.socialLinks = JSON.parse(req.body.socialLinks);
        }
        if (typeof req.body.followedTopicsArray === 'string') {
            req.body.followedTopicsArray = JSON.parse(req.body.followedTopicsArray);
        }
        if (typeof req.body.expertiseArray === 'string') {
            req.body.expertiseArray = JSON.parse(req.body.expertiseArray);
        }
        // Convert string boolean to actual boolean
        if (typeof req.body.isSubscribedToNewsletter === 'string') {
            req.body.isSubscribedToNewsletter = req.body.isSubscribedToNewsletter === 'true';
        }

        const { error, value } = userValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        const {
            FullName,
            email,
            role,
            socialLinks,
            followedTopicsArray,
            isSubscribedToNewsletter,
            location,
            title,
            department,
            company,
            expertiseArray,
            discoverySource,
            clerkUserId 
        } = value;

        logger.debug({email, role, discoverySource}, "User signup data validated");

        if (!FullName || !email || !role || !discoverySource) {
            logger.warn({FullName, email, role, discoverySource}, "Signup failed: Missing required fields");
            return res.status(401).json({
                msg: "Incomplete fields, Kindly fill all the required fields"
            });
        }

        // Check if Clerk user ID is provided
        if (!clerkUserId) {
            logger.warn({email}, "Signup failed: No Clerk user ID provided");
            return res.status(401).json({
                msg: "Authentication error. Please try signing up again."
            });
        }

        // Check for uniqueness of email
        const isUniqueEmail = await userModel.findOne({ email: email });
        if (isUniqueEmail) {
            logger.warn({email}, "Signup failed: Email already exists");
            return res.status(402).json({
                msg: `An account with ${email} exists. Try Signing up with another email`
            });
        }

        logger.debug({clerkUserId, email}, "User authenticated through Clerk, proceeding to save additional data");

        let profilePictureUrl = null;
        if (req.file) {
            try {
                logger.debug({fileName: req.file.originalname}, "Uploading profile picture to S3");
                profilePictureUrl = await uploadToS3(
                    req.file.buffer,
                    req.file.originalname,
                    req.file.mimetype,
                    'profile-pictures'
                );
                logger.debug({email, profilePictureUrl}, "Profile picture uploaded successfully");
            } catch (uploadError) {
                logger.error({email, errorMsg: uploadError.message, stack: uploadError.stack}, "Error uploading profile picture");
                return res.status(500).json({
                    msg: "Failed to upload profile picture. Please try again."
                });
            }
        }

        // Update Clerk user metadata with additional info
        try {
            await clerkClient.users.updateUser(clerkUserId, {
                publicMetadata: {
                    role: role,
                    location: location,
                    title: title,
                    department: department,
                    company: company,
                },
                privateMetadata: {
                    discoverySource: discoverySource,
                    isSubscribedToNewsletter: isSubscribedToNewsletter,
                }
            });
        } catch (clerkError) {
            logger.error({clerkUserId, email, errorMsg: clerkError.message}, "Error updating Clerk user metadata");
            // Continue anyway, as the main data will be in your database
        }

        const userData = {
            FullName: FullName,
            email: email,
            clerkUserId: clerkUserId, // Store Clerk user ID for reference
            profilePicture: profilePictureUrl,
            role: role,
            socialLinks: socialLinks,
            followedTopics: followedTopicsArray,
            membership: {
                isActive: false,
            },
            workGroupId: null,
            eventsRegistered: [],
            eventsParticipated: [],
            eventsSpokenAt: [],
            referencesGiven: [],
            isSubscribedToNewsletter: isSubscribedToNewsletter,
            location: location,
            title: title,
            department: department,
            company: company,
            expertise: expertiseArray,
            discoverySource: discoverySource,
        };

        const newUser = new userModel(userData);
        await newUser.save();

        logger.info({userId: newUser._id, email}, "User registered successfully");

        import('../utils/email/emailIntegration.js').then(module => {
            const emailIntegration = module.default;
            emailIntegration.handleUserSignup(newUser).catch(err => {
                logger.error({userId: newUser._id, errorMsg: err.message}, "Welcome email failed");
            });
        });

        return res.status(200).json({ 
            msg: "User registered successfully!",
            userId: newUser._id 
        });
    } catch (err) {
        logger.error({errorMsg: err.message, stack: err.stack}, "Error during user signup");
        return res.status(500).json({ msg: "Internal Server Error has occurred" });
    }
};

const login = async(req, res)=>{
    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            logger.warn({email}, "Login failed: Missing email or password");
            return res.status(400).json({msg: "Fields are incomplete, kindly fill all fields and try again."});
        }

        const currUser = await userModel.findOne({email: email});
        if(!currUser){
            logger.warn({email}, "Login failed: User not found");
            return res.status(401).json({msg: "User with this email ID does not exist."});
        }

        const match = bcrypt.compare(password, currUser.password);
        if(!match){
            logger.warn({email}, "Login failed: Invalid password");
            return res.status(403).json({msg: "The password you entered is wrong."});
        }

        const accessToken = jwt.sign(currUser.toJSON(), process.env.ACCESS_SECRET, {expiresIn: "15d"});
        const refreshToken = jwt.sign(currUser.toJSON(), process.env.REFRESH_SECRET);

        const newToken = new tokenModel({token: refreshToken});
        await newToken.save();

        res.cookie(
            "accessToken",
            accessToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                maxAge: 15 * 24 * 60 * 60 * 1000
            }
        )

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                maxAge: 15 * 24 * 60 * 60 * 1000,
            }
        )

        logger.info({userId: currUser._id, email}, "User logged in successfully");
        return res.status(200).json({
            userData: {_id: currUser._id, email: currUser.email, name:currUser.FullName , role:currUser.role},
            msg:"User logged in successfully",
            accessToken: accessToken,
        })

    }catch(err){
        logger.error({email: req.body.email, errorMsg: err.message, stack: err.stack}, "Error during login");
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

const logout = async(req,res)=>{
    try{
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            logger.warn({}, "Logout failed: Refresh token missing");
            return res.status(400).json({ msg: "Refresh token missing" });
        }

        await tokenModel.deleteOne({ token: refreshToken });

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        logger.info({}, "User logged out successfully");
        return res.status(200).json({ msg: "Logged out successfully" });
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error during logout");
        return res.status(500).json({msg:"Internal Server error"});
    }
}

const getMe = async(req, res) =>{
    try{
        const {userId} = getAuth(req);

        if (!userId) {
            logger.warn({}, "getMe failed: User not authenticated");
            return res.status(401).json({ msg: "Not authenticated" });
        }
        const user = await userModel.findOne({ clerkUserId: userId });

        if (!user) {
            logger.warn({userId}, "getMe failed: User not found in database");
            return res.status(404).json({ msg: "User not found in database" });
        }

        const cleanUser = {
        _id: user._id,
        FullName: user.FullName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerifiedbyAdmin: user.isVerifiedbyAdmin,
        };

        logger.debug({userId, userDbId: user._id}, "User authenticated and retrieved");
        return res.status(200).json({
        msg: "User is authenticated",
        user: cleanUser,
        });
        
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error in getMe");
        return res.status(500).json({msg:"Internal Server Error"});
    }
}

/* --------------------------------------------------------------------------------------------------------------------------------------------- */
/* Fellowship Dashboard Admin automatic user stats calculation */

const getUserStats = async (req, res) => {
    try{
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const monthlyRevenue = await fellowshipRegistrationModel.aggregate([
            {
            $match: {
                createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
                },
                paymentStatus: "COMPLETED"
            }
            },
            {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
            }
        ]);

        const totalRevenue = await fellowshipRegistrationModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        //calculating total number of fellowships and active fellowships
        const fellowships = await fellowshipModel.countDocuments({})
        const currentDate = new Date();
        const activeFellowships = await fellowshipModel.countDocuments({
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        });

        const monthlyApplications = await fellowshipRegistrationModel.countDocuments({
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        const pendingApplications = await fellowshipRegistrationModel.find({
            status: "PENDING_REVIEW",
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        }).populate('user', 'FullName').populate('fellowship', 'title');

        const uniqueParticipants = await fellowshipRegistrationModel.distinct('user').length;

        logger.debug({monthlyRevenue: monthlyRevenue[0]?.total, totalRevenue: totalRevenue[0]?.total, totalFellowships: fellowships, activeFellowships, monthlyApplications}, "User stats retrieved successfully");
        return res.status(200).json({ totalRevenue: totalRevenue[0]?.total || 0 , monthlyRevenue: monthlyRevenue[0]?.total || 0, totalFellowships: fellowships, activeFellowships: activeFellowships, monthlyApplications: monthlyApplications, pendingApplications: pendingApplications, totalUsers: uniqueParticipants });
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching user stats");
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Controller to fetch only core team members */

const getCoreTeamMembers = async (req, res) => {
    try {
        const coreTeamMembers = await userModel.find({ role: "core" });
        logger.debug({memberCount: coreTeamMembers.length}, "Core team members retrieved successfully");
        return res.status(200).json({ coreTeamMembers });
    } catch (err) {
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching core team members");
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

/* Controller to fetch only fellows */

const getFellows = async(req, res) => {
    try{
        const fellows = await userModel.find({ role: { $in: ["fellow", "chair"] }}).populate('workGroupId', 'title description');
        logger.debug({fellowCount: fellows.length}, "Fellows retrieved successfully");
        return res.status(200).json({ fellows });
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching fellows");
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

/* Update User Profile */
const updateUser = async(req, res)=>{
    try{
        const { id } = req.params;
        const updateData = req.body;
        logger.debug({userId: id}, "Updating user profile");
        const user = await userModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            logger.warn({userId: id}, "User update failed: User not found");
            return res.status(404).json({ msg: "User not found" });
        }
        logger.info({userId: id}, "User profile updated successfully");
        return res.status(200).json({ user });
    }catch(err){
        logger.error({userId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error updating user profile");
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

/* Deleting user profile */
const deleteUser = async(req, res) => {
    try{
        const {id} = req.params;
        logger.debug({userId: id}, "Attempting to delete user account");
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            logger.warn({userId: id}, "User deletion failed: User not found");
            return res.status(404).json({ msg: "User not found" });
        }
        logger.info({userId: id}, "User account deleted successfully");
        return res.status(200).json({ msg: "User deleted successfully" });

    }catch(err){
        logger.error({userId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error deleting user account");
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

/* To get user by ID, this can also be done using the getMe controller, but I am chosing to make another controller for the same purpose for manageablity */

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        logger.debug({userId: id}, "Fetching user by ID");
        const user = await userModel.findById(id);
        if (!user) {
            logger.warn({userId: id}, "User not found");
            return res.status(404).json({ msg: "User not found" });
        }
        logger.debug({userId: id}, "User retrieved successfully");
        return res.status(200).json({ user });
    } catch (err) {
        logger.error({userId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error fetching user by ID");
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};


export const enabledMFA = async (req, res) => {
  try {
    const { accountId } = req.body;
    logger.debug({userId: accountId}, "Enabling MFA for user account");

    const user = await userModel.findByIdAndUpdate(
      accountId,
      { isMFAenabled: true },
      { new: true }
    );

    if (!user) {
      logger.warn({userId: accountId}, "MFA enable failed: User not found");
      return res.status(404).json({ msg: "User not found" });
    }

    /* ---------------- Email (fire-and-forget) ---------------- */
    sendEmail({
      to: user.email,
      ...twoFAEnabledTemplate({
        name: user.FullName,
      }),
    }).catch((err) =>
      logger.error({userId: accountId, errorMsg: err.message}, "2FA enabled email failed")
    );

    logger.info({userId: accountId}, "MFA enabled successfully");
    return res.status(200).json({
      msg: "Successfully updated MFA status",
      response: user,
    });
  } catch (err) {
    console.error("Error occurred while enabling MFA for user:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
 

const forgotPassword = () => async (req, res) => {
  try {
    const { email, resetAt } = req.body;
    logger.debug({email}, "Processing password reset request");

    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      logger.warn({email}, "Password reset failed: User not found");
      return res.status(404).json({ 
        success: false, 
        msg: 'User not found' 
      });
    }

    // Update password reset timestamp
    user.lastPasswordReset = new Date(resetAt);
    await user.save();

    // Optional: Log security event
    logger.info({email, resetAt}, "Password reset logged successfully");

    // Optional: Send notification email to user
    // await sendPasswordResetConfirmationEmail(email);

    return res.status(200).json({ 
      success: true, 
      msg: 'Password reset logged successfully' 
    });

  } catch (error) {
    logger.error({email: req.body.email, errorMsg: error.message, stack: error.stack}, "Error logging password reset");
    return res.status(500).json({ 
      success: false, 
      msg: 'Internal server error' 
    });
  }
}

export default {signup, login, getMe, logout, forgotPassword, getUserStats, getCoreTeamMembers, getFellows, updateUser, deleteUser, getUserById, enabledMFA};