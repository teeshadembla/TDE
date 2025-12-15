import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import emailConfig from '../utils/emailConfig.js';

class SESService {
  constructor() {
    this.client = new SESClient({
      region: emailConfig.aws.region,
      credentials: {
        accessKeyId: emailConfig.aws.accessKeyId,
        secretAccessKey: emailConfig.aws.secretAccessKey
      }
    });
    
    this.fromEmail = emailConfig.aws.fromEmail;
    this.fromName = emailConfig.aws.fromName;
  }

  /**
   * Send an email using AWS SES
   * @param {Object} params - Email parameters
   * @param {string} params.to - Recipient email
   * @param {string} params.subject - Email subject
   * @param {string} params.htmlBody - HTML content
   * @param {string} params.textBody - Plain text content (optional)
   * @returns {Promise<Object>} SES response
   */
  async sendEmail({ to, subject, htmlBody, textBody }) {
    try {
      const params = {
        Source: `${this.fromName} <${this.fromEmail}>`,
        Destination: {
          ToAddresses: [to]
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: htmlBody,
              Charset: 'UTF-8'
            }
          }
        }
      };

      // Add text body if provided
      if (textBody) {
        params.Message.Body.Text = {
          Data: textBody,
          Charset: 'UTF-8'
        };
      }

      const command = new SendEmailCommand(params);
      const response = await this.client.send(command);

      console.log(`✅ Email sent successfully to ${to}`);
      console.log(`   MessageId: ${response.MessageId}`);

      return {
        success: true,
        messageId: response.MessageId,
        response
      };
    } catch (error) {
      console.error(`❌ Error sending email to ${to}:`, error.message);
      
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR',
          details: error
        }
      };
    }
  }

  /**
   * Send bulk emails (with rate limiting)
   * @param {Array} emails - Array of email objects
   * @returns {Promise<Object>} Results
   */
  async sendBulkEmails(emails) {
    const results = {
      success: [],
      failed: []
    };

    for (const email of emails) {
      const result = await this.sendEmail(email);
      
      if (result.success) {
        results.success.push({
          to: email.to,
          messageId: result.messageId
        });
      } else {
        results.failed.push({
          to: email.to,
          error: result.error
        });
      }

      // Rate limiting: Wait 100ms between emails to avoid throttling
      // AWS SES free tier: 1 email per second
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  /**
   * Verify an email address (for sandbox testing)
   * @param {string} email - Email to verify
   * @returns {Promise<Object>} Verification result
   */
  async verifyEmailAddress(email) {
    try {
      const { VerifyEmailIdentityCommand } = await import('@aws-sdk/client-ses');
      const command = new VerifyEmailIdentityCommand({ EmailAddress: email });
      await this.client.send(command);

      return {
        success: true,
        message: `Verification email sent to ${email}`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new SESService();