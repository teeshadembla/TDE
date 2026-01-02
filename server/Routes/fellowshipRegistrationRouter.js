import fellowshipregistrationController from "../Controllers/fellowshipregistrationController.js";
import {submitFellowshipApplication} from "../Controllers/paymentController.js";
import {getAllRegistrations} from "../Controllers/fellowshipController.js";
import express from "express";

const fellowshipRegistrationRouter = express.Router();

/* Application submission endpoint */
fellowshipRegistrationRouter.post("/submitFellowshipApplication", submitFellowshipApplication);

fellowshipRegistrationRouter.get("/getFellowshipRegistrations/:id", fellowshipregistrationController.getAllFellowshipRegistrations);

/* Application Moderation Endpoints */
fellowshipRegistrationRouter.post("/rejectedFellowshipRegistration/:id", fellowshipregistrationController.rejectApplication);
fellowshipRegistrationRouter.post("/acceptedFellowshipRegistration/:id", fellowshipregistrationController.approveApplication);
fellowshipRegistrationRouter.delete("/deleteFellowshipRegistration/:id", fellowshipregistrationController.deleteFellowshipRegistration);

fellowshipRegistrationRouter.get("/getAllRegistrationsByUser/:userId", fellowshipregistrationController.getAllRegistrationsByUser);

fellowshipRegistrationRouter.get("/getYears", fellowshipregistrationController.getYears);

/* Endpoints to get fellowships needing review */
fellowshipRegistrationRouter.get("/getFellowshipsNeedingReview", getAllRegistrations);

export default fellowshipRegistrationRouter;
