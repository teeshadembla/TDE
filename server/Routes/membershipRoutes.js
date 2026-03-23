import express from 'express';
import membershipController from '../Controllers/MembershipController.js';

const router = express.Router();

/**
 * POST /api/membership/checkout
 * Create subscription — charges saved card or redirects to Stripe Checkout
 * Body: { userId }
 */
router.post('/checkout', membershipController.createSubscriptionCheckout);

/**
 * GET /api/membership/current/:userId
 * Get user's current active membership
 */
router.get('/current/:userId', membershipController.getCurrentMembership);

/**
 * POST /api/membership/cancel
 * Cancel subscription at period end
 * Body: { userId, reason? }
 */
router.post('/cancel', membershipController.cancelSubscription);

/**
 * POST /api/membership/reactivate
 * Reactivate a canceled subscription
 * Body: { userId }
 */
router.post('/reactivate', membershipController.reactivateSubscription);

/**
 * GET /api/membership/payments/:userId
 * Get payment history
 */
router.get('/payments/:userId', membershipController.getPaymentHistory);

export default router;