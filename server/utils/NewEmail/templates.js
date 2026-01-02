// src/services/email/templates/auth.templates.js
export const twoFAEnabledTemplate = ({ name }) => ({
  subject: "2FA Enabled – Your Account Is Now More Secure",
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h2>Two-Factor Authentication Enabled</h2>
      <p>Dear ${name},</p>
      <p>Two-Factor Authentication (2FA) has been successfully enabled for your account.</p>
      <p>If you did not initiate this action, please contact support immediately.</p>
      <br />
      <p>— The Digital Economist Team</p>
    </div>
  `,
  text: `
Hi ${name},

Two-Factor Authentication (2FA) has been successfully enabled for your account.

If you did not initiate this action, contact support immediately.

— The Digital Economist Team
  `,
});


// src/services/email/templates/application.templates.js
export const applicationSubmittedTemplate = ({ name, fellowshipName }) => ({
  subject: `Application Received – ${fellowshipName}`,
  html: `
    <p>Dear ${name},</p>
    <p>Your application for <strong>${fellowshipName}</strong> has been received.</p>
    <p>Our team will review it and get back to you.</p>
    <br />
    <p>— The Digital Economist Team</p>
  `,
  text: `
Hi ${name},

Your application for ${fellowshipName} has been received.
Our team will review it shortly.

— The Digital Economist Team
  `,
});

export const applicationApprovalTemplate = ({ name, fellowshipName, applicationId, paymentAmount, paymentLink }) => ({
  subject: `🎉 Congratulations! Your Application Has Been Approved – ${fellowshipName}`,
  html: `
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
      <br />
      <p>— The Digital Economist Team</p>
    </div>
  `,
  text: `
Hi ${name},

Congratulations! Your application for the ${fellowshipName} fellowship has been APPROVED!

To secure your spot, please complete your payment of $${paymentAmount}.

Payment Link: ${paymentLink}

Important: Please complete your payment within 7 days to confirm your participation.

If you have any questions, please contact us.

We look forward to having you in our program!

— The Digital Economist Team
  `,
});

export const applicationRejectionTemplate = ({ name, fellowshipName, reason }) => ({
  subject: `Application Status Update – ${fellowshipName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e74c3c;">Application Status Update</h2>
      <p>Dear ${name},</p>
      <p>Thank you for your interest in the <strong>${fellowshipName}</strong> fellowship.</p>
      <p>After careful consideration, we regret to inform you that we cannot offer you a place in this fellowship cycle.</p>
      ${reason ? `<p><strong>Feedback:</strong> ${reason}</p>` : ''}
      <p>We encourage you to apply for future fellowship opportunities. Please keep an eye on our announcements for upcoming programs.</p>
      <p>Thank you for your time and interest in our program.</p>
      <br />
      <p>— The Digital Economist Team</p>
    </div>
  `,
  text: `
Hi ${name},

Thank you for your interest in the ${fellowshipName} fellowship.

After careful consideration, we regret to inform you that we cannot offer you a place in this fellowship cycle.

${reason ? `Feedback: ${reason}` : ''}

We encourage you to apply for future fellowship opportunities. Please keep an eye on our announcements for upcoming programs.

Thank you for your time and interest in our program.

— The Digital Economist Team
  `,
});

export const paymentConfirmationTemplate = ({ name, fellowshipName, amount }) => ({
  subject: `🎉 Payment Confirmed – Welcome to ${fellowshipName}!`,
  html: `
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
      <br />
      <p>— The Digital Economist Team</p>
    </div>
  `,
  text: `
Hi ${name},

Congratulations! Your payment of $${amount} has been successfully processed.

You are now officially enrolled in the ${fellowshipName} fellowship!

What's Next:
- You will receive a welcome package with program details within 2-3 business days
- Fellowship orientation details will be shared separately
- Join our fellowship community group (link to follow)

If you have any questions, please don't hesitate to contact us.

We're excited to have you on board!

— The Digital Economist Team
  `,
});


// src/services/email/templates/account.templates.js
export const accountApprovalTemplate = ({ name, email }) => ({
  subject: "Account Approved – Welcome to The Digital Economist!",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #27ae60;">✅ Your Account Has Been Approved!</h2>
      <p>Dear ${name},</p>
      <p>Congratulations! Your account has been successfully approved and is now active.</p>
      
      <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; color: #155724;"><strong>Account Email:</strong> ${email}</p>
      </div>
      
      <h3 style="color: #2c3e50;">You can now:</h3>
      <ul>
        <li>Access all fellowship programs and opportunities</li>
        <li>Update your profile and personal information</li>
        <li>Browse community resources and events</li>
        <li>Connect with other fellows and members</li>
      </ul>
      
      <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
      <p>Welcome aboard! We're thrilled to have you as part of The Digital Economist community.</p>
      <br />
      <p>— The Digital Economist Team</p>
    </div>
  `,
  text: `
Hi ${name},

Congratulations! Your account has been successfully approved and is now active.

Account Email: ${email}

You can now:
- Access all fellowship programs and opportunities
- Update your profile and personal information
- Browse community resources and events
- Connect with other fellows and members

If you have any questions or need assistance, please don't hesitate to reach out to our support team.

Welcome aboard! We're thrilled to have you as part of The Digital Economist community.

— The Digital Economist Team
  `,
});


// src/services/email/templates/fellowship.templates.js
export const fellowProfileUpdateTemplate = ({ name, fellowProfileName, status }) => {
  const statusMessages = {
    APPROVED: "Your fellow profile has been approved and is now live.",
    REVIEW_NEEDED: "Your profile needs changes before approval.",
    SUBMITTED: "Your profile has been submitted for review.",
    DRAFT: "Your profile has been saved as a draft.",
  };

  return {
    subject: `Fellow Profile Update – ${fellowProfileName}`,
    html: `
      <p>Dear ${name},</p>
      <p>${statusMessages[status]}</p>
      <br />
      <p>— The Digital Economist Team</p>
    `,
    text: `
Hi ${name},

${statusMessages[status]}

— The Digital Economist Team
    `,
  };
};
