import express from "express";
import {submitFellowProfile, loadDraftFellowProfile, adminGetOnboardingProfiles, approveFellowProfile, requestRevisionOnProfile, sendOnboardingReminder, getFellowProfileByUserId, getFellowProfileById} from "../Controllers/fellowProfileController.js";
import { confirmUploadHeadshot, getPresignedUrlHeadshot, deleteHeadshot } from "../Controllers/onboardingController.js";
import {fetchLeadership, fetchTeam, fetchAllProfiles} from "../Controllers/fellowProfileDataController.js";
import { uploadLimiter } from "../utils/Production/rateLimiter.js";
import { fetchProfilesToReview, checkIfOnboarded } from "../Controllers/fellowProfileAdminController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
import requirePermission from "../middleware/requirePermission.js";
import eventMiddlewares from "../Middlewares/eventMiddlewares.js";
const fellowProfileRouter = express.Router();

fellowProfileRouter.post('/presigned-url/headshot/:userId',authenticateToken, requirePermission("submit_onboarding_form") ,uploadLimiter , getPresignedUrlHeadshot);
fellowProfileRouter.put('/headshot/confirmUpload', authenticateToken, confirmUploadHeadshot);
fellowProfileRouter.get('/getDraft/:userId', authenticateToken, authenticateToken, requirePermission("submit_onboarding_form"),loadDraftFellowProfile);
fellowProfileRouter.delete('/headshot/delete/:userId', authenticateToken, deleteHeadshot);
fellowProfileRouter.post('/submit/:userId', authenticateToken, authenticateToken, requirePermission("submit_onboarding_form"), submitFellowProfile);

fellowProfileRouter.get('/onboarding-profiles',  authenticateToken , eventMiddlewares.isAdmin , adminGetOnboardingProfiles);
fellowProfileRouter.post('/onboarding-profiles/:profileId/approve', authenticateToken , requirePermission("moderate_profiles"), approveFellowProfile);
fellowProfileRouter.post('/onboarding-profiles/:profileId/request-revision',  authenticateToken , requirePermission("moderate_profiles"), requestRevisionOnProfile);
fellowProfileRouter.post('/send-onboarding-reminder/:registrationId', authenticateToken , requirePermission("moderate_profiles"), sendOnboardingReminder);

/* Admin functions */

fellowProfileRouter.get('/getFellowProfile/:userId', authenticateToken, getFellowProfileByUserId);


/* Data fetching */
fellowProfileRouter.get("/fetchLeadership", fetchLeadership);
fellowProfileRouter.get("/fetchTeam", fetchTeam);

fellowProfileRouter.get("/fetchAllProfiles", fetchAllProfiles);
fellowProfileRouter.get('/:id', getFellowProfileById);

export default fellowProfileRouter;
