// middleware/authMiddleware.js

const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

// Verify Clerk token and attach user
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No token provided' 
      });
    }

    // Verify token with Clerk
    const session = await clerkClient.sessions.verifySession(req.headers.sessionid, token);
    
    if (!session) {
      return res.status(401).json({ 
        error: 'Invalid session',
        message: 'Session verification failed' 
      });
    }

    // Get user from database
    const user = await User.findOne({ clerkUserId: session.userId });
    
    if (!user) {
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

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
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
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please authenticate first' 
      });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Admin privileges required' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
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
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please authenticate first' 
      });
    }

    // Check if user is verified by admin
    if (!req.user.isVerifiedByAdmin) {
      return res.status(403).json({ 
        error: 'Verification required',
        message: 'Your account is pending admin approval. You will be notified once verified.',
        pendingVerification: true
      });
    }

    next();
  } catch (error) {
    console.error('Verification middleware error:', error);
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