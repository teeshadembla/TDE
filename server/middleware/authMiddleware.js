// middleware/authMiddleware.js

const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const { logger } = require('../utils/logger.js');

// Verify Clerk token and attach user
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      logger.warn({}, "Authentication failed: No token provided");
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No token provided' 
      });
    }

    // Verify token with Clerk
    const session = await clerkClient.sessions.verifySession(req.headers.sessionid, token);
    
    if (!session) {
      logger.warn({sessionId: req.headers.sessionid}, "Authentication failed: Session verification failed");
      return res.status(401).json({ 
        error: 'Invalid session',
        message: 'Session verification failed' 
      });
    }

    // Get user from database
    const user = await User.findOne({ clerkUserId: session.userId });
    
    if (!user) {
      logger.warn({clerkUserId: session.userId}, "Authentication failed: User not found in database");
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User record does not exist' 
      });
    }

    // Attach user to request
    req.auth = {
      userId: session.userId,
      sessionId: session.id
    };
    req.user = user;

    logger.debug({userId: session.userId}, "User authenticated successfully");
    next();
  } catch (error) {
    logger.error({errorMsg: error.message, stack: error.stack}, "Auth middleware error");
    res.status(401).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
};

// Require admin role
const requireAdmin = async (req, res, next) => {
  try {
    // Ensure user is authenticated first
    if (!req.user) {
      logger.warn({}, "Admin authorization failed: User not authenticated");
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please authenticate first' 
      });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      logger.warn({userId: req.user._id, role: req.user.role}, "Admin authorization failed: Insufficient privileges");
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Admin privileges required' 
      });
    }

    logger.debug({userId: req.user._id}, "Admin authorization granted");
    next();
  } catch (error) {
    logger.error({userId: req.user?._id, errorMsg: error.message, stack: error.stack}, "Admin middleware error");
    res.status(403).json({ 
      error: 'Authorization failed',
      message: error.message 
    });
  }
};

// Require verified user (for premium features)
const requireVerified = async (req, res, next) => {
  try {
    // Ensure user is authenticated first
    if (!req.user) {
      logger.warn({}, "Verification check failed: User not authenticated");
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please authenticate first' 
      });
    }

    // Check if user is verified by admin
    if (!req.user.isVerifiedByAdmin) {
      logger.warn({userId: req.user._id}, "Verification check failed: Account pending admin approval");
      return res.status(403).json({ 
        error: 'Verification required',
        message: 'Your account is pending admin approval. You will be notified once verified.',
        pendingVerification: true
      });
    }

    logger.debug({userId: req.user._id}, "User verification check passed");
    next();
  } catch (error) {
    logger.error({userId: req.user?._id, errorMsg: error.message, stack: error.stack}, "Verification middleware error");
    res.status(403).json({ 
      error: 'Verification check failed',
      message: error.message 
    });
  }
};

// Combined middleware: require auth + admin
const requireAuthAndAdmin = [requireAuth, requireAdmin];

// Combined middleware: require auth + verified
const requireAuthAndVerified = [requireAuth, requireVerified];

module.exports = {
  requireAuth,
  requireAdmin,
  requireVerified,
  requireAuthAndAdmin,
  requireAuthAndVerified
};