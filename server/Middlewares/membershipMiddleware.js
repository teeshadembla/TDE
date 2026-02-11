import membershipModel from "../Models/membershipModel.js";
import organizationModel from "../Models/organizationModel.js";
import userModel from "../Models/userModel.js";
import logger from "../utils/logger.js";

/**
 * Check if user has active membership (personal or organizational)
 */
export const requireMembership = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      logger.warn({}, "Membership check failed: User not authenticated");
      return res.status(401).json({
        error: "Authentication required",
        message: "Please log in to access this content"
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      logger.warn({ userId }, "Membership check failed: User not found");
      return res.status(404).json({
        error: "User not found",
        message: "User account does not exist"
      });
    }

    // Check for personal membership
    let hasAccess = false;
    let membershipSource = null;

    if (user.activeMembership) {
      const personalMembership = await membershipModel.findById(user.activeMembership);
      
      if (personalMembership && personalMembership.hasPublicationAccess()) {
        hasAccess = true;
        membershipSource = 'personal';
        req.membership = personalMembership;
      }
    }

    // Check for organizational membership
    if (!hasAccess && user.organization) {
      const organization = await organizationModel
        .findById(user.organization)
        .populate('membership');

      if (organization && 
          organization.membership && 
          organization.membership.hasPublicationAccess()) {
        hasAccess = true;
        membershipSource = 'organizational';
        req.membership = organization.membership;
        req.organization = organization;
      }
    }

    if (!hasAccess) {
      logger.warn({ userId }, "Membership check failed: No active membership");
      return res.status(403).json({
        error: "Membership required",
        message: "An active membership is required to access publications",
        requiresMembership: true,
        upgradeUrl: `${process.env.FRONTEND_URL}/membership/plans`
      });
    }

    // Attach membership info to request
    req.membershipSource = membershipSource;

    logger.debug({ userId, membershipSource }, "Membership check passed");
    next();

  } catch (error) {
    logger.error({ 
      userId: req.user?._id, 
      errorMsg: error.message, 
      stack: error.stack 
    }, "Membership middleware error");
    
    res.status(500).json({
      error: "Membership verification failed",
      message: error.message
    });
  }
};

/**
 * Check if user has specific membership tier or higher
 */
export const requireMembershipTier = (minTier) => {
  const tierLevels = {
    'premium': 1,
    'pro': 2,
    'organizational': 3
  };

  return async (req, res, next) => {
    try {
      // First check if user has any membership
      await requireMembership(req, res, () => {});

      if (!req.membership) {
        return; // Error already sent by requireMembership
      }

      const userTierLevel = tierLevels[req.membership.tier] || 0;
      const requiredTierLevel = tierLevels[minTier] || 999;

      if (userTierLevel < requiredTierLevel) {
        logger.warn({ 
          userId: req.user._id, 
          userTier: req.membership.tier, 
          requiredTier: minTier 
        }, "Membership tier insufficient");

        return res.status(403).json({
          error: "Upgrade required",
          message: `This feature requires a ${minTier} membership or higher`,
          currentTier: req.membership.tier,
          requiredTier: minTier,
          upgradeUrl: `${process.env.FRONTEND_URL}/membership/upgrade`
        });
      }

      logger.debug({ userId: req.user._id, tier: req.membership.tier }, 
        "Membership tier check passed");
      next();

    } catch (error) {
      logger.error({ 
        userId: req.user?._id, 
        errorMsg: error.message, 
        stack: error.stack 
      }, "Membership tier middleware error");
      
      res.status(500).json({
        error: "Membership tier verification failed",
        message: error.message
      });
    }
  };
};

/**
 * Check if user is organization owner or admin (for organization management)
 */
export const requireOrganizationAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    const organizationId = req.params.organizationId || req.body.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        error: "Bad request",
        message: "Organization ID is required"
      });
    }

    const organization = await organizationModel.findById(organizationId);

    if (!organization) {
      return res.status(404).json({
        error: "Not found",
        message: "Organization not found"
      });
    }

    if (!organization.canManage(userId)) {
      logger.warn({ userId, organizationId }, 
        "Organization admin check failed: Insufficient privileges");
      
      return res.status(403).json({
        error: "Access denied",
        message: "You must be an organization owner or admin"
      });
    }

    req.organization = organization;
    logger.debug({ userId, organizationId }, "Organization admin check passed");
    next();

  } catch (error) {
    logger.error({ 
      userId: req.user?._id, 
      errorMsg: error.message, 
      stack: error.stack 
    }, "Organization admin middleware error");
    
    res.status(500).json({
      error: "Authorization failed",
      message: error.message
    });
  }
};

/**
 * Optional membership check - attaches membership info if available but doesn't block
 */
export const optionalMembership = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?._id;

    if (!userId) {
      return next(); // Continue without membership info
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return next();
    }

    // Check for personal membership
    if (user.activeMembership) {
      const personalMembership = await membershipModel.findById(user.activeMembership);
      
      if (personalMembership && personalMembership.hasPublicationAccess()) {
        req.membership = personalMembership;
        req.membershipSource = 'personal';
        req.hasMembership = true;
      }
    }

    // Check for organizational membership
    if (!req.hasMembership && user.organization) {
      const organization = await organizationModel
        .findById(user.organization)
        .populate('membership');

      if (organization && 
          organization.membership && 
          organization.membership.hasPublicationAccess()) {
        req.membership = organization.membership;
        req.organization = organization;
        req.membershipSource = 'organizational';
        req.hasMembership = true;
      }
    }

    next();

  } catch (error) {
    logger.error({ 
      userId: req.user?._id, 
      errorMsg: error.message 
    }, "Optional membership middleware error");
    
    // Don't fail the request, just continue without membership info
    next();
  }
};

export default {
  requireMembership,
  requireMembershipTier,
  requireOrganizationAdmin,
  optionalMembership
};