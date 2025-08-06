import express from "express";
import registrationController from "../Controllers/registrationController.js";

const registerRouter = express.Router({mergeParams: true});

registerRouter.post("/register", registrationController.registerUser);
registerRouter.get("/isExistregistration/:eventId/:userId", registrationController.isExistRegistration);
registerRouter.get("/registrations/:userId", registrationController.getUserEvents);
registerRouter.delete("/unregister/:eventId/:userId", registrationController.unregisterUser);
registerRouter.get("/registrationCounts", registrationController.getRegistrationCounts);

export default registerRouter;