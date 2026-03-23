import express from "express";
const fellowshipRouter = express.Router();
import fellowshipRegistrationController from "../Controllers/fellowshipregistrationController.js";
import {createSetupIntent, submitFellowshipApplication, chargeApprovedApplication, getApplicationForPayment} from "../Controllers/paymentController.js";

import { addNewFellowship, getAllPastFellowships, getFellowshipRegistrationCounts, getAllFutureFellowships, updateFellowship, deleteFellowship } from "../Controllers/fellowshipController.js";
import { addNewWorkgroup, getWorkgroups, editWorkgroup, deleteWorkgroup, getWorkgroupById , getWorkgroupMembers, getWorkgroupPublications} from "../Controllers/workgroupController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
import requirePermission from "../middleware/requirePermission.js";

// NEW ROUTES (for new flow with saved payment methods)
fellowshipRouter.post("/registration/create-setup-intent",authenticateToken, requirePermission("apply_fellowship") , createSetupIntent);
fellowshipRouter.post("/registration/submitFellowshipApplication",authenticateToken, requirePermission("apply_fellowship"), submitFellowshipApplication);
fellowshipRouter.post("/registration/charge-approved-application",authenticateToken, requirePermission("moderate_applications"), chargeApprovedApplication);
fellowshipRouter.get("/registration/application/:applicationId",authenticateToken, requirePermission("apply_fellowship"), getApplicationForPayment);

// ADD THESE NEW ROUTES
fellowshipRouter.get("/registration/all-applications",authenticateToken, requirePermission("moderate_applications"), fellowshipRegistrationController.getAllApplications);
fellowshipRouter.patch("/registration/approve/:id",authenticateToken, requirePermission("moderate_applications"), fellowshipRegistrationController.approveApplication);
fellowshipRouter.patch("/registration/reject/:id", authenticateToken, requirePermission("moderate_applications"), fellowshipRegistrationController.rejectApplication);


/* Routes for admins to add new fellowships */
fellowshipRouter.post("/addNewFellowship",authenticateToken, requirePermission("manage_fellowships") ,addNewFellowship);
fellowshipRouter.post("/addNewWorkgroup",authenticateToken, requirePermission("manage_workgroups"), addNewWorkgroup);
fellowshipRouter.get("/getWorkgroups", getWorkgroups);

/* Route for admin to edit and delete fellowships */
fellowshipRouter.patch("/update/:id",authenticateToken, requirePermission("manage_fellowships") , updateFellowship);
fellowshipRouter.delete("/delete/:id",authenticateToken, requirePermission("manage_fellowships") , deleteFellowship);

/* Routes for admins to edit and delete workgroups */
fellowshipRouter.patch("/editWorkgroup/:id", authenticateToken, requirePermission("manage_workgroups"), editWorkgroup);
fellowshipRouter.delete("/deleteWorkgroup/:id",authenticateToken, requirePermission("manage_workgroups"), deleteWorkgroup);
fellowshipRouter.get("/getWorkgroupById/:id", getWorkgroupById);

/* Routes for fetching fellowships */
fellowshipRouter.get("/getAllPastFellowships", getAllPastFellowships);
fellowshipRouter.get("/getFutureFellowships", getAllFutureFellowships);

/* Route for fetching fellowship registration counts */
fellowshipRouter.get("/registrationCounts", getFellowshipRegistrationCounts);

/* Route for fetching fellow profiles */
fellowshipRouter.post("/getWorkgroupMembers", getWorkgroupMembers);
fellowshipRouter.post("/getWorkgroupPublications", getWorkgroupPublications);



export default fellowshipRouter;