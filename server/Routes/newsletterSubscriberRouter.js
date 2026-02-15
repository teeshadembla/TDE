import express from "express";
const newsletterSubscriberRouter = express.Router();

import { subscribeUserToNewsletter } from "../Controllers/newsletterController.js";

newsletterSubscriberRouter.post("/subscribe", subscribeUserToNewsletter);

export default newsletterSubscriberRouter;