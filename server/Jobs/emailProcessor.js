import ScheduledEmail from '../Models/scheduledEmailModel.js';
import emailService from '../Services/emailService.js';
import userModel from '../Models/userModel.js';
import Fellowship from '../Models/fellowshipModel.js';
import fellowshipRegistrationModel from '../Models/fellowshipRegistrationModel.js';
import emailConfig from '../utils/emailConfig.js';
import cron from 'node-cron';

class EmailProcessor {
  constructor() {
    this.isProcessing = false;
    this.processedCount = 0;
    this.failedCount = 0;
  }

  /**
   * Process all pending emails that are ready to be sent
   */
  async processPendingEmails() {
    if (this.isProcessing) {
      console.log('⏳ Email processor already running, skipping...');
      return;
    }

    try {
      this.isProcessing = true;
      console.log('\n🔄 Starting email processor...');
      console.log(`   Time: ${new Date().toLocaleString()}`);

      // Get all pending emails ready to be sent
      const pendingEmails = await ScheduledEmail.getPendingEmails(100);

      if (pendingEmails.length === 0) {
        console.log('   ✅ No pending emails to process\n');
        return;
      }

      console.log(`   📨 Found ${pendingEmails.length} emails to process\n`);

      for (const scheduledEmail of pendingEmails) {
        await this.processEmail(scheduledEmail);
        
        // Small delay between emails to avoid rate limiting
        await this.delay(1000);
      }

      console.log('\n📊 Processing Summary:');
      console.log(`   ✅ Processed: ${this.processedCount}`);
      console.log(`   ❌ Failed: ${this.failedCount}\n`);

      // Reset counters
      this.processedCount = 0;
      this.failedCount = 0;

    } catch (error) {
      console.error('❌ Error in email processor:', error.message);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a single scheduled email
   */
  async processEmail(scheduledEmail) {
    try {
      console.log(`📧 Processing ${scheduledEmail.emailType} for ${scheduledEmail.email}...`);

      // Verify registration still needs the email
      const registration = await fellowshipRegistrationModel.findById(
        scheduledEmail.fellowshipRegistration
      );

      if (!registration) {
        console.log('   ⚠️  Registration not found, marking as cancelled');
        await scheduledEmail.cancel('Registration not found');
        return;
      }

      // Check if payment was completed (for payment reminders)
      if (
        scheduledEmail.emailType.includes('PAYMENT_REMINDER') &&
        registration.paymentStatus === 'COMPLETED'
      ) {
        console.log('   ⚠️  Payment already completed, cancelling reminder');
        await scheduledEmail.cancel('Payment completed');
        return;
      }

      // Check if registration was cancelled
      if (registration.status === 'REJECTED') {
        console.log('   ⚠️  Registration was rejected, cancelling email');
        await scheduledEmail.cancel('Registration rejected');
        return;
      }

      // Get user and fellowship data
      const user = await userModel.findById(scheduledEmail.user);
      const fellowship = await Fellowship.findById(scheduledEmail.fellowship);

      if (!user || !fellowship) {
        console.log('   ⚠️  User or fellowship not found, marking as failed');
        await scheduledEmail.markAsFailed(new Error('User or fellowship not found'));
        this.failedCount++;
        return;
      }

      // Determine which email to send
      let result;

      switch (scheduledEmail.emailType) {
        case 'PAYMENT_REMINDER_DAY3':
        case 'PAYMENT_REMINDER_DAY6':
          const reminderDay = scheduledEmail.emailType === 'PAYMENT_REMINDER_DAY3' ? 3 : 6;
          result = await emailService.sendPaymentReminder(
            registration,
            user,
            fellowship,
            reminderDay
          );
          break;

        default:
          // For other email types, use generic templated email
          result = await emailService.sendTemplatedEmail({
            to: scheduledEmail.email,
            emailType: scheduledEmail.emailType,
            templateId: scheduledEmail.brevoTemplateId,
            variables: scheduledEmail.templateVariables,
            userId: user._id,
            fellowshipRegistrationId: registration._id,
            fellowshipId: fellowship._id,
            metadata: scheduledEmail.metadata
          });
      }

      // Update scheduled email based on result
      if (result.success) {
        await scheduledEmail.markAsSent(result.emailLogId);
        
        // Update registration's reminder tracking
        registration.lastReminderSent = new Date();
        registration.reminderCount += 1;
        await registration.save();

        console.log('   ✅ Email sent successfully');
        this.processedCount++;
      } else {
        // Check if we should retry
        if (scheduledEmail.retryCount < emailConfig.processing.maxRetries) {
          await scheduledEmail.markAsFailed(result.error);
          
          // Reschedule for retry (exponential backoff)
          const retryDelay = emailConfig.processing.retryDelayMinutes * Math.pow(2, scheduledEmail.retryCount);
          scheduledEmail.scheduledFor = new Date(Date.now() + retryDelay * 60 * 1000);
          scheduledEmail.status = 'PENDING';
          await scheduledEmail.save();
          
          console.log(`   🔄 Will retry in ${retryDelay} minutes`);
        } else {
          await scheduledEmail.markAsFailed(result.error);
          console.log('   ❌ Max retries reached, marking as failed');
          this.failedCount++;
        }
      }

    } catch (error) {
      console.error(`   ❌ Error processing email:`, error.message);
      await scheduledEmail.markAsFailed(error);
      this.failedCount++;
    }
  }

  /**
   * Delay helper function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Start the processor with cron schedule
   */
  startScheduler() {
    const intervalMinutes = emailConfig.processing.intervalMinutes;

    console.log(`\n🚀 Starting email processor scheduler...`);
    console.log(`   Running every ${intervalMinutes} minutes\n`);

    // Run every X minutes
    const cronExpression = `*/${intervalMinutes} * * * *`;
    
    cron.schedule(cronExpression, () => {
      this.processPendingEmails();
    });

    // Run immediately on startup
    this.processPendingEmails();
  }
}

export default new EmailProcessor();