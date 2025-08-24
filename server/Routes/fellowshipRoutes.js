import express from "express";
const fellowshipRouter = express.Router();
import {createPaymentIntent, verifyPaymentAndRegister} from "../Controllers/paymentController.js";
import { addNewFellowship, getAllPastFellowships, getFellowshipRegistrationCounts, getAllFutureFellowships, updateFellowship, deleteFellowship } from "../Controllers/fellowshipController.js";
import { addNewWorkgroup, getWorkgroups, editWorkgroup, deleteWorkgroup } from "../Controllers/workgroupController.js";

fellowshipRouter.post("/registration/create-payment-intent", createPaymentIntent);
fellowshipRouter.post("/registration/verifypayment", verifyPaymentAndRegister);

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