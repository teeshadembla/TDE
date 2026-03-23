import express from "express";
import registrationController from "../Controllers/registrationController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
import requirePermission from "../middleware/requirePermission.js";

const registerRouter = express.Router({mergeParams:true});


/* This router is for users to be able to register for events */
registerRouter.post("/register", authenticateToken,requirePermission("apply_events") ,registrationController.registerUser);
registerRouter.get("/isExistregistration/:eventId/:userId", registrationController.isExistRegistration);

/* This api gets all the events that the user has registered for and are upcoming */
registerRouter.get("/registrations/:userId", authenticateToken,requirePermission("apply_events") ,registrationController.getUserEvents);

/* API to unregister for an event */
registerRouter.delete("/unregister/:eventId/:userId", registrationController.unregisterUser);
registerRouter.get("/registrationCounts", registrationController.getRegistrationCounts);

export default registerRouter;