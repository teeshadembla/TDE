import fellowshipregistrationController from "../Controllers/fellowshipregistrationController.js";
import express from "express";

const fellowshipRegistrationRouter = express.Router();

fellowshipRegistrationRouter.get("/getFellowshipRegistrations", fellowshipregistrationController.getAllFellowshipRegistrations);

/* Application Moderation Endpoints */
fellowshipRegistrationRouter.post("/rejectedFellowshipRegistration/:id", fellowshipregistrationController.rejectFellowshipRegistration);
fellowshipRegistrationRouter.post("/acceptedFellowshipRegistration/:id", fellowshipregistrationController.acceptFellowshipRegistration);
fellowshipRegistrationRouter.delete("/deleteFellowshipRegistration/:id", fellowshipregistrationController.deleteFellowshipRegistration);

fellowshipRegistrationRouter.get("/getAllRegistrationsByUser/:userId", fellowshipregistrationController.getAllRegistrationsByUser);

fellowshipRegistrationRouter.get("/getYears", fellowshipregistrationController.getYears);

export default fellowshipRegistrationRouter;
