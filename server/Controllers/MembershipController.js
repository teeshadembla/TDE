import membershipModel from "../Models/membershipModel.js";
import paymentHistoryModel from "../Models/paymentHistroyModel.js";
import userModel from "../Models/userModel.js";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import { sendWelcomeEmail } from "../utils/SendGrid/htmlTemplateForMembership.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});


/**
 * Create a subscription checkout session
 */
export const createSubscriptionCheckout = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Block if already subscribed
    const existingMembership = await membershipModel.findOne({
      user: userId,
      status: { $in: ['active', 'trialing'] }
    });
    if (existingMembership) {
      return res.status(400).json({ message: "You already have an active membership." });
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.FullName,
        metadata: { userId: user._id.toString() }
      });
      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // ── FLOW 1: User has a saved card from fellowship application ──
    if (user.stripePaymentMethodId) {
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: process.env.STRIPE_MEMBERSHIP_PRICE_ID }],
        default_payment_method: user.stripePaymentMethodId,
        payment_behavior: 'error_if_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: { userId: user._id.toString() },
      });

      if (subscription.status !== 'active') {
        return res.status(402).json({
          message: `Payment failed — card may have been declined.`
        });
      }

      // Create membership document
      const membership = await membershipModel.create({
        user:                 user._id,
        status:               subscription.status,
        stripeSubscriptionId: subscription.id,
        stripePriceId:        subscription.items.data[0].price.id,
        stripeProductId:      subscription.items.data[0].price.product,
        stripeCustomerId:     stripeCustomerId,
        currentPeriodStart:   new Date(subscription.current_period_start * 1000),
        currentPeriodEnd:     new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd:    false,
      });

      // Link to user
      user.activeMembership = membership._id;
      await user.save();

      await sendWelcomeEmail({
        to:   user.email,
        name: user.FullName,
      });

      logger.info({ userId, membershipId: membership._id }, "Membership created via saved card");

      return res.status(200).json({
        success: true,
        savedCard: true,
        redirectUrl: `${process.env.FRONTEND_URL}/membership/success?direct=true`,
      });
    }

    // ── FLOW 2: No saved card — redirect to Stripe Checkout ──
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_MEMBERSHIP_PRICE_ID, quantity: 1 }],
      subscription_data: {
        metadata: { userId: user._id.toString() }
      },
      success_url: `/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.FRONTEND_URL}/join-us/pricing`,
      metadata: { userId: user._id.toString() }
    });

    logger.info({ userId, sessionId: session.id }, "Checkout session created");
    return res.status(200).json({ success: true, savedCard: false, url: session.url });

  } catch (err) {
    if (err.type === 'StripeCardError') {
      return res.status(402).json({ message: `Card declined: ${err.message}` });
    }
    logger.error({ userId: req.body.userId, errorMsg: err.message, stack: err.stack },
      "Error creating checkout session");
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

/**
 * Get user's current membership
 */
export const getCurrentMembership = async (req, res) => {
  const { userId } = req.params;

  try {
    const membership = await membershipModel
      .findOne({ 
        user: userId,
        status: { $in: ['active', 'trialing', 'past_due'] }
      })
      .populate('organization')
      .sort({ createdAt: -1 });

    if (!membership) {
      return res.status(200).json({
        success: true,
        hasMembership: false,
        membership: null
      });
    }

    const price = await stripe.prices.retrieve(membership.stripePriceId, {
      expand: ['product']
    });

    res.status(200).json({
      success: true,
      hasMembership: true,
      membership: {
        id: membership._id,
        tier: membership.tier,
        status: membership.status,
        currentPeriodStart: membership.currentPeriodStart,
        currentPeriodEnd: membership.currentPeriodEnd,
        cancelAtPeriodEnd: membership.cancelAtPeriodEnd,
        amount: price.unit_amount / 100,
        currency: price.currency,
        organization: membership.organization,
        hasPublicationAccess: membership.hasPublicationAccess()
      }
    });

  } catch (err) {
    logger.error({ userId: req.params.userId, errorMsg: err.message, stack: err.stack }, 
      "Error fetching current membership");
    res.status(500).json({ message: "Failed to fetch membership" });
  }
};


/**
 * Cancel subscription (at end of period)
 */
export const cancelSubscription = async (req, res) => {
  const { userId, reason } = req.body;

  try {
    const membership = await membershipModel.findOne({
      user: userId,
      status: { $in: ['active', 'trialing'] }
    });

    if (!membership) {
      return res.status(404).json({ message: "No active membership found" });
    }

    // Cancel at period end in Stripe
    const subscription = await stripe.subscriptions.update(
      membership.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
        metadata: {
          cancelReason: reason || 'User requested',
          canceledAt: new Date().toISOString()
        }
      }
    );

    // Update membership
    membership.cancelAtPeriodEnd = true;
    membership.canceledAt = new Date();
    membership.cancelReason = reason;
    await membership.save();

    logger.info({ userId, membershipId: membership._id }, "Subscription canceled");

    res.status(200).json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
      accessUntil: membership.currentPeriodEnd
    });

  } catch (err) {
    logger.error({ userId: req.body.userId, errorMsg: err.message, stack: err.stack }, 
      "Error canceling subscription");
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
};

/**
 * Reactivate canceled subscription
 */
export const reactivateSubscription = async (req, res) => {
  const { userId } = req.body;

  try {
    const membership = await membershipModel.findOne({
      user: userId,
      status: { $in: ['active', 'trialing'] },
      cancelAtPeriodEnd: true
    });

    if (!membership) {
      return res.status(404).json({ 
        message: "No canceled subscription found to reactivate" 
      });
    }

    // Remove cancel_at_period_end in Stripe
    await stripe.subscriptions.update(
      membership.stripeSubscriptionId,
      {
        cancel_at_period_end: false
      }
    );

    // Update membership
    membership.cancelAtPeriodEnd = false;
    membership.canceledAt = null;
    membership.cancelReason = null;
    await membership.save();

    logger.info({ userId, membershipId: membership._id }, "Subscription reactivated");

    res.status(200).json({
      success: true,
      message: "Subscription reactivated successfully"
    });

  } catch (err) {
    logger.error({ userId: req.body.userId, errorMsg: err.message, stack: err.stack }, 
      "Error reactivating subscription");
    res.status(500).json({ message: "Failed to reactivate subscription" });
  }
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (req, res) => {
  const { userId } = req.params;
  const { limit = 10, page = 1 } = req.query;

  try {
    const skip = (page - 1) * limit;

    const payments = await paymentHistoryModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('membership', 'tier');

    const total = await paymentHistoryModel.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      payments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    logger.error({ userId: req.params.userId, errorMsg: err.message, stack: err.stack }, 
      "Error fetching payment history");
    res.status(500).json({ message: "Failed to fetch payment history" });
  }
};

/**
 * Get invoice PDF URL
 */
export const getInvoice = async (req, res) => {
  const { invoiceId } = req.params;

  try {
    const payment = await paymentHistoryModel.findOne({ 
      stripeInvoiceId: invoiceId 
    });

    if (!payment) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Fetch invoice from Stripe
    const invoice = await stripe.invoices.retrieve(invoiceId);

    res.status(200).json({
      success: true,
      invoiceUrl: invoice.invoice_pdf,
      hostedUrl: invoice.hosted_invoice_url
    });

  } catch (err) {
    logger.error({ invoiceId: req.params.invoiceId, errorMsg: err.message, stack: err.stack }, 
      "Error fetching invoice");
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
};

/**
 * Save paymentMethodId to user after SetupIntent confirmation
 */
export const confirmSetupIntent = async (req, res) => {
  const { userId, paymentMethodId } = req.body;

  try {
    if (!userId || !paymentMethodId) {
      return res.status(400).json({ message: "userId and paymentMethodId are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the payment method actually exists in Stripe and belongs to this customer
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (paymentMethod.customer !== user.stripeCustomerId) {
      return res.status(400).json({ message: "Payment method does not belong to this customer" });
    }

    // Set as default payment method on the Stripe customer
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });

    // Save to user record
    user.stripePaymentMethodId = paymentMethodId;
    await user.save();

    logger.info({ userId }, "Payment method saved to user");
    res.status(200).json({ success: true, message: "Payment method saved" });

  } catch (err) {
    logger.error({ userId: req.body.userId, errorMsg: err.message, stack: err.stack },
      "Error confirming setup intent");
    res.status(500).json({ message: "Failed to save payment method" });
  }
};

export default {
  createSubscriptionCheckout,
  getCurrentMembership,
  cancelSubscription,
  reactivateSubscription,
  getPaymentHistory,
  getInvoice,
  confirmSetupIntent
};