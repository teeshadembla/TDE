import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "teeshadembla0509@gmail.com",
    pass: "hzon omdq wfbz ckhu"
  }
});

// 1. Application Submission Confirmation
const sendApplicationSubmissionEmail = async ({ to, name, fellowshipName }) => {
  const subject = `Fellowship Application Received - ${fellowshipName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Application Received</h2>
      <p>Dear ${name},</p>
      <p>Thank you for applying to the <strong>${fellowshipName}</strong> fellowship.</p>
      <p>Your application is currently under review by our team. You will receive an email notification once the review process is complete.</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <br>
      <p>Best regards,<br>The Digital Economist Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"The Digital Economist" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

// 2. Application Approval with Payment Link
const sendApprovalEmailWithPaymentLink = async ({ to, name, fellowshipName, applicationId, paymentAmount }) => {
  const subject = `Fellowship Application Approved - ${fellowshipName}`;
  const paymentLink = `${process.env.FRONTEND_URL}/payment?applicationId=${applicationId}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #27ae60;">🎉 Congratulations! Your Application Has Been Approved</h2>
      <p>Dear ${name},</p>
      <p>We're excited to inform you that your application for the <strong>${fellowshipName}</strong> fellowship has been <strong style="color: #27ae60;">APPROVED</strong>!</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">Next Steps:</h3>
        <p>To secure your spot in the fellowship, please complete your payment of <strong>$${paymentAmount}</strong>.</p>
        <p style="margin-bottom: 0;"><a href="${paymentLink}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Complete Payment Now</a></p>
      </div>
      
      <p><strong>Important:</strong> Please complete your payment within 7 days to confirm your participation.</p>
      
      <p>If you have any questions about the fellowship or payment process, please contact us.</p>
      
      <p>We look forward to having you in our program!</p>
      <br>
      <p>Best regards,<br>The Digital Economist Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"The Digital Economist" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

// 3. Application Rejection
const sendRejectionEmail = async ({ to, name, fellowshipName, reason }) => {
  const subject = `Fellowship Application Update - ${fellowshipName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e74c3c;">Application Status Update</h2>
      <p>Dear ${name},</p>
      <p>Thank you for your interest in the <strong>${fellowshipName}</strong> fellowship.</p>
      <p>After careful consideration, we regret to inform you that we cannot offer you a place in this fellowship cycle.</p>
      ${reason ? `<p><strong>Feedback:</strong> ${reason}</p>` : ''}
      <p>We encourage you to apply for future fellowship opportunities. Please keep an eye on our announcements for upcoming programs.</p>
      <p>Thank you for your time and interest in our program.</p>
      <br>
      <p>Best regards,<br>The Digital Economist Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"The Digital Economist" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

// 4. Payment Confirmation
const sendPaymentConfirmationEmail = async ({ to, name, fellowshipName, amount }) => {
  const subject = `Payment Confirmed - Welcome to ${fellowshipName}!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #27ae60;">🎉 Welcome to the Fellowship!</h2>
      <p>Dear ${name},</p>
      <p>Congratulations! Your payment of <strong>$${amount}</strong> has been successfully processed.</p>
      
      <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; color: #155724;"><strong>✅ You are now officially enrolled in the ${fellowshipName} fellowship!</strong></p>
      </div>
      
      <h3 style="color: #2c3e50;">What's Next:</h3>
      <ul>
        <li>You will receive a welcome package with program details within 2-3 business days</li>
        <li>Fellowship orientation details will be shared separately</li>
        <li>Join our fellowship community group (link to follow)</li>
      </ul>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>We're excited to have you on board!</p>
      <br>
      <p>Best regards,<br>The Digital Economist Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"The Digital Economist" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};



const handleFellowProfileUpdate = async ({to, name, fellowprofile, updateStatus}) =>{
  const conditionalRenderingforUpdateStatus = {
    APPROVED: `
      <p>The fellow profile for <strong>${fellowprofile.name}</strong> has been accepted</p>
      <p>Congratulations! Your fellow profile has been approved and is now live on our platform.</p>
      `,
    REVIEW_NEEDED: `
    <p>The fellow profile for <strong>${fellowprofile.name}</strong> has been reverted to you for some changes before acceptance.</p>
      <p>We appreciate your efforts and encourage you to visit the mentioned link and make necessary changes. Here is the link ${process.env.FRONTEND_URL}/user/profile</p>
      `,
    SUBMITTED: `
      <p>The fellow profile for <strong>${fellowprofile.name}</strong> has been submitted successfully!</p>
      <p>Our team will review your profile and get back to you shortly.</p>
      `,
    DRAFT: `
      p>The fellow profile for <strong>${fellowprofile.name}</strong> has been submitted successfully in drafts!</p>
      <p>Visit the website to submit your details for review on ${process.env.FRONTEND_URL}/user/profile</p>`,
  }

  const subject = `Fellow Profile Update = ${fellowprofile.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Fellow Profile Update Notification</h2>
      <p>Dear ${name},</p>
      <p>If you have any questions or need further information, please feel free to reach out.</p>
      ${conditionalRenderingforUpdateStatus[updateStatus]}
      <br>
      <p>Best regards,<br>The Digital Economist Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"The Digital Economist" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}


const handle2FASetupEmail = async ({to, name}) => {
  const subject = `2FA Setup Successful - Enhance Your Account Security`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Two-Factor Authentication Enabled</h2>
      <p>Dear ${name},</p>
      <p>We are pleased to inform you that Two-Factor Authentication (2FA) has been successfully set up for your account.</p>
      <p>This additional layer of security helps protect your account from unauthorized access.</p>
      <p>If you did not initiate this setup or have any concerns, please contact our support team immediately.</p>
      <br>
      <p>Best regards,<br>The Digital Economist Team</p>
    </div>
  `;
  await transporter.sendMail({
    from: `"The Digital Economist" <${process.env.EMAIL_USER}>`,
    to,
  })
}
export { 
  sendApplicationSubmissionEmail,
  sendApprovalEmailWithPaymentLink, 
  sendRejectionEmail,
  sendPaymentConfirmationEmail,
  handleFellowProfileUpdate,
  handle2FASetupEmail
};