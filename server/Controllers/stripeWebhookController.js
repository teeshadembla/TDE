import Stripe from 'stripe';
import dotenv from 'dotenv';
import membershipModel from '../Models/membershipModel.js';
import userModel from '../Models/userModel.js';
import logger from '../utils/logger.js';
import {
  sendWelcomeEmail,
  sendRenewalReminderEmail,
  sendCancellationEmail,
  sendPaymentFailedEmail,
} from "../utils/SendGrid/htmlTemplateForMembership.js"

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error({ errorMsg: err.message }, 'Webhook signature verification failed');
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  logger.info({ eventType: event.type }, 'Stripe webhook received');

  try {
    switch (event.type) {

      // ── Stripe Checkout completed (Flow 2 — no saved card) ──
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode !== 'subscription') break;

        const userId         = session.metadata?.userId;
        const subscriptionId = session.subscription;

        if (!userId || !subscriptionId) {
          logger.warn({ sessionId: session.id }, 'checkout.session.completed missing userId or subscriptionId');
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        // Avoid duplicate
        const existing = await membershipModel.findOne({ stripeSubscriptionId: subscriptionId });
        if (existing) {
          logger.info({ subscriptionId }, 'Membership already exists, skipping creation');
          break;
        }

        const membership = await membershipModel.create({
          user:                 userId,
          status:               subscription.status,
          stripeSubscriptionId: subscription.id,
          stripePriceId:        subscription.items.data[0].price.id,
          stripeProductId:      subscription.items.data[0].price.product,
          stripeCustomerId:     subscription.customer,
          currentPeriodStart:   new Date(subscription.current_period_start * 1000),
          currentPeriodEnd:     new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd:    subscription.cancel_at_period_end,
        });

        const user = await userModel.findByIdAndUpdate(
          userId,
          { activeMembership: membership._id, stripeCustomerId: subscription.customer },
          { new: true }
        );

        // Send welcome email
        if (user) {
          await sendWelcomeEmail({
            to:   user.email,
            name: user.FullName,
          });
        }

        logger.info({ userId, membershipId: membership._id }, 'Membership created via checkout webhook');
        break;
      }

      // ── Subscription updated (renewals, cancellation toggle) ──
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const prevAttributes = event.data.previous_attributes;

        const membership = await membershipModel.findOne({
          stripeSubscriptionId: subscription.id,
        });

        if (!membership) {
          logger.warn({ subscriptionId: subscription.id }, 'subscription.updated — no matching membership found');
          break;
        }

        const wasCancelling = membership.cancelAtPeriodEnd;

        membership.status             = subscription.status;
        membership.currentPeriodStart = new Date(subscription.current_period_start * 1000);
        membership.currentPeriodEnd   = new Date(subscription.current_period_end * 1000);
        membership.cancelAtPeriodEnd  = subscription.cancel_at_period_end;

        if (subscription.cancel_at_period_end && !membership.canceledAt) {
          membership.canceledAt = new Date();
        }
        if (!subscription.cancel_at_period_end) {
          membership.canceledAt   = null;
          membership.cancelReason = null;
        }

        await membership.save();

        const user = await userModel.findById(membership.user);

        // Send cancellation email when cancelAtPeriodEnd is first set to true
        if (
          user &&
          subscription.cancel_at_period_end &&
          !wasCancelling
        ) {
          await sendCancellationEmail({
            to:          user.email,
            name:        user.FullName,
            accessUntil: new Date(subscription.current_period_end * 1000)
              .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          });
        }

        logger.info({ subscriptionId: subscription.id }, 'Membership updated via webhook');
        break;
      }

      // ── Subscription deleted (fully canceled/expired) ──
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        const membership = await membershipModel.findOne({
          stripeSubscriptionId: subscription.id,
        });

        if (!membership) {
          logger.warn({ subscriptionId: subscription.id }, 'subscription.deleted — no matching membership found');
          break;
        }

        membership.status  = 'canceled';
        membership.endedAt = new Date();
        await membership.save();

        await userModel.findByIdAndUpdate(membership.user, { activeMembership: null });

        logger.info({ subscriptionId: subscription.id }, 'Membership canceled via webhook');
        break;
      }

      // ── Invoice upcoming — renewal reminder 1 day before ──
      case 'invoice.upcoming': {
        const invoice        = event.data.object;
        const subscriptionId = invoice.subscription;
        const customerId     = invoice.customer;

        if (!subscriptionId) break;

        // Check renewal is within ~1 day (Stripe fires this ~7 days before by default)
        const renewalDate   = new Date(invoice.period_end * 1000);
        const now           = new Date();
        const hoursUntilRenewal = (renewalDate - now) / (1000 * 60 * 60);

        if (hoursUntilRenewal > 30) {
          // Not within our 1-day window yet, ignore
          logger.info({ subscriptionId }, 'invoice.upcoming received but renewal is not within 1 day, skipping');
          break;
        }

        const membership = await membershipModel.findOne({
          stripeSubscriptionId: subscriptionId,
        });

        if (!membership) break;

        const user = await userModel.findById(membership.user);
        if (!user) break;

        await sendRenewalReminderEmail({
          to:          user.email,
          name:        user.FullName,
          renewalDate: renewalDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          }),
          amount: (invoice.amount_due / 100).toFixed(2),
        });

        logger.info({ subscriptionId }, 'Renewal reminder email sent via webhook');
        break;
      }

      // ── Payment failed ──
      case 'invoice.payment_failed': {
        const invoice        = event.data.object;
        const subscriptionId = invoice.subscription;

        if (!subscriptionId) break;

        const membership = await membershipModel.findOne({
          stripeSubscriptionId: subscriptionId,
        });

        if (!membership) {
          logger.warn({ subscriptionId }, 'invoice.payment_failed — no matching membership found');
          break;
        }

        membership.status = 'past_due';
        await membership.save();

        const user = await userModel.findById(membership.user);
        if (user) {
          await sendPaymentFailedEmail({
            to:   user.email,
            name: user.FullName,
          });
        }

        logger.info({ subscriptionId }, 'Membership marked past_due and payment failed email sent');
        break;
      }

      default:
        logger.info({ eventType: event.type }, 'Unhandled webhook event type');
    }

    res.status(200).json({ received: true });

  } catch (err) {
    logger.error({ eventType: event.type, errorMsg: err.message, stack: err.stack },
      'Error processing webhook event');
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

export default { handleStripeWebhook };