import fellowProfileModel from "../Models/fellowProfileModel.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import userModel from "../Models/userModel.js";
import generatePresignedUrl from '../utils/s3presigned.js';
import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { handleFellowProfileUpdate } from "../utils/sendMail.js";
import { sendEmail, fellowProfileUpdateTemplate } from "../utils/NewEmail/index.js";
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
export const getPresignedUrlHeadshot = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { hasNewImage, ...profileData } = req.body;

    let profile = await fellowProfileModel.findOne({ userId });
    const userDetails = await userModel.findById(userId);

    let responseData = {
      msg: "Draft saved successfully",
      profileId: profile?._id,
      status: profile?.status || "DRAFT",
    };

    /* ---------------- Image handling ---------------- */
    if (hasNewImage) {
      const { fileName, fileType, fileSize } = profileData;

      if (!fileType || !fileType.startsWith("image/")) {
        return res.status(400).json({ msg: "File uploaded must be an image" });
      }

      if (fileSize > 10 * 1024 * 1024) {
        return res.status(400).json({ msg: "File size must be less than 10MB" });
      }

      if (profile?.professionalHeadshotKey) {
        await deleteFromS3(profile.professionalHeadshotKey);
      }

      const { presignedUrl, fileUrl, key } = await generatePresignedUrl(
        process.env.AWS_BUCKET_NAME_PUBP,
        userId,
        fileName,
        fileType,
        "uploads"
      );

      responseData.presignedUrl = presignedUrl;
      responseData.key = key;

      profileData.professionalHeadshotUrl = fileUrl;
      profileData.professionalHeadshotKey = key;
      profileData.imageUploadStatus = "pending";
    }

    /* ---------------- Update or create profile ---------------- */
    if (profile) {
      const updateData = {};

      const fields = [
        "displayName",
        "headline",
        "bio",
        "professionalHeadshotUrl",
        "professionalHeadshotKey",
        "currentRole",
        "expertise",
        "socialLinks",
        "portfolioItems",
        "imageUploadStatus",
      ];

      fields.forEach((field) => {
        if (profileData[field] !== undefined) {
          updateData[field] = profileData[field];
        }
      });

      if (profile.status === "REVISION_NEEDED") {
        updateData.status = "DRAFT";
      }

      profile = await fellowProfileModel.findByIdAndUpdate(
        profile._id,
        updateData,
        { new: true }
      );

      responseData.profileId = profile._id;
      responseData.status = profile.status;
    } else {
      profile = new fellowProfileModel({
        userId,
        displayName: profileData.displayName || "",
        headline: profileData.headline || "",
        bio: profileData.bio || "",
        professionalHeadshotUrl: profileData.professionalHeadshotUrl || "",
        professionalHeadshotKey: profileData.professionalHeadshotKey || "",
        currentRole: profileData.currentRole || { title: "", organization: "" },
        expertise: profileData.expertise || ["", "", ""],
        socialLinks: profileData.socialLinks || {
          linkedin: "",
          twitter: "",
          github: "",
          website: "",
        },
        portfolioItems: profileData.portfolioItems || [],
        imageUploadStatus: profileData.imageUploadStatus || "pending",
        status: "DRAFT",
      });

      await profile.save();

      await fellowshipRegistrationModel.findByIdAndUpdate(userId, {
        onboardingStatus: "IN_PROGRESS",
        onboardingStartedAt: new Date(),
      });

      responseData.profileId = profile._id;
    }

    /* ---------------- Email (fire-and-forget) ---------------- */
    sendEmail({
      to: userDetails.email,
      ...fellowProfileUpdateTemplate({
        name: userDetails.FullName,
        fellowProfileName: profile.displayName,
        status: "DRAFT",
      }),
    }).catch((err) =>
      console.error("Fellow profile draft email failed:", err)
    );

    return res.status(200).json(responseData);
  } catch (err) {
    console.error("Error saving draft:", err);
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