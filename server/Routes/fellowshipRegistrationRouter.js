import fellowshipregistrationController from "../Controllers/fellowshipregistrationController.js";
import express from "express";

const fellowshipRegistrationRouter = express.Router();

fellowshipRegistrationRouter.get("/getFellowshipRegistrations", fellowshipregistrationController.getAllFellowshipRegistrations);

/* Application Moderation Endpoints */
fellowshipRegistrationRouter.post("/rejectedFellowshipRegistration/:id", fellowshipregistrationController.acceptFellowshipRegistration);
fellowshipRegistrationRouter.post("/acceptedFellowshipRegistration/:id", fellowshipregistrationController.rejectFellowshipRegistration);
fellowshipRegistrationRouter.delete("/deleteFellowshipRegistration/:id", fellowshipregistrationController.deleteFellowshipRegistration);

export default fellowshipRegistrationRouter;
