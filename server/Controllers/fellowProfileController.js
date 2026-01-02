import fellowProfileModel from "../Models/fellowProfileModel.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import mongoose from "mongoose";
import userModel from "../Models/userModel.js";
import { sendApplicationSubmissionEmail, handleFellowProfileUpdate } from "../utils/sendMail.js";
import {generateSignedUrlForViewing} from "./onboardingController.js";
import { sendEmail, fellowProfileUpdateTemplate } from "../services/email/index.js";


/**
 * @route   GET /api/fellow-profile/:registrationId
 * @desc    Get fellow profile status for a specific registration (for user viewing)
 * @access  Private
 */
export const getFellowProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Fetching fellow profile for userId:", userId);

    // Find fellow profile for this registration
    const profile = await fellowProfileModel.findOne({
      userId: userId,
    });

    console.log("Fetched fellow profile:", profile);
    if (!profile) {
      // No profile exists - user hasn't started onboarding
      return res.status(200).json({ profile: null, isProfile: false });
    }

    // Return profile with basic info (don't need full data for status check)
    return res.status(200).json({
      profile: profile,
      isProfile: true,
    });
  } catch (error) {
    console.error('Error fetching fellow profile:', error);
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

        return res.status(200).json({ profiles, stats });
      } catch (error) {
        console.error('Error in adminGetOnboardingProfiles:', error);
        return res.status(500).json({ message: 'Server error fetching onboarding profiles', error: error.message });
      }
    };

    /**
     * @route   POST /api/admin/onboarding-profiles/:profileId/approve
     * @desc    Approve a fellow profile and make it public
     * @access  Private (admin)
     */
    import { sendEmail, fellowProfileUpdateTemplate } from "../services/email/index.js";

export const approveFellowProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const adminId = req.user?._id;

    const profile = await fellowProfileModel.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.status === "APPROVED") {
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

    /* ---------------- Email (fire-and-forget) ---------------- */
    const user = await userModel.findById(profile.userId);

    sendEmail({
      to: user.email,
      ...fellowProfileUpdateTemplate({
        name: user.FullName,
        fellowProfileName: profile.displayName,
        status: "APPROVED",
      }),
    }).catch((err) =>
      console.error("Fellow profile approval email failed:", err)
    );

    return res.status(200).json({ message: "Profile approved successfully" });
  } catch (error) {
    console.error("Error approving profile:", error);
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

        if (!comments || !comments.trim()) return res.status(400).json({ message: 'Comments are required to request a revision' });

        const profile = await fellowProfileModel.findById(profileId);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

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

        sendEmail({
          to: user.email,
          ...fellowProfileUpdateTemplate({
            name: user.FullName,
            fellowProfileName: profile.name,
            status: "REVIEW_NEEDED",
          }),
        }).catch(err => {
          console.error("Fellow profile revision email failed:", err);
        });


        return res.status(200).json({ message: 'Revision requested successfully' });
      } catch (error) {
        console.error('Error requesting revision:', error);
        return res.status(500).json({ message: 'Server error requesting revision', error: error.message });
      }
    };

    /**
     * @route   POST /api/admin/send-onboarding-reminder/:registrationId
     * @desc    Send a reminder email to a user who hasn't started onboarding
     * @access  Private (admin)
     */
    import { sendEmail, applicationSubmissionTemplate } from "../services/email/index.js";

export const sendOnboardingReminder = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const registration = await fellowshipRegistrationModel
      .findById(registrationId)
      .populate("user", "email FullName")
      .populate("fellowship");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Update reminder metadata
    registration.lastReminderSent = new Date();
    registration.reminderCount = (registration.reminderCount || 0) + 1;
    await registration.save();

    /* ---------------- Email (fire-and-forget) ---------------- */
    const to = registration.user?.email;
    const name = registration.user?.FullName || "";
    const fellowshipName = registration.fellowship?.name || "the fellowship";

    if (to) {
      sendEmail({
        to,
        ...applicationSubmissionTemplate({
          name,
          fellowshipName,
        }),
      }).catch((err) =>
        console.error("Onboarding reminder email failed:", err)
      );
    }

    return res.status(200).json({
      message: "Reminder recorded and email attempted",
    });
  } catch (error) {
    console.error("Error sending onboarding reminder:", error);
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
      return res.status(404).json({ 
        message: 'No draft found' 
      });
    }

    const viewableLinkHeadshot = await generateSignedUrlForViewing(profile.professionalHeadshotKey);
    // Return the profile data
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
    console.error('Error loading draft:', error);
    res.status(500).json({ 
      message: 'Server error while loading draft',
      error: error.message 
    });
  }
}

//to actually save information
import { sendEmail, fellowProfileUpdateTemplate } from "../services/email/index.js";

export const submitFellowProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { hasNewImage, ...profileData } = req.body;

    console.log("This is the profile data received:", profileData);

    let profile = await fellowProfileModel.findOne({ userId });

    let responseData = {
      msg: "Draft saved successfully",
      profileId: profile?._id,
      status: profile?.status || "COMPLETED",
      presignedUrl: null,
      key: null,
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

      updateData.status = "SUBMITTED";

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
    }

    /* ---------------- Email (fire-and-forget) ---------------- */
    const user = await userModel.findById(userId);

    sendEmail({
      to: user.email,
      ...fellowProfileUpdateTemplate({
        name: user.FullName,
        fellowProfileName: profile.displayName,
        status: "SUBMITTED",
      }),
    }).catch((err) =>
      console.error("Fellow profile submitted email failed:", err)
    );

    return res.status(200).json(responseData);
  } catch (err) {
    console.error("Error saving draft:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
