

import nodemailer from 'nodemailer';

// Create reusable transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS, // Your app password
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});

// Email templates
const emailTemplates = {
  approval: (userName, userEmail) => ({
    subject: '🎉 Your Account Has Been Approved!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #062c65 0%, #004aad 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 40px 30px;
            }
            .content p {
              margin: 0 0 16px 0;
              color: #1a1a1a;
              font-size: 16px;
            }
            .highlight {
              background: #f0f8ff;
              border-left: 4px solid #004aad;
              padding: 16px;
              margin: 24px 0;
              border-radius: 4px;
            }
            .highlight p {
              margin: 0;
              color: #062c65;
              font-weight: 600;
            }
            .cta-button {
              display: inline-block;
              background: #062c65;
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-weight: 600;
              margin: 24px 0;
              transition: background 0.3s;
            }
            .cta-button:hover {
              background: #004aad;
            }
            .features {
              background: #f9f9f9;
              padding: 24px;
              border-radius: 8px;
              margin: 24px 0;
            }
            .features h3 {
              color: #1a1a1a;
              margin: 0 0 16px 0;
              font-size: 18px;
            }
            .features ul {
              margin: 0;
              padding-left: 20px;
            }
            .features li {
              color: #4a4a4a;
              margin: 8px 0;
            }
            .footer {
              background: #f9f9f9;
              padding: 24px 30px;
              text-align: center;
              border-top: 1px solid #d9d9d9;
            }
            .footer p {
              margin: 0;
              color: #4a4a4a;
              font-size: 14px;
            }
            .icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">🎉</div>
              <h1>Account Approved!</h1>
            </div>
            
            <div class="content">
              <p>Hi <strong>${userName || 'there'}</strong>,</p>
              
              <p>Great news! Your account has been approved by our admin team. You now have full access to all premium features on our platform.</p>
              
              <div class="highlight">
                <p>✅ Your account is now fully verified and active!</p>
              </div>
              
              <div class="features">
                <h3>🚀 What's Now Available:</h3>
                <ul>
                  <li><strong>Events:</strong> Register and participate in exclusive events</li>
                  <li><strong>Fellowships:</strong> Apply for fellowship programs</li>
                  <li><strong>Publications:</strong> Access our complete publication library</li>
                  <li><strong>Community:</strong> Connect with other verified members</li>
                </ul>
              </div>
              
              <center>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="cta-button">
                  Go to Dashboard →
                </a>
              </center>
              
              <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
              
              <p>Welcome aboard!</p>
              
              <p style="margin-top: 24px;">
                Best regards,<br>
                <strong>The Admin Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Your Platform. All rights reserved.</p>
              <p style="margin-top: 8px; font-size: 12px;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${userName || 'there'},

Great news! Your account has been approved by our admin team. You now have full access to all features on our platform.

✅ Your account is now fully verified and active!

What's Now Available:
- Events: Register and participate in exclusive events
- Fellowships: Apply for fellowship programs
- Publications: Access our complete publication library
- Community: Connect with other verified members

Visit your dashboard: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/user/profile

If you have any questions or need assistance, feel free to reach out to our support team.

Welcome aboard!

Best regards,
The Admin Team
    `
  })
};

// Send approval email
export const sendApprovalEmail = async (user) => {
  try {
    const { subject, html, text } = emailTemplates.approval(user.name, user.email);

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Your Platform'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: user.email,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Approval email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    return { success: true, message: 'Email service is working' };
  } catch (error) {
    console.error('Email connection test failed:', error);
    return { success: false, error: error.message };
  }
};

