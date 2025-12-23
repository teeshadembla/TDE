import express from "express";
const fellowshipRouter = express.Router();
import fellowshipRegistrationController from "../Controllers/fellowshipRegistrationController.js";
import {createSetupIntent, submitFellowshipApplication, chargeApprovedApplication, getApplicationForPayment} from "../Controllers/paymentController.js";

import { addNewFellowship, getAllPastFellowships, getFellowshipRegistrationCounts, getAllFutureFellowships, updateFellowship, deleteFellowship } from "../Controllers/fellowshipController.js";
import { addNewWorkgroup, getWorkgroups, editWorkgroup, deleteWorkgroup } from "../Controllers/workgroupController.js";

// NEW ROUTES (for new flow with saved payment methods)
fellowshipRouter.post("/registration/create-setup-intent", createSetupIntent);
fellowshipRouter.post("/registration/submitFellowshipApplication", submitFellowshipApplication);
fellowshipRouter.post("/registration/charge-approved-application", chargeApprovedApplication);
fellowshipRouter.get("/registration/application/:applicationId", getApplicationForPayment);

// ADD THESE NEW ROUTES
fellowshipRouter.get("/registration/all-applications", fellowshipRegistrationController.getAllApplications);
fellowshipRouter.patch("/registration/approve/:id", fellowshipRegistrationController.approveApplication);
fellowshipRouter.patch("/registration/reject/:id", fellowshipRegistrationController.rejectApplication);

// REMOVE OR COMMENT OUT THESE OLD ROUTES (no longer needed)
// fellowshipRouter.post("/registration/create-payment-intent", createPaymentIntent);
// fellowshipRouter.post("/registration/verifypayment", verifyPaymentAndRegister);

/* Routes for admins to add new fellowships */
fellowshipRouter.post("/addNewFellowship", addNewFellowship);
fellowshipRouter.post("/addNewWorkgroup", addNewWorkgroup);
fellowshipRouter.get("/getWorkgroups", getWorkgroups);

/* Route for admin to edit and delete fellowships */
fellowshipRouter.patch("/update/:id", updateFellowship);
fellowshipRouter.delete("/delete/:id", deleteFellowship);

/* Routes for admins to edit and delete workgroups */
fellowshipRouter.patch("/editWorkgroup/:id", editWorkgroup);
fellowshipRouter.delete("/deleteWorkgroup/:id", deleteWorkgroup);

/* Routes for fetching fellowships */
fellowshipRouter.get("/getAllPastFellowships", getAllPastFellowships);
fellowshipRouter.get("/getFutureFellowships", getAllFutureFellowships);

/* Route for fetching fellowship registration counts */
fellowshipRouter.get("/registrationCounts", getFellowshipRegistrationCounts);

export default fellowshipRouter;