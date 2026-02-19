import fellowProfileModel from "../Models/fellowProfileModel.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import mongoose from "mongoose";
import userModel from "../Models/userModel.js";
import logger from "../utils/logger.js";
import { sendApplicationSubmissionEmail, handleFellowProfileUpdate } from "../utils/sendMail.js";
import {generateSignedUrlForViewing} from "./onboardingController.js";
import { sendEmail, fellowProfileUpdateTemplate } from "../utils/NewEmail/index.js";


/**
 * @route   GET /api/fellow-profile/:registrationId
 * @desc    Get fellow profile status for a specific registration (for user viewing)
 * @access  Private
 */
export const getFellowProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find fellow profile for this registration
    const profile = await fellowProfileModel.findOne({
      userId: userId,
    });

    console.log("Here is the profile that is coming out of the getfellowprofileByuserID controller", profile);

    if (!profile) {
      // No profile exists - user hasn't started onboarding
      logger.debug({userId}, "Fetching fellow profile failed: No profile found");
      return res.status(200).json({ profile: null, isProfile: false });
    }

    // Return profile with basic info (don't need full data for status check)
    logger.debug({userId, profileId: profile._id}, "Fellow profile retrieved successfully");
    return res.status(200).json({
      profile: profile,
      isProfile: true,
    });
  } catch (error) {
    logger.error({userId: req.params.userId, errorMsg: error.message, stack: error.stack}, "Error fetching fellow profile");
    return res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

/**
 * @route   GET /api/fellow-profile/:id
 * @desc    Get fellow profile by ID (for public profile viewing)
 * @access  Public
 */
export const getFellowProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn({id}, "Profile fetch failed: Invalid ID format");
      return res.status(400).json({ message: "Invalid profile ID format" });
    }

    // Find fellow profile by ID and populate user details
    const profile = await fellowProfileModel.findById(id).populate('userId', 'email FullName profilePicture');

    if (!profile) {
      logger.warn({id}, "Profile fetch failed: Profile not found");
      return res.status(404).json({ message: "Profile not found" });
    }

   /*  // Check if profile is public/approved
    if (!profile.isPublic || profile.status !== "APPROVED") {
      logger.warn({id}, "Profile fetch failed: Profile is not public");
      return res.status(403).json({ message: "Profile is not available for public viewing" });
    } */

    // Generate signed URL for headshot if it exists
    let professionalHeadshotUrl = profile.professionalHeadshotUrl;
    if (profile.professionalHeadshotKey) {
      try {
        professionalHeadshotUrl = await generateSignedUrlForViewing(profile.professionalHeadshotKey);
      } catch (err) {
        logger.warn({id, errorMsg: err.message}, "Failed to generate signed URL for headshot");
        // Continue with the existing URL if signing fails
      }
    }

    // Format response
    const formattedProfile = {
      _id: profile._id,
      userId: profile.userId,
      displayName: profile.displayName || '',
      headline: profile.headline || '',
      bio: profile.bio || '',
      professionalHeadshotUrl,
      currentRole: profile.currentRole || { title: '', organization: '' },
      expertise: profile.expertise || [],
      socialLinks: profile.socialLinks || {
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
      },
      portfolioItems: profile.portfolioItems || [],
      status: profile.status,
      approvedAt: profile.approvedAt,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };

    logger.debug({id}, "Fellow profile retrieved successfully");
    return res.status(200).json({
      success: true,
      profile: formattedProfile
    });
  } catch (error) {
    logger.error({id: req.params.id, errorMsg: error.message, stack: error.stack}, "Error fetching fellow profile by ID");
    return res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

    /**
     * @route   GET /api/admin/onboarding-profiles
     * @desc    List onboarding profiles for admin with filters and stats
     * @access  Private (admin)
     */
    export const adminGetOnboardingProfiles = async (req, res) => {
      try {
        const { tab = 'pending-review', search = '', status = 'all', cohort = 'all' } = req.query;

        // Basic stats
        const profilesCount = await fellowProfileModel.countDocuments();
        const submittedCount = await fellowProfileModel.countDocuments({ status: 'SUBMITTED' });
        const revisionCount = await fellowProfileModel.countDocuments({ status: 'REVISION_NEEDED' });
        const approvedCount = await fellowProfileModel.countDocuments({ status: 'APPROVED' });
        const notStartedCount = await fellowshipRegistrationModel.countDocuments({ onboardingStatus: 'PENDING' });

        const stats = {
          total: profilesCount + notStartedCount,
          submitted: submittedCount,
          notStarted: notStartedCount,
          revision: revisionCount,
          approved: approvedCount
        };

        // Build filters for list
        const keyword = search?.trim();

        if (tab === 'not-started') {
          // return registrations that haven't started onboarding yet
          const regQuery = { onboardingStatus: 'PENDING' };
          // cohort filter (optional)
          if (cohort && cohort !== 'all') {
            // populate fellowship and filter by a `cycle` field if present
            // we'll filter after population if needed
          }

          let regs = await fellowshipRegistrationModel.find(regQuery)
            .populate('user', 'email FullName profilePicture')
            .populate({ path: 'fellowship' });

          if (cohort && cohort !== 'all') {
            regs = regs.filter(r => r.fellowship && String(r.fellowship.cycle).toLowerCase() === String(cohort).toLowerCase());
          }

          if (keyword) {
            regs = regs.filter(r => (
              (r.user?.email && r.user.email.toLowerCase().includes(keyword.toLowerCase())) ||
              (r.user?.FullName && r.user.FullName.toLowerCase().includes(keyword.toLowerCase()))
            ));
          }

          // Map registrations to a shape compatible with frontend expectations
          const profiles = regs.map(r => ({
            _id: r._id,
            userId: r.user,
            displayName: r.user?.FullName || '',
            professionalHeadshotUrl: r.user?.profilePicture || '',
            headline: '',
            status: 'PENDING'
          }));

          logger.debug({tab, profilesCount: profiles.length, stats}, "Admin onboarding profiles retrieved for not-started tab");
          return res.status(200).json({ profiles, stats });
        }

        // For pending-review or general listing, fetch fellow profiles
        const query = {};
        // status filter
        if (status && status !== 'all') query.status = status;

        // search filter: match displayName, headline or user email / fullname
        let profiles = await fellowProfileModel.find(query)
          .populate('userId', 'email FullName profilePicture')
          .limit(500)
          .lean();


        if (keyword) {
          const k = keyword.toLowerCase();
          profiles = profiles.filter(p => (
            (p.displayName && p.displayName.toLowerCase().includes(k)) ||
            (p.headline && p.headline.toLowerCase().includes(k)) ||
            (p.userId?.email && p.userId.email.toLowerCase().includes(k)) ||
            (p.userId?.FullName && p.userId.FullName.toLowerCase().includes(k))
          ));
        }

        // If specifically asking pending-review, filter for SUBMITTED
        if (tab === 'pending-review') {
          profiles = profiles.filter(p => p.status === 'SUBMITTED' || p.status === 'REVISION_NEEDED' );
        }

        logger.debug({tab, profilesCount: profiles.length, stats}, "Admin onboarding profiles retrieved successfully");
        return res.status(200).json({ profiles, stats });
      } catch (error) {
        logger.error({errorMsg: error.message, stack: error.stack}, "Error fetching admin onboarding profiles");
        return res.status(500).json({ message: 'Server error fetching onboarding profiles', error: error.message });
      }
    };

    /**
     * @route   POST /api/admin/onboarding-profiles/:profileId/approve
     * @desc    Approve a fellow profile and make it public
     * @access  Private (admin)
     */

export const approveFellowProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const adminId = req.user?._id;

    const profile = await fellowProfileModel.findById(profileId);
    if (!profile) {
      logger.warn({profileId}, "Profile approval failed: Profile not found");
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.status === "APPROVED") {
      logger.warn({profileId}, "Profile approval failed: Profile already approved");
      return res.status(400).json({ message: "Profile already approved" });
    }

    profile.status = "APPROVED";
    profile.approvedAt = new Date();
    profile.isPublic = true;

    if (adminId) {
      profile.approvedBy = adminId;
    }

    await profile.save();

    // Update fellowship registration onboarding status
    if (profile.fellowshipRegistrationId) {
      await fellowshipRegistrationModel.findByIdAndUpdate(
        profile.fellowshipRegistrationId,
        {
          onboardingStatus: "APPROVED",
          onboardingCompletedAt: new Date(),
          fellowProfileId: profile._id,
        }
      );
    }

    /* Fire-and-forget email dispatch */
    const user = await userModel.findById(profile.userId);

    /* sendEmail({
      to: user.email,
      ...fellowProfileUpdateTemplate({
        name: user.FullName,
        fellowProfileName: profile.displayName,
        status: "APPROVED",
      }),
    }).catch((err) =>
      logger.error({profileId, userId: profile.userId, errorMsg: err.message}, "Fellow profile approval email failed")
    ); */

    logger.info({profileId, adminId, userId: profile.userId}, "Fellow profile approved successfully");
    return res.status(200).json({ message: "Profile approved successfully" });
  } catch (error) {
    logger.error({profileId: req.params.profileId, errorMsg: error.message, stack: error.stack}, "Error approving profile");
    return res.status(500).json({
      message: "Server error approving profile",
      error: error.message,
    });
  }
};

    /**
     * @route   POST /api/admin/onboarding-profiles/:profileId/request-revision
     * @desc    Add admin comment and request revision from applicant
     * @access  Private (admin)
     */
    export const requestRevisionOnProfile = async (req, res) => {
      try {
        const { profileId } = req.params;
        const { comments } = req.body;
        const adminId = req.user?._id;

        if (!comments || !comments.trim()) {
          logger.warn({profileId}, "Revision request failed: Comments are missing");
          return res.status(400).json({ message: 'Comments are required to request a revision' });
        }

        const profile = await fellowProfileModel.findById(profileId);
        if (!profile) {
          logger.warn({profileId}, "Revision request failed: Profile not found");
          return res.status(404).json({ message: 'Profile not found' });
        }

        profile.adminComments = profile.adminComments || [];
        profile.adminComments.push({ comment: comments, createdBy: adminId, createdAt: new Date() });
        profile.status = 'REVISION_NEEDED';
        await profile.save();

        // Update registration onboarding status back to IN_PROGRESS so fellow can edit
        if (profile.fellowshipRegistrationId) {
          await fellowshipRegistrationModel.findByIdAndUpdate(profile.fellowshipRegistrationId, {
            onboardingStatus: 'IN_PROGRESS'
          });
        }

        const user = await userModel.findById(profile.userId);

       /*  sendEmail({
          to: user.email,
          ...fellowProfileUpdateTemplate({
            name: user.FullName,
            fellowProfileName: profile.name,
            status: "REVIEW_NEEDED",
          }),
        }).catch(err => {
          logger.error({profileId, userId: profile.userId, errorMsg: err.message}, "Fellow profile revision email failed");
        }); */

        logger.info({profileId, adminId, userId: profile.userId}, "Revision requested successfully");
        return res.status(200).json({ message: 'Revision requested successfully' });
      } catch (error) {
        logger.error({profileId: req.params.profileId, errorMsg: error.message, stack: error.stack}, "Error requesting revision");
        return res.status(500).json({ message: 'Server error requesting revision', error: error.message });
      }
    };

    /**
     * @route   POST /api/admin/send-onboarding-reminder/:registrationId
     * @desc    Send a reminder email to a user who hasn't started onboarding
     * @access  Private (admin)
     */

export const sendOnboardingReminder = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const registration = await fellowshipRegistrationModel
      .findById(registrationId)
      .populate("user", "email FullName")
      .populate("fellowship");

    if (!registration) {
      logger.warn({registrationId}, "Reminder send failed: Registration not found");
      return res.status(404).json({ message: "Registration not found" });
    }

    // Update reminder metadata
    registration.lastReminderSent = new Date();
    registration.reminderCount = (registration.reminderCount || 0) + 1;
    await registration.save();

    /* Fire-and-forget email dispatch */
    const to = registration.user?.email;
    const name = registration.user?.FullName || "";
    const fellowshipName = registration.fellowship?.name || "the fellowship";

  /*   if (to) {
      sendEmail({
        to,
        ...applicationSubmissionTemplate({
          name,
          fellowshipName,
        }),
      }).catch((err) =>
        logger.error({registrationId, userId: registration.user?._id, errorMsg: err.message}, "Onboarding reminder email failed")
      );
    } */

    logger.info({registrationId, userId: registration.user?._id, reminderCount: registration.reminderCount}, "Onboarding reminder recorded successfully");
    return res.status(200).json({
      message: "Reminder recorded and email attempted",
    });
  } catch (error) {
    logger.error({registrationId: req.params.registrationId, errorMsg: error.message, stack: error.stack}, "Error sending onboarding reminder");
    return res.status(500).json({
      message: "Server error sending reminder",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/fellow-profile/draft/:registrationId
 * @desc    Load existing draft for a user's fellowship registration
 * @access  Private
 */
//to fetch drafts
export const loadDraftFellowProfile = async(req, res) =>{
    try {
    const userId = req.params.userId;

    // Find existing draft
    const profile = await fellowProfileModel.findOne({
      userId: userId,
    });

    if (!profile) {
      logger.debug({userId}, "No draft found for user");
      return res.status(404).json({ 
        message: 'No draft found' 
      });
    }

    const viewableLinkHeadshot = await generateSignedUrlForViewing(profile.professionalHeadshotKey);
    // Return the profile data
    logger.debug({userId, profileId: profile._id}, "Draft fellow profile loaded successfully");
    res.status(200).json({
      displayName: profile.displayName || '',
      headline: profile.headline || '',
      bio: profile.bio || '',
      professionalHeadshotUrl:  viewableLinkHeadshot || '',
      professionalHeadshotKey: profile.professionalHeadshotKey || '',
      currentRole: profile.currentRole || { title: '', organization: '' },
      expertise: profile.expertise.length > 0 ? profile.expertise : ['', '', ''],
      socialLinks: profile.socialLinks || {
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
      },
      portfolioItems: profile.portfolioItems || [],
      status: profile.status
    });

  } catch (error) {
    logger.error({userId: req.params.userId, errorMsg: error.message, stack: error.stack}, "Error loading draft fellow profile");
    res.status(500).json({ 
      message: 'Server error while loading draft',
      error: error.message 
    });
  }
}

//to actually save information

export const submitFellowProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { hasNewImage, ...profileData } = req.body;

    let profile = await fellowProfileModel.findOne({ userId });

    let responseData = {
      msg: "Draft saved successfully",
      profileId: profile?._id,
      status: profile?.status || "COMPLETED",
      presignedUrl: null,
      key: null,
    };

    /* Image handling logic */
    if (hasNewImage) {
      const { fileName, fileType, fileSize } = profileData;

      if (!fileType || !fileType.startsWith("image/")) {
        logger.warn({userId, fileType}, "Profile submission failed: Invalid file type");
        return res.status(400).json({ msg: "File uploaded must be an image" });
      }

      if (fileSize > 10 * 1024 * 1024) {
        logger.warn({userId, fileSize}, "Profile submission failed: File too large");
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

    /* Update or create profile */
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

      updateData.status = "SUBMITTED";

      profile = await fellowProfileModel.findByIdAndUpdate(
        profile._id,
        updateData,
        { new: true }
      );

      responseData.profileId = profile._id;
      responseData.status = profile.status;

      logger.info({userId, profileId: profile._id, previousStatus: profile.status}, "Fellow profile updated successfully");
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
        status: "COMPLETED",
      });

      await profile.save();

      await fellowshipRegistrationModel.findByIdAndUpdate(
        userId,
        {
          onboardingStatus: "IN_PROGRESS",
          onboardingStartedAt: new Date(),
        }
      );

      responseData.profileId = profile._id;

      logger.info({userId, profileId: profile._id}, "New fellow profile created successfully");
    }

    /* Fire-and-forget email dispatch */
    const user = await userModel.findById(userId);

   /*  sendEmail({
      to: user.email,
      ...fellowProfileUpdateTemplate({
        name: user.FullName,
        fellowProfileName: profile.displayName,
        status: "SUBMITTED",
      }),
    }).catch((err) =>
      logger.error({userId, profileId: profile._id, errorMsg: err.message}, "Fellow profile submitted email failed")
    );  */

    return res.status(200).json(responseData);
  } catch (err) {
    logger.error({userId: req.params.userId, errorMsg: err.message, stack: err.stack}, "Error saving fellow profile");
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
