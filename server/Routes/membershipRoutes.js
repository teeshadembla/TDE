import express from 'express';
import membershipController from '../Controllers/MembershipController.js';
import organizationController from '../Controllers/organizationController.js';
import stripeWebhookController from '../Controllers/stripeWebhookController.js';
/* import authenticateToken from '../Middleware/authMiddleware.js';
 */import { requireOrganizationAdmin } from '../Middlewares/membershipMiddleware.js';

const router = express.Router();

// ============= MEMBERSHIP ROUTES =============

/**
 * GET /api/membership/plans
 * Get all available membership plans
 * Public route
 */
router.get('/plans', membershipController.getMembershipPlans);

/**
 * POST /api/membership/checkout
 * Create a checkout session for new subscription
 * Body: { userId, tier, organizationId? }
 */
router.post('/checkout', membershipController.createSubscriptionCheckout);

/**
 * GET /api/membership/current/:userId
 * Get user's current active membership
 */
router.get('/current/:userId', membershipController.getCurrentMembership);

/**
 * POST /api/membership/update
 * Upgrade or downgrade subscription
 * Body: { userId, newTier }
 */
router.post('/update', membershipController.updateSubscription);

/**
 * POST /api/membership/cancel
 * Cancel subscription (at end of period)
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
 * Get payment history for user
 * Query: ?limit=10&page=1
 */
router.get('/payments/:userId', membershipController.getPaymentHistory);

/**
 * GET /api/membership/invoice/:invoiceId
 * Get invoice PDF URL
 */
router.get('/invoice/:invoiceId', membershipController.getInvoice);

// ============= ORGANIZATION ROUTES =============

/**
 * POST /api/organization/create
 * Create new organization
 * Body: { userId, name, billingEmail }
 */
router.post('/create', organizationController.createOrganization);

/**
 * GET /api/organization/:organizationId
 * Get organization details
 */
router.get('/:organizationId', organizationController.getOrganization);

/**
 * POST /api/organization/add-member
 * Add member to organization
 * Body: { organizationId, memberEmail, addedByUserId }
 */
router.post(
  '/add-member', 
  organizationController.addMember
);

/**
 * POST /api/organization/remove-member
 * Remove member from organization
 * Body: { organizationId, memberUserId, removedByUserId }
 */
router.post(
  '/remove-member', 
  requireOrganizationAdmin,
  organizationController.removeMember
);

/**
 * POST /api/organization/update-role
 * Update member's role
 * Body: { organizationId, memberUserId, newRole, updatedByUserId }
 */
router.post(
  '/update-role', 
  organizationController.updateMemberRole
);

/**
 * POST /api/organization/leave
 * Leave organization (for non-owner members)
 * Body: { userId, organizationId }
 */
router.post('/leave',organizationController.leaveOrganization);

// ============= STRIPE WEBHOOK =============

/**
 * POST /api/webhook/stripe
 * Stripe webhook endpoint
 * IMPORTANT: This route should NOT use bodyParser.json()
 * Use express.raw({ type: 'application/json' }) instead
 */
router.post('/stripe', stripeWebhookController.handleStripeWebhook);

export default router;