import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import userModel from "../Models/userModel.js";
dotenv.config();

const enrichUserData = async(req, res, next) => {
    try {
        if(!req.auth?.userId){
            return res.status(401).json({msg: "User not authenticated"});
        }

        const dbUser = await userModel.findOne({ clerkUserId: req.auth.userId })
            .populate('activeMembership', 
                'status currentPeriodEnd cancelAtPeriodEnd stripeSubscriptionId'
            );

        if (!dbUser) {
            return res.status(404).json({ 
                msg: "User profile not found in database" 
            });
        }

        // Mirrors membershipModel.hasPublicationAccess()
        const mem = dbUser.activeMembership;
        const hasMembership =
            mem !== null &&
            mem !== undefined &&
            ['active', 'trialing'].includes(mem.status) &&
            new Date(mem.currentPeriodEnd) > new Date();

        req.user = {
            userId:           dbUser._id,
            clerkUserId:      req.auth.userId,
            email:            dbUser.email,
            username:         dbUser.FullName,
            role:             dbUser.role,
            profilePicture:   dbUser.profilePicture,
            activeMembership: mem ?? null,
            hasMembership,
        };

        next();

    } catch(err) {
        console.error("Error enriching user data:", err);
        return res.status(500).json({ 
            msg: "Error fetching user data",
            error: err.message 
        });
    }
}

const authenticateToken = [requireAuth() , enrichUserData];
export default authenticateToken;