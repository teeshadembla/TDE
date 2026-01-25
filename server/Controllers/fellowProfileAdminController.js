import mongoose from 'mongoose';
import fellowProfileModel from '../Models/fellowProfileModel.js';
import userModel from '../Models/userModel.js';
import logger from '../utils/logger.js';

export const fetchProfilesToReview = async (req, res) =>{
    try{
        const {tab, search, status, cohort} = req.params;

        logger.debug({tab, search, status, cohort}, "Fellow profiles fetch successful");

        return res.status(200).json({success:true, msg: "Profile fetched successfully."});
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching fellow profiles");
        return res.status(500).json({success: false, msg: "Internal Server Error. Try again soon."});
    }
}

export const checkIfOnboarded = async (req, res) => {
    try{
        const {userId} = req.body;

        const isUserExisting = await userModel.findById(userId);

        if(!isUserExisting){
            logger.warn({userId}, "Onboarding check failed: User does not exist");
            return res.status(404).json({msg: "User does not exist"});
        }

        const response = await fellowProfileModel.find({userId: userId});
        const isOnboarded = response && response.length > 0;

        logger.debug({userId, isOnboarded}, "User onboarding status checked successfully");
        return res.status(200).json({msg: "Successful Implementation", result: isOnboarded, response: response});
    }catch(err){
        logger.error({errorMsg: err.message, stack: err.stack}, "Error checking onboarding status");
        return res.status(500).json({msg: "Internal Server Error"});
    }
}