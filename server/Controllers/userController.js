import userModel from "../Models/userModel.js";
import tokenModel from "../Models/tokenModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userValidationSchema from "../SchemaValidation/userValidationSchema.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import fellowshipModel from "../Models/fellowshipModel.js";
import dotenv from "dotenv";
dotenv.config();

const signup = async(req,res)=>{
    try{
        const { error, value } = userValidationSchema.validate(req.body);
        if (error) {
        return res.status(400).json({ msg: error.details[0].message });
        }
        const {FullName, email, password, role, socialLinks, followedTopics, isSubscribedToNewsletter, location, title, department, company, expertise, discoverySource} = value;
        console.log("Data coming from request body--->", {FullName, email, password, role, socialLinks, followedTopics, isSubscribedToNewsletter, location, title, department, company, expertise, discoverySource});

        if(!FullName || !email || !password || !role || !discoverySource){
            return res.status(401).json({msg: "Incomplete fields, Kindly fill all the required fields and then log in"});
        }

        //check for uniqueness of email
        const isUniqueEmail = await userModel.findOne({email: email});
        if(isUniqueEmail){
            return res.status(402).json({msg: `An account with ${email} exists. Try Signing up with another email`});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        console.log("Password has been hashed, now moving forward to making a data object to create user.");

        const userData = {
            FullName: FullName,
            email: email,
            password: hashedPassword,
            role: role,
            socialLinks: socialLinks,
            followedTopics: followedTopics,
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
            expertise: expertise,
            discoverySource: discoverySource,
        }

        console.log("The new user that we are going to create: ", userData);

        const newUser = new userModel(userData);
        await newUser.save();

        return res.status(200).json({msg: "User registered successfully!"});
    }catch(err){
        console.log("This error has occurred in the backend while registering user---->",err);
        return res.status(500).json({msg: "Internal Server Error has occurred"});
    }

}

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
        console.log("Starting callback function now");
        const user = {_id: req.user._id , name: req.user.FullName, email: req.user.email, role: req.user.role};
        console.log("User from the backend has been fetched and it is as follows--->", user);

        if(!user){
            return res.status(500).json({msg:"User not found"});
        }

        return res.status(200).json({msg: "User is authenticated", user: user});
    }catch(err){
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
                }
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
            status: "PENDING",
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


export default {signup, login, getMe, logout, getUserStats};