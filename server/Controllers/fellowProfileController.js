import fellowProfileModel from "../Models/fellowProfileModel.js";
import fellowshipRegistrationModel from "../Models/fellowshipRegistrationModel.js";
import mongoose from "mongoose";

/* 
@route  POST /api/fellow-profile/save-draft/:registrationId
@desc Save or update a draft of  a fellow's profile
@access Private(Only to users already registered for fellowship)
*/
export const saveDraftFellowProfile = async(req, res) =>{
    try{
        const {registrationId} = req.params;
        const userId = req.user._id;
        console.log("This is registration ID-->",registrationId);
        console.log("This is user ID-->",userId);
        console.log("Type of userId:", typeof userId);
        console.log("User from token -->", req.user);
        console.log("This is the body of request-->",req.body);
        const profileData = req.body;

        //verify the registration belongs to the same user
        const registration = await fellowshipRegistrationModel.findOne({_id: new mongoose.Types.ObjectId(registrationId), user: new mongoose.Types.ObjectId(userId)});

        if(!registration){
            return res.status(403).json({msg: "This is not your registration or it does not exist"});
        }

        let profile = await fellowProfileModel.findOne({userId: userId, fellowshipRegistrationId: registrationId});

        if(profile){
            // Update existing draft
            profile.displayName = profileData.displayName || profile.displayName;
            profile.headline = profileData.headline || profile.headline;
            profile.bio = profileData.bio || profile.bio;
            profile.professionalHeadshot = profileData.professionalHeadshot || profile.professionalHeadshot;
            profile.currentRole = profileData.currentRole || profile.currentRole;
            profile.expertise = profileData.expertise || profile.expertise;
            profile.socialLinks = profileData.socialLinks || profile.socialLinks;
            profile.portfolioItems = profileData.portfolioItems || profile.portfolioItems;

            // Keep status as DRAFT unless it was previously submitted
            if (profile.status === 'REVISION_NEEDED') {
                // Allow revision but don't auto-resubmit
                profile.status = 'DRAFT';
            }

            await profile.save();
        }else{
            // Create new draft
            profile = new fellowProfileModel({
                userId: userId,
                fellowshipRegistrationId: registrationId,
                displayName: profileData.displayName || '',
                headline: profileData.headline || '',
                bio: profileData.bio || '',
                professionalHeadshot: profileData.professionalHeadshot || '',
                currentRole: profileData.currentRole || { title: '', organization: '' },
                expertise: profileData.expertise || ['', '', ''],
                socialLinks: profileData.socialLinks || {
                linkedin: '',
                twitter: '',
                github: '',
                website: ''
                },
                portfolioItems: profileData.portfolioItems || [],
                status: 'DRAFT'
            });

            await profile.save();
            await fellowshipRegistrationModel.findByIdAndUpdate(registrationId, {onboardingStatus:"IN_PROGRESS", onboardingStartedAt: new Date()});
        }


        res.status(200).json({
            msg: 'Draft saved successfully',
            profileId: profile._id,
            status: profile.status
        });
    }catch(error){
        console.error('Error saving draft:', error);
    
        if (error.code === 11000) {
        return res.status(400).json({ 
            message: 'A profile already exists for this user' 
        });
        }

        res.status(500).json({ 
        message: 'Server error while saving draft',
        error: error.message 
        });
    }
}

/**
 * @route   GET /api/fellow-profile/draft/:registrationId
 * @desc    Load existing draft for a user's fellowship registration
 * @access  Private
 */
//to fetch drafts
export const loadDraftFellowProfile = async(req, res) =>{
    try {
    const { registrationId } = req.params;
    const userId = req.user._id;

    // Verify the registration belongs to the user
    const registration = await FellowshipRegistration.findOne({
      _id: registrationId,
      userId: userId
    });

    if (!registration) {
      return res.status(404).json({ 
        message: 'Fellowship registration not found or does not belong to you' 
      });
    }

    // Find existing draft
    const profile = await fellowProfileModel.findOne({
      userId: userId,
      fellowshipRegistrationId: registrationId
    });

    if (!profile) {
      return res.status(404).json({ 
        message: 'No draft found' 
      });
    }

    // Return the profile data
    res.status(200).json({
      displayName: profile.displayName || '',
      headline: profile.headline || '',
      bio: profile.bio || '',
      professionalHeadshot: profile.professionalHeadshot || '',
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
export const submitFellowProfile = async(req, res) =>{
    try {
        const { registrationId } = req.params;
        const userId = req.user._id;
        const profileData = req.body;

        // Verify the registration belongs to the user
        const registration = await fellowshipRegistrationModel.findOne({
        _id: registrationId,
        userId: userId
        });

        if (!registration) {
        return res.status(404).json({ 
            message: 'Fellowship registration not found or does not belong to you' 
        });
        }

        // Validate required fields
        const errors = [];

        if (!profileData.displayName || profileData.displayName.trim().length < 2) {
        errors.push('Display name is required (minimum 2 characters)');
        }
        if (!profileData.headline || profileData.headline.trim().length < 10) {
        errors.push('Headline is required (minimum 10 characters)');
        }
        if (!profileData.bio || profileData.bio.trim().length < 100) {
        errors.push('Bio must be at least 100 characters');
        }
        if (profileData.bio && profileData.bio.length > 500) {
        errors.push('Bio must not exceed 500 characters');
        }
        if (!profileData.professionalHeadshot) {
        errors.push('Professional headshot is required');
        }
        if (!profileData.currentRole?.title || !profileData.currentRole?.organization) {
        errors.push('Current role title and organization are required');
        }
        
        const validExpertise = profileData.expertise?.filter(e => e && e.trim().length > 0) || [];
        if (validExpertise.length < 3) {
        errors.push('At least 3 areas of expertise are required');
        }

        if (errors.length > 0) {
        return res.status(400).json({ 
            message: 'Validation failed',
            errors: errors 
        });
        }

        // Check if profile exists
        let profile = await fellowProfileModel.findOne({
        userId: userId,
        fellowshipRegistrationId: registrationId
        });

        if (profile) {
        // Check if already approved
        if (profile.status === 'APPROVED') {
            return res.status(400).json({ 
            message: 'Profile is already approved and cannot be resubmitted' 
            });
        }

        // Check if currently under review
        if (profile.status === 'UNDER_REVIEW') {
            return res.status(400).json({ 
            message: 'Profile is already under review' 
            });
        }

        // Update existing profile
        profile.displayName = profileData.displayName;
        profile.headline = profileData.headline;
        profile.bio = profileData.bio;
        profile.professionalHeadshot = profileData.professionalHeadshot;
        profile.currentRole = profileData.currentRole;
        profile.expertise = validExpertise;
        profile.socialLinks = profileData.socialLinks || profile.socialLinks;
        profile.portfolioItems = profileData.portfolioItems || profile.portfolioItems;
        profile.status = 'SUBMITTED';
        profile.submittedAt = new Date();
        
        } else {
        // Create new profile
        profile = new fellowProfileModel({
            userId: userId,
            fellowshipRegistrationId: registrationId,
            displayName: profileData.displayName,
            headline: profileData.headline,
            bio: profileData.bio,
            professionalHeadshot: profileData.professionalHeadshot,
            currentRole: profileData.currentRole,
            expertise: validExpertise,
            socialLinks: profileData.socialLinks || {
            linkedin: '',
            twitter: '',
            github: '',
            website: ''
            },
            portfolioItems: profileData.portfolioItems || [],
            status: 'SUBMITTED',
            submittedAt: new Date()
        });
        }

        await profile.save();

        res.status(200).json({
        message: 'Profile submitted successfully for review',
        profileId: profile._id,
        status: profile.status,
        submittedAt: profile.submittedAt
        });
    } catch (error) {
        console.error('Error submitting profile:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
        return res.status(400).json({ 
            message: 'A profile already exists for this user' 
        });
        }

        res.status(500).json({ 
        message: 'Server error while submitting profile',
        error: error.message 
        });
    }
}
