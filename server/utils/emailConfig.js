import dotenv from 'dotenv';

// Only load dotenv if running in Node.js (not in browser)
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  dotenv.config();
}

// Function to get config dynamically (reads env vars at runtime, not import time)
function getEmailConfig() {
  return {
    aws :{
        accessKeyId: process.env.AWS_SES_ACCES_KEY,
        secretAccessKey: process.env.AWS_SES_SECRET_KEY,
        region:process.env.AWS_REGION_SES,
        fromEmail: process.env.SMTP_FROM_EMAIL,
        fromName: process.env.SMTP_FROM_NAME,
    },

    brevo:{
        apiKey: process.env.BREVO_API_KEY,
        baseUrl: "https://api.brevo.com/v3"
    },

    // Template IDs
    templates: {
        WELCOME: parseInt(process.env.BREVO_TEMPLATE_WELCOME) || null,
        REGISTRATION_ACCEPTED: parseInt(process.env.BREVO_TEMPLATE_REGISTRATION_ACCEPTED) || null,
        PAYMENT_REMINDER_DAY3: parseInt(process.env.BREVO_TEMPLATE_PAYMENT_REMINDER_DAY3) || null,
        PAYMENT_REMINDER_DAY6: parseInt(process.env.BREVO_TEMPLATE_PAYMENT_REMINDER_DAY6) || null,
        PAYMENT_CONFIRMED: parseInt(process.env.BREVO_TEMPLATE_PAYMENT_CONFIRMED) || null,
        REGISTRATION_CANCELLED: parseInt(process.env.BREVO_TEMPLATE_REGISTRATION_CANCELLED) || null
    },

    // Email subjects (fallbacks if not in template)
    subjects: {
        WELCOME: 'Welcome to Our Fellowship Platform! 🎉',
        REGISTRATION_ACCEPTED: 'Congratulations! Your Application Has Been Accepted',
        PAYMENT_REMINDER_DAY3: 'Reminder: Complete Your Payment',
        PAYMENT_REMINDER_DAY6: '⚠️ Final Reminder: Payment Due Tomorrow',
        PAYMENT_CONFIRMED: '✅ Payment Confirmed - Your Spot is Secured!',
        REGISTRATION_CANCELLED: 'Registration Cancelled - Payment Not Received'
    },

    // Payment Configuration
    payment: {
        deadlineDays: parseInt(process.env.PAYMENT_DEADLINE_DAYS) || 7,
        reminderDay3: parseInt(process.env.PAYMENT_REMINDER_DAY3) || 3,
        reminderDay6: parseInt(process.env.PAYMENT_REMINDER_DAY6) || 6
    },

    // Application URLs
    urls: {
        frontend: process.env.FRONTEND_URL || 'http://localhost:3000',
        backend: process.env.BACKEND_URL || 'http://localhost:5000'
    },

    // Email Processing Configuration
    processing: {
        intervalMinutes: parseInt(process.env.EMAIL_PROCESSING_INTERVAL) || 15,
        maxRetries: parseInt(process.env.MAX_EMAIL_RETRIES) || 3,
        retryDelayMinutes: 5
    }

  };
}

// Get config once at startup and cache it
const emailConfig = getEmailConfig();

// Validation function
export const validateEmailConfig = () => {
  const required = {
    'AWS Access Key': emailConfig.aws.accessKeyId,
    'AWS Secret Key': emailConfig.aws.secretAccessKey,
    'AWS Region': emailConfig.aws.region,
    'AWS From Email': emailConfig.aws.fromEmail,
    'Brevo API Key': emailConfig.brevo.apiKey,
    'Welcome Template ID': emailConfig.templates.WELCOME
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required email configuration: ${missing.join(', ')}`);
  }

  console.log('✅ Email configuration validated successfully');
  return true;
};

export default emailConfig;