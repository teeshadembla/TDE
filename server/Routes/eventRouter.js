import express from "express";
import eventsController from "../Controllers/eventsController.js";
import authenticateToken from "../Controllers/tokenControllers.js";
//write middlewares for authorizing add update delete only to one admin id
import eventMiddleware from "../Middlewares/eventMiddlewares.js";

const eventRouter = express.Router({mergeParams: true});

eventRouter.get("/getCurrentEvents",eventsController.getCurrentEvents );
eventRouter.post("/addEvent", authenticateToken, eventMiddleware.isAdmin, eventsController.addEvents);
eventRouter.patch("/updateEvent/:eventId",authenticateToken, eventMiddleware.isAdmin,eventsController.updateEvent);
eventRouter.delete("/delete/:eventId",authenticateToken, eventMiddleware.isAdmin,eventsController.deleteEvent);
eventRouter.get("/getPastEvents", eventsController.getPastEvents);

export default eventRouter;