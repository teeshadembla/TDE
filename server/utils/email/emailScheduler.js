import ScheduledEmail from '../../Models/scheduledEmailModel.js';
import emailConfig from "../emailConfig.js";

class EmailScheduler {
  /**
   * Calculate date by adding days to current date
   * @param {number} days - Number of days to add
   * @returns {Date}
   */
  addDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  /**
   * Schedule a single email
   * @param {Object} params - Scheduling parameters
   * @returns {Promise<Object>}
   */
  async scheduleEmail({
    user,
    email,
    emailType,
    scheduledFor,
    fellowshipRegistration,
    fellowship,
    subject,
    brevoTemplateId,
    templateVariables,
    priority = 'NORMAL',
    metadata = {}
  }) {
    try {
      // Check if similar email already scheduled
      const existingScheduled = await ScheduledEmail.findOne({
        user,
        fellowshipRegistration,
        emailType,
        status: 'PENDING'
      });

      if (existingScheduled) {
        console.log(`   ⚠️  Email of type ${emailType} already scheduled for this registration`);
        return {
          success: false,
          message: 'Email already scheduled',
          scheduledEmailId: existingScheduled._id
        };
      }

      const scheduledEmail = new ScheduledEmail({
        user,
        email,
        emailType,
        scheduledFor,
        fellowshipRegistration,
        fellowship,
        subject,
        brevoTemplateId,
        templateVariables,
        priority,
        status: 'PENDING',
        metadata
      });

      await scheduledEmail.save();

      console.log(`   ✅ Scheduled ${emailType} for ${scheduledFor.toLocaleString()}`);

      return {
        success: true,
        scheduledEmailId: scheduledEmail._id,
        scheduledFor
      };
    } catch (error) {
      console.error(`   ❌ Error scheduling email:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Schedule all payment reminder emails for a registration
   * @param {Object} registration - Fellowship registration document
   * @param {Object} user - User document
   * @param {Object} fellowship - Fellowship document
   * @returns {Promise<Object>}
   */
  async schedulePaymentReminders(registration, user, fellowship) {
    try {
      console.log(`\n📅 Scheduling payment reminders for ${user.FullName}...`);

      const paymentDeadline = new Date(registration.paymentDeadline);
      const now = new Date();

      // Calculate reminder dates
      const day3Date = new Date(paymentDeadline);
      day3Date.setDate(day3Date.getDate() - (emailConfig.payment.deadlineDays - emailConfig.payment.reminderDay3));

      const day6Date = new Date(paymentDeadline);
      day6Date.setDate(day6Date.getDate() - (emailConfig.payment.deadlineDays - emailConfig.payment.reminderDay6));

      const results = {
        day3: null,
        day6: null
      };

      // Schedule Day 3 reminder (only if it's in the future)
      if (day3Date > now) {
        results.day3 = await this.scheduleEmail({
          user: user._id,
          email: user.email,
          emailType: 'PAYMENT_REMINDER_DAY3',
          scheduledFor: day3Date,
          fellowshipRegistration: registration._id,
          fellowship: fellowship._id,
          subject: emailConfig.subjects.PAYMENT_REMINDER_DAY3,
          brevoTemplateId: emailConfig.templates.PAYMENT_REMINDER_DAY3,
          templateVariables: {
            firstname: user.FullName.split(' ')[0],
            fullname: user.FullName,
            fellowship_name: `${fellowship.cycle} Fellowship`,
            amount: `₹${registration.amount}`,
            deadline: paymentDeadline.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            days_remaining: 4,
            payment_link: `${emailConfig.urls.frontend}/payment/${registration._id}`
          },
          priority: 'NORMAL',
          metadata: {
            reminderDay: 3,
            paymentDeadline: registration.paymentDeadline
          }
        });
      } else {
        console.log(`   ⏭️  Skipping Day 3 reminder (date has passed)`);
      }

      // Schedule Day 6 reminder (only if it's in the future)
      if (day6Date > now) {
        results.day6 = await this.scheduleEmail({
          user: user._id,
          email: user.email,
          emailType: 'PAYMENT_REMINDER_DAY6',
          scheduledFor: day6Date,
          fellowshipRegistration: registration._id,
          fellowship: fellowship._id,
          subject: emailConfig.subjects.PAYMENT_REMINDER_DAY6,
          brevoTemplateId: emailConfig.templates.PAYMENT_REMINDER_DAY6,
          templateVariables: {
            firstname: user.FullName.split(' ')[0],
            fullname: user.FullName,
            fellowship_name: `${fellowship.cycle} Fellowship`,
            amount: `₹${registration.amount}`,
            deadline: paymentDeadline.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            days_remaining: 1,
            payment_link: `${emailConfig.urls.frontend}/payment/${registration._id}`
          },
          priority: 'HIGH',
          metadata: {
            reminderDay: 6,
            paymentDeadline: registration.paymentDeadline,
            finalReminder: true
          }
        });
      } else {
        console.log(`   ⏭️  Skipping Day 6 reminder (date has passed)`);
      }

      console.log(`   ✅ Payment reminders scheduled successfully\n`);

      return {
        success: true,
        results
      };
    } catch (error) {
      console.error(`   ❌ Error scheduling payment reminders:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cancel all pending reminders for a registration
   * @param {string} registrationId - Registration ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>}
   */
  async cancelAllReminders(registrationId, reason = 'Payment completed') {
    try {
      console.log(`\n🚫 Cancelling all reminders for registration ${registrationId}...`);

      const result = await ScheduledEmail.cancelAllForRegistration(
        registrationId,
        reason
      );

      console.log(`   ✅ Cancelled ${result.modifiedCount} pending reminders\n`);

      return {
        success: true,
        cancelledCount: result.modifiedCount
      };
    } catch (error) {
      console.error(`   ❌ Error cancelling reminders:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reschedule a specific email
   * @param {string} scheduledEmailId - Scheduled email ID
   * @param {Date} newDate - New scheduled date
   * @returns {Promise<Object>}
   */
  async rescheduleEmail(scheduledEmailId, newDate) {
    try {
      const scheduledEmail = await ScheduledEmail.findById(scheduledEmailId);

      if (!scheduledEmail) {
        return {
          success: false,
          error: 'Scheduled email not found'
        };
      }

      if (scheduledEmail.status !== 'PENDING') {
        return {
          success: false,
          error: `Cannot reschedule email with status: ${scheduledEmail.status}`
        };
      }

      scheduledEmail.scheduledFor = newDate;
      scheduledEmail.metadata.rescheduled = true;
      scheduledEmail.metadata.originalDate = scheduledEmail.scheduledFor;
      await scheduledEmail.save();

      console.log(`   ✅ Rescheduled email to ${newDate.toLocaleString()}`);

      return {
        success: true,
        scheduledEmail
      };
    } catch (error) {
      console.error(`   ❌ Error rescheduling email:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all pending emails for a registration
   * @param {string} registrationId - Registration ID
   * @returns {Promise<Array>}
   */
  async getPendingReminders(registrationId) {
    try {
      const reminders = await ScheduledEmail.find({
        fellowshipRegistration: registrationId,
        status: 'PENDING'
      }).sort({ scheduledFor: 1 });

      return {
        success: true,
        reminders
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get statistics about scheduled emails
   * @returns {Promise<Object>}
   */
  async getSchedulerStats() {
    try {
      const stats = await ScheduledEmail.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const pendingCount = await ScheduledEmail.countDocuments({
        status: 'PENDING',
        scheduledFor: { $lte: new Date() }
      });

      return {
        success: true,
        stats,
        readyToSend: pendingCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new EmailScheduler();