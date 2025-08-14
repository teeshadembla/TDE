import express from "express";
const fellowshipRouter = express.Router();
import {createPaymentIntent, verifyPaymentAndRegister} from "../Controllers/paymentController.js";
import { addNewFellowship, getAllPastFellowships, getFellowshipRegistrationCounts } from "../Controllers/fellowshipController.js";
import { addNewWorkgroup, getWorkgroups } from "../Controllers/workgroupController.js";

fellowshipRouter.post("/registration/create-payment-intent", createPaymentIntent);
fellowshipRouter.post("/registration/verifypayment", verifyPaymentAndRegister);

/* Routes for admins to add new fellowships */
fellowshipRouter.post("/addNewFellowship", addNewFellowship);
fellowshipRouter.post("/addNewWorkgroup", addNewWorkgroup);
fellowshipRouter.get("/getWorkgroups", getWorkgroups);

/* Routes for fetching fellowships */
fellowshipRouter.get("/getAllPastFellowships", getAllPastFellowships);

/* Route for fetching fellowship registration counts */
fellowshipRouter.get("/registrationCounts", getFellowshipRegistrationCounts);

export default fellowshipRouter;