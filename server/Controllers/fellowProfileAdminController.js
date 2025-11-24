import mongoose from 'mongoose';
import fellowProfileModel from '../Models/fellowProfileModel.js';

export const fetchProfilesToReview = async (req, res) =>{
    try{
        const {tab, search, status, cohort} = req.params;
        console.log("TRYING TO FETCH FELLOW PROFILES");
        console.log("This is the req body-->", {tab, search, status, cohort});

        return res.status(200).json({success:true, msg: "Profile fetched successfully."});
    }catch(err){
        console.log("This error occurred while trying to fetch profiles for review--->", err);
        return res.status(500).json({success: false, msg: "Internal Server Error. Try again soon."});
    }
}

export const checkIfOnboarded = async (req, res) => {
    try{
        const {userId} = req.body;

        const response = await fellowProfileModel.find({userId: userId});
        const result = false;
        if(response){
            result = true;
        }

        return res.status(200).json({msg: "Successful Implementation", result: result, response: response});
    }catch(err){
        console.log("This error occurred while checking if user profile already exists--->", err);
        return res.status(500).json({msg: "Internal Server Error"});
    }
}