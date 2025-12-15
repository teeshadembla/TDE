import fellowProfileModel from "../Models/fellowProfileModel.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import mongoose from "mongoose";
import userModel from "../Models/userModel.js";
import { sendApplicationSubmissionEmail } from "../utils/sendMail.js";
import {generateSignedUrlForViewing} from "./onboardingController.js";

/**
 * @route   GET /api/fellow-profile/:registrationId
 * @desc    Get fellow profile status for a specific registration (for user viewing)
 * @access  Private
 */
export const getFellowProfileByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find fellow profile for this registration
    const profile = await fellowProfileModel.findOne({
      userId: userId,
    });

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
    export const approveFellowProfile = async (req, res) => {
      try {
        const { profileId } = req.params;
        const adminId = req.user?._id;

        const profile = await fellowProfileModel.findById(profileId);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        if (profile.status === 'APPROVED') {
          return res.status(400).json({ message: 'Profile already approved' });
        }

        profile.status = 'APPROVED';
        profile.approvedAt = new Date();
        if (adminId) profile.approvedBy = adminId;
        profile.isPublic = true;

        await profile.save();

        // Update fellowship registration onboarding status if exists
        if (profile.fellowshipRegistrationId) {
          await fellowshipRegistrationModel.findByIdAndUpdate(profile.fellowshipRegistrationId, {
            onboardingStatus: 'APPROVED',
            onboardingCompletedAt: new Date(),
            fellowProfileId: profile._id
          });
        }

        return res.status(200).json({ message: 'Profile approved successfully' });
      } catch (error) {
        console.error('Error approving profile:', error);
        return res.status(500).json({ message: 'Server error approving profile', error: error.message });
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
    export const sendOnboardingReminder = async (req, res) => {
      try {
        const { registrationId } = req.params;

        const registration = await fellowshipRegistrationModel.findById(registrationId).populate('user', 'email FullName').populate('fellowship');
        if (!registration) return res.status(404).json({ message: 'Registration not found' });

        // update reminder metadata
        registration.lastReminderSent = new Date();
        registration.reminderCount = (registration.reminderCount || 0) + 1;
        await registration.save();

        // attempt to send an email (uses existing application submission template as a simple reminder)
        try {
          const to = registration.user?.email;
          const name = registration.user?.FullName || '';
          const fellowshipName = registration.fellowship?.name || 'the fellowship';
          if (to) {
            await sendApplicationSubmissionEmail({ to, name, fellowshipName });
          }
        } catch (mailErr) {
          // don't fail the whole request on email errors; log and continue
          console.error('Reminder email failed:', mailErr);
        }

        return res.status(200).json({ message: 'Reminder recorded and email attempted' });
      } catch (error) {
        console.error('Error sending onboarding reminder:', error);
        return res.status(500).json({ message: 'Server error sending reminder', error: error.message });
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
export const submitFellowProfile = async(req, res) => {
    try {
        const userId = req.params.userId;
        const { hasNewImage, ...profileData } = req.body;

        console.log("This is the profile data received:", profileData);

        
        // Check if profile exists
        let profile = await fellowProfileModel.findOne({
            userId: userId
        });

        // Prepare response object
        let responseData = {
            msg: 'Draft saved successfully',
            profileId: profile?._id,
            status: profile?.status || 'COMPLETED',
            presignedUrl: null,
            key: null,
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

            console.log({ presignedUrl, fileUrl, key });

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

            updateData.status = 'SUBMITTED';

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
                status: 'COMPLETED'
            });

            await profile.save();
            
            // Update registration onboarding status
            await fellowshipRegistrationModel.findByIdAndUpdate(
                user, //update using user id, means all of the user's registrations will show onboarding in progress
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
