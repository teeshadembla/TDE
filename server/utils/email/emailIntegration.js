import emailService from "../../Services/emailService.js";
import emailScheduler from './emailScheduler.js';
import emailConfig from "../emailConfig.js";

class EmailIntegration {
  /**
   * Handle new user signup - send welcome email
   * @param {Object} user - User document
   */
  async handleUserSignup(user) {
    try {
      console.log(`\n👋 Handling signup for ${user.email}...`);
      
      const result = await emailService.sendWelcomeEmail(user);
      
      if (result.success) {
        console.log('   ✅ Welcome email sent');
      } else {
        console.log('   ⚠️  Welcome email failed (non-critical)');
        console.error('   Error:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error in handleUserSignup:', error);
      // Don't throw - email failure shouldn't break signup
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle fellowship registration approval
   * @param {Object} registration - Fellowship registration document
   * @param {Object} user - User document
   * @param {Object} fellowship - Fellowship document
   */
  async handleRegistrationApproval(registration, user, fellowship) {
    try {
      console.log(`\n✅ Handling registration approval for ${user.email}...`);
      
      // Calculate payment deadline (7 days from now)
      const paymentDeadline = new Date();
      paymentDeadline.setDate(paymentDeadline.getDate() + emailConfig.payment.deadlineDays);
      
      // Update registration with payment deadline
      registration.paymentDeadline = paymentDeadline;
      await registration.save();
      
      // Send immediate acceptance email
      const emailResult = await emailService.sendRegistrationAcceptedEmail(
        registration,
        user,
        fellowship
      );
      
      if (!emailResult.success) {
        console.log('   ⚠️  Acceptance email failed');
        console.error('   Error:', emailResult.error);
      }
      
      // Schedule payment reminders
      const schedulerResult = await emailScheduler.schedulePaymentReminders(
        registration,
        user,
        fellowship
      );
      
      if (!schedulerResult.success) {
        console.log('   ⚠️  Failed to schedule reminders');
        console.error('   Error:', schedulerResult.error);
      }
      
      console.log('   ✅ Registration approval emails handled\n');
      
      return {
        success: true,
        emailSent: emailResult.success,
        remindersScheduled: schedulerResult.success
      };
    } catch (error) {
      console.error('Error in handleRegistrationApproval:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle payment completion
   * @param {Object} registration - Fellowship registration document
   * @param {Object} user - User document
   * @param {Object} fellowship - Fellowship document
   * @param {Object} transactionDetails - Payment transaction details
   */
  async handlePaymentCompletion(registration, user, fellowship, transactionDetails) {
    try {
      console.log(`\n💳 Handling payment completion for ${user.email}...`);
      
      // Cancel all pending reminders
      const cancelResult = await emailScheduler.cancelAllReminders(
        registration._id,
        'Payment completed'
      );
      
      if (!cancelResult.success) {
        console.log('   ⚠️  Failed to cancel reminders (non-critical)');
      }
      
      // Send payment confirmation email
      const emailResult = await emailService.sendPaymentConfirmedEmail(
        registration,
        user,
        fellowship,
        transactionDetails
      );
      
      if (!emailResult.success) {
        console.log('   ⚠️  Confirmation email failed');
        console.error('   Error:', emailResult.error);
      }
      
      console.log('   ✅ Payment completion emails handled\n');
      
      return {
        success: true,
        remindersCancelled: cancelResult.success,
        emailSent: emailResult.success
      };
    } catch (error) {
      console.error('Error in handlePaymentCompletion:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle registration cancellation (due to non-payment)
   * @param {Object} registration - Fellowship registration document
   * @param {Object} user - User document
   * @param {Object} fellowship - Fellowship document
   */
  async handleRegistrationCancellation(registration, user, fellowship) {
    try {
      console.log(`\n❌ Handling registration cancellation for ${user.email}...`);
      
      // Update registration status
      registration.status = 'REJECTED';
      await registration.save();
      
      // Cancel any pending reminders
      await emailScheduler.cancelAllReminders(
        registration._id,
        'Registration cancelled due to non-payment'
      );
      
      // Send cancellation email
      const emailResult = await emailService.sendRegistrationCancelledEmail(
        registration,
        user,
        fellowship
      );
      
      if (!emailResult.success) {
        console.log('   ⚠️  Cancellation email failed');
        console.error('   Error:', emailResult.error);
      }
      
      console.log('   ✅ Registration cancellation handled\n');
      
      return {
        success: true,
        emailSent: emailResult.success
      };
    } catch (error) {
      console.error('Error in handleRegistrationCancellation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check for overdue payments and cancel registrations
   * This should be called by a cron job daily
   */
  async processOverduePayments() {
    try {
      console.log('\n🔍 Checking for overdue payments...');
      
      const fellowshipRegistrationModel = (await import('../../Models/fellowshipRegistrationModel.js')).default;
      const userModel = (await import('../../Models/userModel.js')).default;
      const Fellowship = (await import('../../Models/fellowshipModel.js')).default;
      
      // Find registrations that are approved but unpaid and past deadline
      const overdueRegistrations = await fellowshipRegistrationModel.find({
        status: 'APPROVED',
        paymentStatus: 'PENDING',
        paymentDeadline: { $lt: new Date() }
      }).populate('user fellowship');
      
      if (overdueRegistrations.length === 0) {
        console.log('   ✅ No overdue payments found\n');
        return { success: true, processedCount: 0 };
      }
      
      console.log(`   Found ${overdueRegistrations.length} overdue registrations`);
      
      let processedCount = 0;
      
      for (const registration of overdueRegistrations) {
        const user = await userModel.findById(registration.user);
        const fellowship = await Fellowship.findById(registration.fellowship);
        
        if (user && fellowship) {
          await this.handleRegistrationCancellation(registration, user, fellowship);
          processedCount++;
        }
      }
      
      console.log(`   ✅ Processed ${processedCount} overdue payments\n`);
      
      return {
        success: true,
        processedCount
      };
    } catch (error) {
      console.error('Error in processOverduePayments:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailIntegration();