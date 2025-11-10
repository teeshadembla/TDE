import express from "express";
import {saveDraftFellowProfile,submitFellowProfile, loadDraftFellowProfile} from "../Controllers/fellowProfileController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
const fellowProfileRouter = express.Router();

fellowProfileRouter.post('/saveDraft/:registrationId',authenticateToken, saveDraftFellowProfile);
fellowProfileRouter.get('/getDraft/:registrationId', loadDraftFellowProfile)
fellowProfileRouter.post('/submit/:registrationId', submitFellowProfile);

export default fellowProfileRouter;
