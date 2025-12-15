import brevoService from './brevoService.js';
import sesService from './sesService.js';
import emailConfig from '../utils/emailConfig.js';
import EmailLog from '../Models/emailLogModel.js';

class EmailService {
  /**
   * Send email using Brevo template and AWS SES
   * @param {Object} params - Email parameters
   * @returns {Promise<Object>} Result
   */
  async sendTemplatedEmail({
    to,
    emailType,
    templateId,
    variables,
    userId,
    fellowshipRegistrationId = null,
    fellowshipId = null,
    metadata = {}
  }) {
    try {
      console.log(`\n📧 Preparing to send email to ${to}...`);

      // Step 1: Fetch and process template from Brevo
      const templateResult = await brevoService.getProcessedTemplate(
        templateId,
        variables
      );

      console.log("send templated email log", templateResult)
      if (!templateResult.success) {
        throw new Error(`Template processing failed: ${templateResult.error}`);
      }

      const { htmlContent, subject } = templateResult;

      console.log("send templated email log 2", {htmlContent, subject});
      // Step 2: Create email log entry
      const emailLog = new EmailLog({
        user: userId,
        email: to,
        emailType,
        subject,
        brevoTemplateId: templateId,
        templateVariables: variables,
        fellowshipRegistration: fellowshipRegistrationId,
        fellowship: fellowshipId,
        status: 'PENDING',
        metadata
      });

      await emailLog.save();
      console.log(`   📝 Email log created: ${emailLog._id}`);

      // Step 3: Send email via AWS SES
      const sesResult = await sesService.sendEmail({
        to,
        subject,
        htmlBody: htmlContent
      });

      // Step 4: Update email log based on result
      if (sesResult.success) {
        await emailLog.markAsSent(sesResult.messageId);
        console.log(`   ✅ Email sent successfully!`);
        
        return {
          success: true,
          emailLogId: emailLog._id,
          messageId: sesResult.messageId
        };
      } else {
        await emailLog.markAsFailed(sesResult.error);
        console.log(`   ❌ Email sending failed`);
        
        return {
          success: false,
          error: sesResult.error,
          emailLogId: emailLog._id
        };
      }
    } catch (error) {
      console.error(`❌ Error in sendTemplatedEmail:`, error.message);
      
      return {
        success: false,
        error: {
          message: error.message,
          stack: error.stack
        }
      };
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(user) {
    return this.sendTemplatedEmail({
      to: user.email,
      emailType: 'WELCOME',
      templateId: emailConfig.templates.WELCOME,
      variables: {
        firstname: user.FullName.split(' ')[0],
        email: user.email,
        fullname: user.FullName
      },
      userId: user._id,
      metadata: {
        trigger: 'USER_SIGNUP'
      }
    });
  }

  /**
   * Send registration accepted email
   */
  async sendRegistrationAcceptedEmail(registration, user, fellowship) {
    const paymentDeadline = new Date(registration.paymentDeadline);
    
    return this.sendTemplatedEmail({
      to: user.email,
      emailType: 'REGISTRATION_ACCEPTED',
      templateId: emailConfig.templates.REGISTRATION_ACCEPTED,
      variables: {
        firstname: user.FullName.split(' ')[0],
        fullname: user.FullName,
        fellowship_name: `${fellowship.cycle} Fellowship`,
        amount: `₹${registration.amount}`,
        deadline: paymentDeadline.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        payment_link: `${emailConfig.urls.frontend}/payment/${registration._id}`
      },
      userId: user._id,
      fellowshipRegistrationId: registration._id,
      fellowshipId: fellowship._id,
      metadata: {
        trigger: 'REGISTRATION_APPROVED',
        paymentDeadline: registration.paymentDeadline
      }
    });
  }

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(registration, user, fellowship, reminderDay) {
    const templateId = reminderDay === 3 
      ? emailConfig.templates.PAYMENT_REMINDER_DAY3 
      : emailConfig.templates.PAYMENT_REMINDER_DAY6;
    
    const emailType = reminderDay === 3 
      ? 'PAYMENT_REMINDER_DAY3' 
      : 'PAYMENT_REMINDER_DAY6';

    const paymentDeadline = new Date(registration.paymentDeadline);
    const daysRemaining = Math.ceil(
      (paymentDeadline - new Date()) / (1000 * 60 * 60 * 24)
    );

    return this.sendTemplatedEmail({
      to: user.email,
      emailType,
      templateId,
      variables: {
        firstname: user.FullName.split(' ')[0],
        fullname: user.FullName,
        fellowship_name: `${fellowship.cycle} Fellowship`,
        amount: `₹${registration.amount}`,
        deadline: paymentDeadline.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        days_remaining: daysRemaining,
        payment_link: `${emailConfig.urls.frontend}/payment/${registration._id}`
      },
      userId: user._id,
      fellowshipRegistrationId: registration._id,
      fellowshipId: fellowship._id,
      metadata: {
        trigger: `PAYMENT_REMINDER_DAY${reminderDay}`,
        reminderNumber: registration.reminderCount + 1
      }
    });
  }

  /**
   * Send payment confirmed email
   */
  async sendPaymentConfirmedEmail(registration, user, fellowship, transactionDetails) {
    return this.sendTemplatedEmail({
      to: user.email,
      emailType: 'PAYMENT_CONFIRMED',
      templateId: emailConfig.templates.PAYMENT_CONFIRMED,
      variables: {
        firstname: user.FullName.split(' ')[0],
        fullname: user.FullName,
        fellowship_name: `${fellowship.cycle} Fellowship`,
        amount: `₹${registration.amount}`,
        transaction_id: transactionDetails.transactionId || 'N/A',
        payment_date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        start_date: new Date(fellowship.startDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      },
      userId: user._id,
      fellowshipRegistrationId: registration._id,
      fellowshipId: fellowship._id,
      metadata: {
        trigger: 'PAYMENT_COMPLETED',
        transactionId: transactionDetails.transactionId
      }
    });
  }

  /**
   * Send registration cancelled email
   */
  async sendRegistrationCancelledEmail(registration, user, fellowship) {
    return this.sendTemplatedEmail({
      to: user.email,
      emailType: 'REGISTRATION_CANCELLED',
      templateId: emailConfig.templates.REGISTRATION_CANCELLED,
      variables: {
        firstname: user.FullName.split(' ')[0],
        fullname: user.FullName,
        fellowship_name: `${fellowship.cycle} Fellowship`,
        amount: `₹${registration.amount}`,
        cancellation_date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      },
      userId: user._id,
      fellowshipRegistrationId: registration._id,
      fellowshipId: fellowship._id,
      metadata: {
        trigger: 'PAYMENT_DEADLINE_EXCEEDED',
        originalDeadline: registration.paymentDeadline
      }
    });
  }
}

export default new EmailService();