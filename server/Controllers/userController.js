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
import dotenv from "dotenv";
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

        console.log("Data coming from request body--->", {
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
        });

        if (!FullName || !email || !role || !discoverySource) {
            return res.status(401).json({
                msg: "Incomplete fields, Kindly fill all the required fields"
            });
        }

        // Check if Clerk user ID is provided
        if (!clerkUserId) {
            return res.status(401).json({
                msg: "Authentication error. Please try signing up again."
            });
        }

        // Check for uniqueness of email
        const isUniqueEmail = await userModel.findOne({ email: email });
        if (isUniqueEmail) {
            return res.status(402).json({
                msg: `An account with ${email} exists. Try Signing up with another email`
            });
        }

        // Note: Password is already hashed by Clerk, so we don't need to hash it again
        // We can store a reference or skip storing password entirely
        console.log("User authenticated through Clerk, proceeding to save additional data.");

        let profilePictureUrl = null;
        if (req.file) {
            try {
                console.log("Uploading profile picture to S3...");
                profilePictureUrl = await uploadToS3(
                    req.file.buffer,
                    req.file.originalname,
                    req.file.mimetype,
                    'profile-pictures'
                );
                console.log("Profile picture uploaded successfully:", profilePictureUrl);
            } catch (uploadError) {
                console.error("Error uploading profile picture:", uploadError);
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
            console.error("Error updating Clerk user metadata:", clerkError);
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

        console.log("The new user that we are going to create: ", userData);

        const newUser = new userModel(userData);
        await newUser.save();

        return res.status(200).json({ 
            msg: "User registered successfully!",
            userId: newUser._id 
        });
    } catch (err) {
        console.log("This error has occurred in the backend while registering user---->", err);
        return res.status(500).json({ msg: "Internal Server Error has occurred" });
    }
};

const login = async(req, res)=>{
    try{
        const {email, password} = req.body;
        console.log(req);
        
        if(!email || !password){
            return res.status(400).json({msg: "Fields are incomplete, kindly fill all fields and try again."});
        }

        const currUser = await userModel.findOne({email: email});
        if(!currUser){
            return res.status(401).json({msg: "User with this email ID does not exist."});
        }

        const match = bcrypt.compare(password, currUser.password);
        if(!match){
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

        return res.status(200).json({
            userData: {_id: currUser._id, email: currUser.email, name:currUser.FullName , role:currUser.role},
            msg:"User logged in successfully",
            accessToken: accessToken,
        })

    }catch(err){
        console.log("This error has occurred in the backend while executing login callback--->", err);
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

const logout = async(req,res)=>{
    try{
        const refreshToken = req.cookies.refreshToken;
        console.log("Refresh token has been fetched");
        if (!refreshToken) {
        return res.status(400).json({ msg: "Refresh token missing" });
        }

        console.log("refresh token is being deleted now");
        await tokenModel.deleteOne({ token: refreshToken });

        console.log("Clearing cookies now");
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

    return res.status(200).json({ msg: "Logged out successfully" });
    }catch(err){
        return res.status(500).json({msg:"Internal Server error"});
    }
}

const getMe = async(req, res) =>{
    try{
        console.log("Getting existing user");
        const {userId} = getAuth(req);

        console.log(userId);

        if (!userId) {
            return res.status(401).json({ msg: "Not authenticated" });
        }
        const user = await userModel.findOne({ clerkUserId: userId });

        if (!user) {
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

        return res.status(200).json({
        msg: "User is authenticated",
        user: cleanUser,
        });
        
    }catch(err){
        console.error("Error in getMe:", err);
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

        return res.status(200).json({ totalRevenue: totalRevenue[0]?.total || 0 , monthlyRevenue: monthlyRevenue[0]?.total || 0, totalFellowships: fellowships, activeFellowships: activeFellowships, monthlyApplications: monthlyApplications, pendingApplications: pendingApplications, totalUsers: uniqueParticipants });
    }catch(err){
        console.log("Error occurred in the backend callback of fetching user stats--->", err);
        return res.status(500).json({msg: "Internal Server Error"});
    }
}

/* Controller to fetch only core team members */

const getCoreTeamMembers = async (req, res) => {
    try {
        const coreTeamMembers = await userModel.find({ role: "core" });
        return res.status(200).json({ coreTeamMembers });
    } catch (err) {
        console.log("Error occurred in the backend callback of fetching core team members--->", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

/* Controller to fetch only fellows */

const getFellows = async(req, res) => {
    try{
        const fellows = await userModel.find({ role: { $in: ["fellow", "chair"] }}).populate('workGroupId', 'title description');
        return res.status(200).json({ fellows });
    }catch(err){
        console.log("Error occurred in the backend callback of fetching fellows--->", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

/* Update User Profile */
const updateUser = async(req, res)=>{
    try{
        console.log("Updating the user here and now....");
        const { id } = req.params;
        const updateData = req.body;
        console.log("The update data is:", updateData);
        const user = await userModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        return res.status(200).json({ user });
    }catch(err){
        console.log("Error occurred while updating user profile---->", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

/* Deleting user profile */
const deleteUser = async(req, res) => {
    try{
        const {id} = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        return res.status(200).json({ msg: "User deleted successfully" });

    }catch(err){
        console.log("Error occurred while deleting user profile---->", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

/* To get user by ID, this can also be done using the getMe controller, but I am chosing to make another controller for the same purpose for manageablity */

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.log("Error occurred while fetching user by ID---->", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};


export default {signup, login, getMe, logout, getUserStats, getCoreTeamMembers, getFellows, updateUser, deleteUser, getUserById};