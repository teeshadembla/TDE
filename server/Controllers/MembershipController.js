import membershipModel from "../Models/membershipModel.js";
import organizationModel from "../Models/organizationModel.js";
import paymentHistoryModel from "../Models/paymentHistroyModel.js";
import userModel from "../Models/userModel.js";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Stripe Price IDs - Store these in environment variables
const STRIPE_PRICES = {
  premium: process.env.STRIPE_PREMIUM_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  organizational: process.env.STRIPE_ORG_PRICE_ID,
};

/**
 * Get available membership plans from Stripe
 */
export const getMembershipPlans = async (req, res) => {
  try {
    const plans = await Promise.all([
      stripe.prices.retrieve(STRIPE_PRICES.premium, { expand: ['product'] }),
      stripe.prices.retrieve(STRIPE_PRICES.pro, { expand: ['product'] }),
      stripe.prices.retrieve(STRIPE_PRICES.organizational, { expand: ['product'] })
    ]);

    const formattedPlans = plans.map(price => ({
      id: price.id,
      productId: price.product.id,
      name: price.product.name,
      description: price.product.description,
      amount: price.unit_amount / 100,
      currency: price.currency,
      interval: price.recurring.interval,
      tier: price.product.metadata.tier
    }));

    res.status(200).json({
      success: true,
      plans: formattedPlans
    });

  } catch (err) {
    logger.error({ errorMsg: err.message, stack: err.stack }, "Error fetching membership plans");
    res.status(500).json({ message: "Failed to fetch membership plans" });
  }
};

/**
 * Create a subscription checkout session
 */
export const createSubscriptionCheckout = async (req, res) => {
  const { userId, tier, organizationId } = req.body;

  try {
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has an active membership
    const existingMembership = await membershipModel.findOne({
      user: userId,
      status: { $in: ['active', 'trialing'] }
    });

    if (existingMembership) {
      return res.status(400).json({ 
        message: "User already has an active membership. Please cancel or upgrade instead." 
      });
    }

    // Validate tier
    if (!['premium', 'pro', 'organizational'].includes(tier)) {
      return res.status(400).json({ message: "Invalid membership tier" });
    }

    // For organizational tier, validate organization
    if (tier === 'organizational') {
      if (!organizationId) {
        return res.status(400).json({ 
          message: "Organization ID required for organizational membership" 
        });
      }

      const organization = await organizationModel.findById(organizationId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      if (organization.owner.toString() !== userId.toString()) {
        return res.status(403).json({ 
          message: "Only organization owner can purchase membership" 
        });
      }
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.FullName,
        metadata: {
          userId: user._id.toString(),
          tier: tier
        }
      });
      stripeCustomerId = customer.id;
      
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICES[tier],
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId: user._id.toString(),
          tier: tier,
          ...(organizationId && { organizationId: organizationId.toString() })
        },
      },
      success_url: `${process.env.FRONTEND_URL}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/membership/plans`,
      metadata: {
        userId: user._id.toString(),
        tier: tier,
        ...(organizationId && { organizationId: organizationId.toString() })
      }
    });

    logger.info({ userId, tier, sessionId: session.id }, "Checkout session created");

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (err) {
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
 * Upgrade/Downgrade subscription (immediate change with prorated billing)
 */
export const updateSubscription = async (req, res) => {
  const { userId, newTier } = req.body;

  try {
    const membership = await membershipModel.findOne({
      user: userId,
      status: { $in: ['active', 'trialing'] }
    });

    if (!membership) {
      return res.status(404).json({ message: "No active membership found" });
    }

    if (membership.tier === newTier) {
      return res.status(400).json({ message: "Already on this tier" });
    }

    // Validate new tier
    if (!['premium', 'pro', 'organizational'].includes(newTier)) {
      return res.status(400).json({ message: "Invalid membership tier" });
    }

    // Update subscription in Stripe (immediate proration)
    const subscription = await stripe.subscriptions.retrieve(membership.stripeSubscriptionId);
    
    const updatedSubscription = await stripe.subscriptions.update(
      membership.stripeSubscriptionId,
      {
        items: [{
          id: subscription.items.data[0].id,
          price: STRIPE_PRICES[newTier],
        }],
        proration_behavior: 'always_invoice', // Immediate charge/refund
        metadata: {
          ...subscription.metadata,
          tier: newTier,
          upgradedAt: new Date().toISOString()
        }
      }
    );

    // Update membership in database
    const price = await stripe.prices.retrieve(STRIPE_PRICES[newTier]);
    
    membership.tier = newTier;
    membership.stripePriceId = STRIPE_PRICES[newTier];
    membership.stripeProductId = price.product;
    membership.currentPeriodStart = new Date(updatedSubscription.current_period_start * 1000);
    membership.currentPeriodEnd = new Date(updatedSubscription.current_period_end * 1000);
    
    await membership.save();

    logger.info({ userId, oldTier: membership.tier, newTier }, "Subscription updated");

    res.status(200).json({
      success: true,
      message: `Successfully ${newTier > membership.tier ? 'upgraded' : 'downgraded'} to ${newTier}`,
      membership: {
        tier: membership.tier,
        currentPeriodEnd: membership.currentPeriodEnd
      }
    });

  } catch (err) {
    logger.error({ userId: req.body.userId, errorMsg: err.message, stack: err.stack }, 
      "Error updating subscription");
    res.status(500).json({ message: "Failed to update subscription" });
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

export default {
  getMembershipPlans,
  createSubscriptionCheckout,
  getCurrentMembership,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription,
  getPaymentHistory,
  getInvoice
};