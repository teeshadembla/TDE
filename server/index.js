import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { clerkMiddleware } from '@clerk/express';
import path from 'path';
import { fileURLToPath } from 'url';

import Connection, { disconnectDB } from './db.js';
import { globalLimiter } from './utils/Production/rateLimiter.js';
import logger from './utils/logger.js';
import { validateEnv } from './utils/validateEnv.js';
import { httpLogger } from './middleware/httpLogger.js';

/* Email System Imports */
import emailProcessor from './Jobs/emailProcessor.js';
import overduePaymentChecker from './Jobs/overduePaymentChecker.js';
import { validateEmailConfig } from './utils/emailConfig.js';

/* Routes */
import userRouter from './Routes/userRouter.js';
import eventRouter from './Routes/eventRouter.js';
import registerRouter from './Routes/registerRouter.js';
import fellowshipRouter from './Routes/fellowshipRoutes.js';
import fellowshipRegistrationRouter from './Routes/fellowshipRegistrationRouter.js';
import postRouter from './Routes/postRouter.js';
import commentRouter from './Routes/commentRouter.js';
import researchPaperRouter from './Routes/researchPaperRouter.js';
import fellowProfileRouter from './Routes/fellowProfileRouter.js';
import adminRouter from './Routes/adminRouter.js';
import membershipRouter from './Routes/membershipRoutes.js';
import newsletterSubscriberRouter from './Routes/newsletterSubscriberRouter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ======================================================================
   Environment Setup (single source of truth)
====================================================================== */

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';

validateEnv();

logger.info(
  { environment: NODE_ENV },
  'Application bootstrapping'
);

/* ======================================================================
   Express App Setup
====================================================================== */

const app = express();

if (isProd) {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use(globalLimiter);
app.use(cookieParser());

app.use(
  cors({
    origin: isProd
      ? [process.env.FRONTEND_URL, 'https://tde-kict.vercel.app']
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);
/* 
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://js.stripe.com",
          "https://*.clerk.accounts.dev",
          "https://challenges.cloudflare.com",
          "https://cdnjs.cloudflare.com",
        ],
        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'", // ADD THIS - needed for inline scripts
          "https://js.stripe.com",
          "https://*.clerk.accounts.dev",
          "https://challenges.cloudflare.com",
          "https://cdnjs.cloudflare.com",
        ],
        workerSrc: [ // ADD THIS ENTIRE SECTION - needed for Clerk web workers
          "'self'",
          "blob:",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:",
          "https://cdn.prod.website-files.com",
          "https://img.clerk.com",
          "https://*.clerk.accounts.dev",
        ],
        connectSrc: [
          "'self'",
          "https://api.stripe.com",
          "https://*.stripe.com",
          "https://*.clerk.accounts.dev",
          "https://api.clerk.dev",
          "https://api.clerk.com",
          "https://clerk.thedigitaleconomist.com",
          isProd ? "https://app.thedigitaleconomist.com" : "http://localhost:*",
          isProd ? process.env.FRONTEND_URL : "http://localhost:5173",
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://*.stripe.com",
          "https://*.clerk.accounts.dev",
          "https://challenges.cloudflare.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "data:",
        ],
        mediaSrc: ["'self'", "data:", "blob:"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
  })
); */

if (!isTest) {
  app.use(
    clerkMiddleware({
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY,
    })
  );
}

app.use('/api/webhook', express.raw({ type: 'application/json' }), membershipRouter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(httpLogger);

/* ======================================================================
   Health & Test Routes
====================================================================== */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

app.get('/api/trial-shutdown', async (req, res) => {
  await new Promise((r) => setTimeout(r, 10000));
  res.json({ message: 'Delayed response' });
});

/* ======================================================================
   API Routes
====================================================================== */

app.use('/api/user', userRouter);
app.use('/api/events', eventRouter);
app.use('/api/user-event', registerRouter);
app.use('/api/fellowship', fellowshipRouter);
app.use('/api/fellowship-registration', fellowshipRegistrationRouter);
app.use('/api/community', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/documents', researchPaperRouter);
app.use('/api/fellow-profile', fellowProfileRouter);
app.use('/api/admin', adminRouter);
app.use('/api/membership', membershipRouter);
app.use('/api/organization', membershipRouter);
app.use('/api/newsletter', newsletterSubscriberRouter);


/* ======================================================================
   Static Frontend
====================================================================== */

app.use(express.static(path.join(__dirname, 'dist')));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/* ======================================================================
   Server Start
====================================================================== */

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(
    { port: PORT, environment: NODE_ENV },
    '🚀 Server started successfully'
  );
});

/* ======================================================================
   Graceful Shutdown
====================================================================== */

const shutdown = async (signal) => {
  logger.warn({ signal }, 'Received shutdown signal');

  server.close(async () => {
    try {
      logger.info('Closing server connections');

      await disconnectDB();

      if (emailProcessor?.stopScheduler) {
        logger.info('Stopping email processor');
        emailProcessor.stopScheduler();
      }

      if (overduePaymentChecker?.stop) {
        logger.info('Stopping overdue payment checker');
        overduePaymentChecker.stop();
      }

      logger.info('✅ Graceful shutdown complete');
      process.exit(0);
    } catch (err) {
      logger.error({ error: err }, 'Error during shutdown');
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error('Force shutdown timeout reached');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error({ error: err }, 'Uncaught Exception');
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Promise Rejection');
  shutdown('unhandledRejection');
});

/* ======================================================================
   Database & Email System Initialization
====================================================================== */

if (!isTest) {
  Connection();

  setTimeout(() => {
    try {
      logger.info('========================================');
      logger.info('📧 INITIALIZING EMAIL SYSTEM');
      logger.info('========================================');

      validateEmailConfig();
      emailProcessor.startScheduler();
      overduePaymentChecker.start();

      logger.info('✅ EMAIL SYSTEM READY');
      logger.info('========================================');
    } catch (error) {
      logger.error(
        { error: error.message },
        'EMAIL SYSTEM INITIALIZATION FAILED'
      );
    }
  }, 2000);
}

export default app;
