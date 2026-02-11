import Stripe from "stripe";
import dotenv from "dotenv";
import membershipModel from "../Models/membershipModel.js";
import organizationModel from "../Models/organizationModel.js";
import paymentHistoryModel from "../Models/paymentHistroyModel.js";
import userModel from "../Models/userModel.js";
import logger from "../utils/logger.js";
/* import { sendEmail, paymentSuccessTemplate, paymentFailedTemplate, subscriptionCanceledTemplate, upcomingRenewalTemplate } from "../utils/NewEmail/index.js";
 */
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Main webhook handler
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    logger.error({ errorMsg: err.message }, "Webhook signature verification failed");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  logger.info({ eventType: event.type, eventId: event.id }, "Stripe webhook received");

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'invoice.upcoming':
        await handleUpcomingInvoice(event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object);
        break;

      default:
        logger.info({ eventType: event.type }, "Unhandled webhook event type");
    }

    res.status(200).json({ received: true });

  } catch (err) {
    logger.error({ 
      eventType: event.type, 
      eventId: event.id, 
      errorMsg: err.message, 
      stack: err.stack 
    }, "Error processing webhook");
    
    res.status(500).json({ 
      error: "Webhook processing failed",
      message: err.message 
    });
  }
};

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session) {
  logger.info({ sessionId: session.id }, "Processing checkout.session.completed");

  if (session.mode !== 'subscription') {
    return;
  }

  const userId = session.metadata.userId;
  const tier = session.metadata.tier;
  const organizationId = session.metadata.organizationId;

  // Subscription will be created in customer.subscription.created event
  logger.info({ userId, tier, sessionId: session.id }, "Checkout completed successfully");
}

/**
 * Handle subscription creation
 */
async function handleSubscriptionCreated(subscription) {
  logger.info({ subscriptionId: subscription.id }, "Processing customer.subscription.created");

  const userId = subscription.metadata.userId;
  const tier = subscription.metadata.tier;
  const organizationId = subscription.metadata.organizationId;

  if (!userId || !tier) {
    logger.error({ subscriptionId: subscription.id }, "Missing metadata in subscription");
    return;
  }

  const user = await userModel.findById(userId);
  if (!user) {
    logger.error({ userId }, "User not found for subscription");
    return;
  }

  // Get price and product details
  const price = await stripe.prices.retrieve(subscription.items.data[0].price.id, {
    expand: ['product']
  });

  // Create membership record
  const membership = await membershipModel.create({
    user: userId,
    organization: organizationId || null,
    tier: tier,
    status: subscription.status,
    stripeSubscriptionId: subscription.id,
    stripePriceId: price.id,
    stripeProductId: price.product.id,
    stripeCustomerId: subscription.customer,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    metadata: subscription.metadata
  });

  // Update user's active membership
  user.activeMembership = membership._id;
  await user.save();

  // If organizational, link to organization
  if (organizationId) {
    const organization = await organizationModel.findById(organizationId);
    if (organization) {
      organization.membership = membership._id;
      await organization.save();
    }
  }

  logger.info({ 
    userId, 
    membershipId: membership._id, 
    tier 
  }, "Membership created successfully");

  // Send welcome email
  
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription) {
  logger.info({ subscriptionId: subscription.id }, "Processing customer.subscription.updated");

  const membership = await membershipModel.findOne({ 
    stripeSubscriptionId: subscription.id 
  });

  if (!membership) {
    logger.error({ subscriptionId: subscription.id }, "Membership not found for subscription update");
    return;
  }

  // Update membership status and dates
  membership.status = subscription.status;
  membership.currentPeriodStart = new Date(subscription.current_period_start * 1000);
  membership.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  membership.cancelAtPeriodEnd = subscription.cancel_at_period_end;

  if (subscription.canceled_at) {
    membership.canceledAt = new Date(subscription.canceled_at * 1000);
  }

  if (subscription.ended_at) {
    membership.endedAt = new Date(subscription.ended_at * 1000);
  }

  await membership.save();

  // Update user's active membership if subscription is no longer active
  if (!['active', 'trialing'].includes(subscription.status)) {
    const user = await userModel.findById(membership.user);
    if (user && user.activeMembership?.toString() === membership._id.toString()) {
      user.activeMembership = null;
      await user.save();
    }
  }

  logger.info({ 
    membershipId: membership._id, 
    status: subscription.status 
  }, "Membership updated");
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription) {
  logger.info({ subscriptionId: subscription.id }, "Processing customer.subscription.deleted");

  const membership = await membershipModel.findOne({ 
    stripeSubscriptionId: subscription.id 
  }).populate('user');

  if (!membership) {
    logger.error({ subscriptionId: subscription.id }, "Membership not found for deletion");
    return;
  }

  // Update membership
  membership.status = 'canceled';
  membership.endedAt = new Date();
  await membership.save();

  // Remove active membership from user
  const user = await userModel.findById(membership.user);
  if (user) {
    user.activeMembership = null;
    await user.save();

    // Send cancellation confirmation email
    
  }

  // If organizational, update organization
  if (membership.organization) {
    const organization = await organizationModel.findById(membership.organization);
    if (organization) {
      organization.membership = null;
      organization.status = 'inactive';
      await organization.save();
    }
  }

  logger.info({ membershipId: membership._id }, "Subscription canceled and membership deactivated");
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaid(invoice) {
  logger.info({ invoiceId: invoice.id }, "Processing invoice.paid");

  if (!invoice.subscription) {
    return; // Not a subscription invoice
  }

  const membership = await membershipModel.findOne({ 
    stripeSubscriptionId: invoice.subscription 
  });

  if (!membership) {
    logger.error({ subscriptionId: invoice.subscription }, 
      "Membership not found for invoice");
    return;
  }

  // Extract payment method details
  let paymentMethodDetails = {};
  if (invoice.charge) {
    const charge = await stripe.charges.retrieve(invoice.charge);
    paymentMethodDetails = {
      type: charge.payment_method_details.type,
      brand: charge.payment_method_details.card?.brand,
      last4: charge.payment_method_details.card?.last4,
      expMonth: charge.payment_method_details.card?.exp_month,
      expYear: charge.payment_method_details.card?.exp_year
    };
  }

  // Record payment in history
  await paymentHistoryModel.create({
    user: membership.user,
    membership: membership._id,
    organization: membership.organization,
    stripeInvoiceId: invoice.id,
    stripePaymentIntentId: invoice.payment_intent,
    stripeChargeId: invoice.charge,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'paid',
    paymentMethod: paymentMethodDetails,
    invoiceNumber: invoice.number,
    invoicePdf: invoice.invoice_pdf,
    billingPeriod: {
      start: new Date(invoice.period_start * 1000),
      end: new Date(invoice.period_end * 1000)
    },
    paidAt: new Date(invoice.status_transitions.paid_at * 1000),
    description: invoice.description || `${membership.tier} membership payment`
  });

  logger.info({ 
    invoiceId: invoice.id, 
    membershipId: membership._id,
    amount: invoice.amount_paid / 100 
  }, "Payment recorded successfully");
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice) {
  logger.info({ invoiceId: invoice.id }, "Processing invoice.payment_failed");

  if (!invoice.subscription) {
    return;
  }

  const membership = await membershipModel.findOne({ 
    stripeSubscriptionId: invoice.subscription 
  }).populate('user');

  if (!membership) {
    logger.error({ subscriptionId: invoice.subscription }, 
      "Membership not found for failed payment");
    return;
  }

  // Update membership status
  membership.status = 'past_due';
  await membership.save();

  // Record failed payment
  await paymentHistoryModel.create({
    user: membership.user._id,
    membership: membership._id,
    organization: membership.organization,
    stripeInvoiceId: invoice.id,
    stripePaymentIntentId: invoice.payment_intent,
    amount: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed',
    attemptedAt: new Date(),
    description: `Failed payment for ${membership.tier} membership`
  });

  // Send payment failed email
  const user = membership.user;
  /* sendEmail({
    to: user.email,
    ...paymentFailedTemplate({
      userName: user.FullName,
      tier: membership.tier,
      amount: invoice.amount_due / 100,
      invoiceUrl: invoice.hosted_invoice_url
    })
  }).catch(err => 
    logger.error({ userId: user._id, errorMsg: err.message }, 
      "Payment failed email error")
  ); */

  logger.warn({ 
    invoiceId: invoice.id, 
    membershipId: membership._id 
  }, "Payment failed, user notified");
}

/**
 * Handle upcoming invoice (send reminder 1 day before renewal)
 */
async function handleUpcomingInvoice(invoice) {
  logger.info({ invoiceId: invoice.id }, "Processing invoice.upcoming");

  if (!invoice.subscription) {
    return;
  }

  const membership = await membershipModel.findOne({ 
    stripeSubscriptionId: invoice.subscription 
  }).populate('user');

  if (!membership) {
    return;
  }

  // Send renewal reminder (1 day before)
  const user = membership.user;
  /* sendEmail({
    to: user.email,
    ...upcomingRenewalTemplate({
      userName: user.FullName,
      tier: membership.tier,
      amount: invoice.amount_due / 100,
      renewalDate: new Date(invoice.period_end * 1000),
      manageUrl: `${process.env.FRONTEND_URL}/membership/manage`
    })
  }).catch(err => 
    logger.error({ userId: user._id, errorMsg: err.message }, 
      "Renewal reminder email failed")
  ); */

  logger.info({ 
    membershipId: membership._id 
  }, "Renewal reminder sent");
}

/**
 * Handle trial ending soon
 */
async function handleTrialWillEnd(subscription) {
  logger.info({ subscriptionId: subscription.id }, "Processing trial_will_end");

  const membership = await membershipModel.findOne({ 
    stripeSubscriptionId: subscription.id 
  }).populate('user');

  if (!membership) {
    return;
  }

  // Send trial ending notification
  const user = membership.user;
  /* sendEmail({
    to: user.email,
    subject: "Your trial is ending soon",
    text: `Your ${membership.tier} trial will end on ${membership.trialEnd}. Your payment method will be charged automatically.`
  }).catch(err => 
    logger.error({ userId: user._id, errorMsg: err.message }, 
      "Trial ending email failed")
  ); */
}

export default {
  handleStripeWebhook
};