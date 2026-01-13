import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cors from 'cors'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { clerkMiddleware } from "@clerk/express";
import Connection from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { globalLimiter } from './utils/Production/rateLimiter.js';
/* Email System Imports */
import emailProcessor from './Jobs/emailProcessor.js';
import overduePaymentChecker from './Jobs/overduePaymentChecker.js';
import { validateEmailConfig } from './utils/emailConfig.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */
import userRouter from './Routes/userRouter.js';
import eventRouter  from './Routes/eventRouter.js';
import registerRouter from './Routes/registerRouter.js';
import fellowshipRouter from './Routes/fellowshipRoutes.js';
import fellowshipRegistrationRouter from './Routes/fellowshipRegistrationRouter.js';
import postRouter from "./Routes/postRouter.js";
import commentRouter from './Routes/commentRouter.js';
import researchPaperRouter from './Routes/researchPaperRouter.js';
import fellowProfileRouter from './Routes/fellowProfileRouter.js';
import adminRouter from './Routes/adminRouter.js';
/* ----------------------------------------------------------------------------------------------------------------------------------------------- */

const app = express();
app.set("trust proxy", 1);
app.disable('x-powered-by');
app.use(globalLimiter);
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, 'https://tde-kict.vercel.app'] 
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */
// Health check endpoint - place this BEFORE other routes to avoid middleware interference
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
}); 

app.use("/api/user", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/user-event", registerRouter);
app.use("/api/fellowship", fellowshipRouter);
app.use("/api/fellowship-registration", fellowshipRegistrationRouter);
app.use("/api/community", postRouter);
app.use("/api/comment", commentRouter); 
app.use("/api/documents", researchPaperRouter);
app.use("/api/fellow-profile", fellowProfileRouter);
app.use("/api/admin", adminRouter);


/* ---------------------------------------------------------------------------------------------------------------------------------------------- */

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Initialize database connection asynchronously
(async () => {
  try {
    await Connection();
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
})();

export default app;

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */
/* Email System Initialization */
/* ---------------------------------------------------------------------------------------------------------------------------------------------- */

// Initialize email system after database connection
setTimeout(() => {
    try {
        console.log('\n========================================');
        console.log('📧 INITIALIZING EMAIL SYSTEM');
        console.log('========================================\n');
        
        // Validate email configuration
        validateEmailConfig();
        console.log('✅ Email configuration validated\n');
        
        // Start email processor (processes scheduled emails every 15 minutes)
        emailProcessor.startScheduler();
        console.log('✅ Email processor started (runs every 15 minutes)\n');
        
        // Start overdue payment checker (runs daily at 2:00 AM)
        overduePaymentChecker.start();
        console.log('✅ Overdue payment checker started (runs daily at 2:00 AM)\n');
        
        console.log('========================================');
        console.log('✅ EMAIL SYSTEM READY');
        console.log('========================================\n');
        
    } catch (error) {
        console.error('\n========================================');
        console.error('❌ EMAIL SYSTEM INITIALIZATION FAILED');
        console.error('========================================');
        console.error('Error:', error.message);
        console.error('\n⚠️  Email functionality will not work until configuration is fixed');
        console.error('   Check your .env file for missing or incorrect values\n');
    }
}, 2000); // Wait 2 seconds for DB connection to establish