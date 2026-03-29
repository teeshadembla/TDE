import express from "express";
import eventsController from "../Controllers/eventsController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
//write middlewares for authorizing add update delete only to one admin id
import eventMiddleware from "../Middlewares/eventMiddlewares.js";
import { uploadEventThumbnail } from "../utils/multerConfig.js";

const eventRouter = express.Router({mergeParams:true});

eventRouter.get("/getCurrentEvents",eventsController.getCurrentEvents );
eventRouter.post("/get-thumbnail-url", eventsController.getPresignedThumbnailUrl);
eventRouter.post("/addEvent", authenticateToken, eventMiddleware.isAdmin, uploadEventThumbnail.single("image"),eventsController.addEvents);
eventRouter.patch("/updateEvent/:eventId",authenticateToken, eventMiddleware.isAdmin,eventsController.updateEvent);
eventRouter.delete("/delete/:eventId",authenticateToken, eventMiddleware.isAdmin,eventsController.deleteEvent);
eventRouter.get("/getPastEvents", eventsController.getPastEvents);

eventRouter.get("/getEventById/:id", eventsController.getEventById);

/* Get delegates by event */
eventRouter.get("/getDelegatesByEvent/:id", eventsController.getDelegatesByEvent);

export default eventRouter;