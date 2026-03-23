import fellowshipregistrationController from "../Controllers/fellowshipregistrationController.js";
import {submitFellowshipApplication} from "../Controllers/paymentController.js";
import {getAllRegistrations} from "../Controllers/fellowshipController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
import express from "express";
import requirePermission from "../middleware/requirePermission.js";

const fellowshipRegistrationRouter = express.Router();

/* Application submission endpoint */
fellowshipRegistrationRouter.post("/submitFellowshipApplication",authenticateToken, requirePermission("apply_fellowship") ,submitFellowshipApplication);

fellowshipRegistrationRouter.get("/getFellowshipRegistrations/:id", fellowshipregistrationController.getAllFellowshipRegistrations);

/* Application Moderation Endpoints */
fellowshipRegistrationRouter.post("/rejectedFellowshipRegistration/:id", authenticateToken, requirePermission("moderate_applications") ,fellowshipregistrationController.rejectApplication);
fellowshipRegistrationRouter.post("/acceptedFellowshipRegistration/:id", authenticateToken, requirePermission("moderate_applications"), fellowshipregistrationController.approveApplication);
fellowshipRegistrationRouter.delete("/deleteFellowshipRegistration/:id", authenticateToken, requirePermission("moderate_applications"), fellowshipregistrationController.deleteFellowshipRegistration);

fellowshipRegistrationRouter.get("/getAllRegistrationsByUser/:userId", fellowshipregistrationController.getAllRegistrationsByUser);

fellowshipRegistrationRouter.get("/getYears", fellowshipregistrationController.getYears);

/* Endpoints to get fellowships needing review */
fellowshipRegistrationRouter.get("/getFellowshipsNeedingReview", getAllRegistrations);

export default fellowshipRegistrationRouter;
