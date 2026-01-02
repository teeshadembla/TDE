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
