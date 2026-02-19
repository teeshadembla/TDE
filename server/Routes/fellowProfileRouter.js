import express from "express";
import {submitFellowProfile, loadDraftFellowProfile, adminGetOnboardingProfiles, approveFellowProfile, requestRevisionOnProfile, sendOnboardingReminder, getFellowProfileByUserId, getFellowProfileById} from "../Controllers/fellowProfileController.js";
import { confirmUploadHeadshot, getPresignedUrlHeadshot, deleteHeadshot } from "../Controllers/onboardingController.js";
import {fetchLeadership, fetchTeam} from "../Controllers/fellowProfileDataController.js";
import { uploadLimiter } from "../utils/Production/rateLimiter.js";
import { fetchProfilesToReview, checkIfOnboarded } from "../Controllers/fellowProfileAdminController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
const fellowProfileRouter = express.Router();

fellowProfileRouter.post('/presigned-url/headshot/:userId',authenticateToken, uploadLimiter , getPresignedUrlHeadshot);
fellowProfileRouter.put('/headshot/confirmUpload', authenticateToken, confirmUploadHeadshot);
fellowProfileRouter.get('/getDraft/:userId', authenticateToken, loadDraftFellowProfile);
fellowProfileRouter.delete('/headshot/delete/:userId', authenticateToken, deleteHeadshot);
fellowProfileRouter.post('/submit/:userId', authenticateToken, submitFellowProfile);

fellowProfileRouter.get('/onboarding-profiles',  adminGetOnboardingProfiles);
fellowProfileRouter.post('/onboarding-profiles/:profileId/approve',  approveFellowProfile);
fellowProfileRouter.post('/onboarding-profiles/:profileId/request-revision',  requestRevisionOnProfile);
fellowProfileRouter.post('/send-onboarding-reminder/:registrationId', sendOnboardingReminder);

/* Admin functions */

fellowProfileRouter.get('/getFellowProfile/:userId', authenticateToken, getFellowProfileByUserId);


/* Data fetching */
fellowProfileRouter.get("/fetchLeadership", fetchLeadership);
fellowProfileRouter.get("/fetchTeam", fetchTeam);
fellowProfileRouter.get('/:id', getFellowProfileById);

export default fellowProfileRouter;
