import express from 'express';
import stripeWebhookController from '../Controllers/stripeWebhookController.js';

const webhookRouter = express.Router();

webhookRouter.post('/stripe', stripeWebhookController.handleStripeWebhook);

export default webhookRouter;