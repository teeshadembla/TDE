import fellowProfileModel from "../Models/fellowProfileModel.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import generatePresignedUrl from '../utils/s3presigned.js';
import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// Helper to generate signed URL for viewing
export const generateSignedUrlForViewing = async (key) => {
    
        const s3Client = new S3Client({ 
            region: process.env.AWS_REGION_PP,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_PP,
                secretAccessKey: process.env.AWS_SECRET_KEY_PP
            }
        });
    
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME_PUBP,
        Key: key
    });
    
    // Valid for 7 days (604800 seconds)
    const signedUrl = await getSignedUrl(s3Client, command, { 
        expiresIn: 604800 
    });
    
    return signedUrl;
};

// Helper to delete object from S3
const deleteFromS3 = async (key) => {
    try {
        const s3Client = new S3Client({ 
            region: process.env.AWS_REGION_PP,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_PP,
                secretAccessKey: process.env.AWS_SECRET_KEY_PP
            }
        });
        
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME_PUBP,
            Key: key
        });
        
        await s3Client.send(command);
        console.log(`Successfully deleted: ${key}`);
        return true;
    } catch (error) {
        console.error(`Error deleting from S3: ${key}`, error);
        return false;
    }
};

/* Save draft with conditional image upload */
export const getPresignedUrlHeadshot = async(req, res) => {
    try {
        const userId = req.params.userId;
        const { hasNewImage, ...profileData } = req.body;

        // Check if profile exists
        let profile = await fellowProfileModel.findOne({
            userId: userId
        });

        // Prepare response object
        let responseData = {
            msg: 'Draft saved successfully',
            profileId: profile?._id,
            status: profile?.status || 'DRAFT'
        };

        // Handle image upload ONLY if there's a new image
        if (hasNewImage) {
            const { fileName, fileType, fileSize } = profileData;

            // Validate image
            if (!fileType || !fileType.startsWith('image/')) {
                return res.status(400).json({ msg: "File uploaded must be an image" });
            }

            if (fileSize > (10 * 1024 * 1024)) {
                return res.status(400).json({ msg: "File size must be less than 10MB" });
            }

            // Delete old image from S3 if it exists
            if (profile && profile.professionalHeadshotKey) {
                const oldKey = profile.professionalHeadshotKey;
                console.log(`Deleting old image: ${oldKey}`);
                await deleteFromS3(oldKey);
            }

            // Generate presigned URL
            const { presignedUrl, fileUrl, key } = await generatePresignedUrl(
                process.env.AWS_BUCKET_NAME_PUBP,
                userId,
                fileName,
                fileType,
                'uploads'
            );

            // Add image upload data to response
            responseData.presignedUrl = presignedUrl;
            responseData.key = key;
            
            // Store the KEY, not the full URL
            profileData.professionalHeadshotUrl = fileUrl;
            profileData.professionalHeadshotKey = key;
            
            // Reset image upload status to pending
            profileData.imageUploadStatus = 'pending';
        }

        // Update or create profile
        if (profile) {
            // Build update object with only provided fields
            const updateData = {};
            
            if (profileData.displayName !== undefined) updateData.displayName = profileData.displayName;
            if (profileData.headline !== undefined) updateData.headline = profileData.headline;
            if (profileData.bio !== undefined) updateData.bio = profileData.bio;
            if (profileData.professionalHeadshotUrl !== undefined) updateData.professionalHeadshotUrl = profileData.professionalHeadshotUrl;
            if (profileData.professionalHeadshotKey !== undefined) updateData.professionalHeadshotKey = profileData.professionalHeadshotKey;
            if (profileData.currentRole !== undefined) updateData.currentRole = profileData.currentRole;
            if (profileData.expertise !== undefined) updateData.expertise = profileData.expertise;
            if (profileData.socialLinks !== undefined) updateData.socialLinks = profileData.socialLinks;
            if (profileData.portfolioItems !== undefined) updateData.portfolioItems = profileData.portfolioItems;
            if (profileData.imageUploadStatus !== undefined) updateData.imageUploadStatus = profileData.imageUploadStatus;

            // Reset status to DRAFT if it was REVISION_NEEDED
            if (profile.status === 'REVISION_NEEDED') {
                updateData.status = 'DRAFT';
            }

            profile = await fellowProfileModel.findByIdAndUpdate(
                profile._id, 
                updateData, 
                { new: true }
            );
            
            responseData.profileId = profile._id;
            responseData.status = profile.status;
        } else {
            // Create new profile
            profile = new fellowProfileModel({
                userId: userId,
                displayName: profileData.displayName || '',
                headline: profileData.headline || '',
                bio: profileData.bio || '',
                professionalHeadshotUrl: profileData.professionalHeadshotUrl || '',
                professionalHeadshotKey: profileData.professionalHeadshotKey || '',
                currentRole: profileData.currentRole || { title: '', organization: '' },
                expertise: profileData.expertise || ['', '', ''],
                socialLinks: profileData.socialLinks || {
                    linkedin: '',
                    twitter: '',
                    github: '',
                    website: ''
                },
                portfolioItems: profileData.portfolioItems || [],
                imageUploadStatus: profileData.imageUploadStatus || 'pending',
                status: 'DRAFT'
            });

            await profile.save();
            
            // Update registration onboarding status
            await fellowshipRegistrationModel.findByIdAndUpdate(
                userId, //update using User ID
                { 
                    onboardingStatus: "IN_PROGRESS", 
                    onboardingStartedAt: new Date() 
                }
            );
            
            responseData.profileId = profile._id;
        }

        res.status(200).json(responseData);

    } catch(err) {
        console.log("Error saving draft:", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

/* Confirm image upload to S3 */
export const confirmUploadHeadshot = async(req, res) => {
    try {
        const { documentId } = req.body;

        const profile = await fellowProfileModel.findByIdAndUpdate(
            documentId,
            { imageUploadStatus: 'completed' },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ msg: "Profile not found." });
        }
        
        return res.status(200).json({ 
            msg: "Upload status updated successfully.",
            url: profile.professionalHeadshotUrl,
            key: profile.professionalHeadshotKey 
        });
    } catch(err) {
        console.log("Error confirming upload:", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

/* Get draft profile with signed image URL */
export const getDraft = async(req, res) => {
    try {
        const userId = req.user._id;

        const profile = await fellowProfileModel.findOne({
            userId: userId
        });

        if (!profile) {
            return res.status(404).json({ msg: "No draft found" });
        }

        // Convert to object and generate signed URL for image
        const profileData = profile.toObject();
        
        if (profileData.professionalHeadshotKey) {
            profileData.professionalHeadshotUrl = await generateSignedUrlForViewing(
                profileData.professionalHeadshotKey
            );
        }

        return res.status(200).json(profileData);
    } catch(err) {
        console.log("Error fetching draft:", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

/* Get public profile with signed image URL */
export const getPublicProfile = async(req, res) => {
    try {
        const { profileId } = req.params;

        const profile = await fellowProfileModel.findOne({
            _id: profileId,
            isPublic: true,
            status: 'APPROVED'
        });

        if (!profile) {
            return res.status(404).json({ msg: "Profile not found or not public" });
        }

        const profileData = profile.toObject();
        
        if (profileData.professionalHeadshotKey) {
            profileData.professionalHeadshotUrl = await generateSignedUrlForViewing(
                profileData.professionalHeadshotKey
            );
        }

        return res.status(200).json(profileData);
    } catch(err) {
        console.log("Error fetching public profile:", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

/* Delete headshot image */
export const deleteHeadshot = async(req, res) => {
    try {
        const userId = req.user._id;

        const profile = await fellowProfileModel.findOne({
            userId: userId
        });

        if (!profile) {
            return res.status(404).json({ msg: "Profile not found" });
        }

        if (!profile.professionalHeadshotKey) {
            return res.status(400).json({ msg: "No image to delete" });
        }

        // Delete from S3
        const deleted = await deleteFromS3(profile.professionalHeadshotKey);

        if (!deleted) {
            return res.status(500).json({ msg: "Failed to delete image from S3" });
        }

        // Remove from database
        profile.professionalHeadshotKey = '';
        profile.imageUploadStatus = 'pending';
        await profile.save();

        return res.status(200).json({ 
            msg: "Image deleted successfully" 
        });
    } catch(err) {
        console.log("Error deleting headshot:", err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};