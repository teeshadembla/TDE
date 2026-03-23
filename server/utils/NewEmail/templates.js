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
export const applicationSubmittedTemplate = ({ name }) => ({
  subject: "Executive Fellowship 2026 – Interview Invitation",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      
      <p>Dear ${name},</p>

      <p>
        Thank you for applying to <strong>The Digital Economist’s Executive Fellowship 2026</strong> 
        and for your interest in joining our global, impact-driven community.
      </p>

      <p>
        We’re pleased to share that we’ve now begun the interview process for the April 2026 intake. 
        As part of this next step, we’d like to invite you to a bilateral conversation with one of our senior executives. 
        This will be an opportunity to reflect on your work and aspirations, explore alignment with the fellowship’s mission 
        of building inclusive, resilient, and sustainable systems, and learn more about the fellowship experience.
      </p>

      <p><strong>Please schedule your conversation at your convenience using one of the following links:</strong></p>

      <ul>
        <li>
          Jose Carvalho – 
          <a href="https://calendly.com/jose-thedigitaleconomist/executive-interview">Schedule here</a>
        </li>
        <li>
          Shannon Kennedy – 
          <a href="https://calendly.com/digitaleconomist/30min">Schedule here</a>
        </li>
        <li>
          Ambriel Pouncy – 
          <a href="https://calendly.com/institutionalresearchnetwork/the-digital-economist-fellowship">Schedule here</a>
        </li>
      </ul>

      <p>
        For more details, find the brochure 
        <a href="https://docsend.com/view/7mi27yzbv5q3hbax">here</a>.
      </p>

      <p>
        We look forward to connecting with you and learning more about the perspective you’ll bring 
        to The Digital Economist community.
      </p>

      <br />

      <p>— The Digital Economist Team</p>

    </div>
  `,
  text: `
Dear ${name},

Thank you for applying to The Digital Economist’s Executive Fellowship 2026 and for your interest in joining our global, impact-driven community.

We’re pleased to share that we’ve now begun the interview process for the April 2026 intake. As part of this next step, we’d like to invite you to a bilateral conversation with one of our senior executives.

Please schedule your conversation using one of the links below:

Jose Carvalho – https://calendly.com/jose-thedigitaleconomist/executive-interview  
Shannon Kennedy – https://calendly.com/digitaleconomist/30min  
Ambriel Pouncy – https://calendly.com/institutionalresearchnetwork/the-digital-economist-fellowship  

For more details, find the brochure here:  
https://docsend.com/view/7mi27yzbv5q3hbax  

We look forward to connecting with you.

— The Digital Economist Team
  `,
});

export const applicationApprovalTemplate = ({ name, userId, FRONTEND_URL }) => ({
  subject: "Welcome to The Digital Economist Executive Fellowship 2026",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      
      <p>Dear ${name},</p>

      <p>
        We are pleased to formally welcome you to the <strong>2026 Executive Fellowship Program at The Digital Economist</strong>. 
        Congratulations on being selected to join this exceptional community of global leaders and changemakers! 
        Your selection reflects both your demonstrated leadership and your alignment with our mission to build a human-centered global economy.
      </p>

      <p>
        The Fellowship will run from <strong>1st of January 2026 to 31st of March 2027</strong>. 
        To confirm your participation, please complete the following requirements by 
        <strong>January 31, 2026 (11:59 PM EST)</strong>:
      </p>

      <h3>1. Sign the Executive Fellowship Terms & Conditions</h3>
      <p>
        The combined agreement includes the Mutual Non-Disclosure Agreement (MNDA), Executive Fellowship Terms & Conditions, 
        and The Digital Economist Code of Conduct. You will receive the link to sign electronically via Dropbox Sign. 
        Please check your spam folder if you do not receive it within 24 hours.
      </p>

      <h3>2. Complete the Executive Fellowship Onboarding Form</h3>
      <p>
        This form grants us permission to feature you in our social media announcements and on our website. 
        Please ensure you upload a high-quality, professional headshot (AI-generated images will not be accepted). 
        We reserve the right to request a new photo if the submitted image does not meet our standards.
      </p>

      <p>
        Complete your onboarding form here: 
        <a href="${FRONTEND_URL}/onboarding/${userId}">Access Onboarding Form</a>
      </p>

      <h3>3. Complete the Administrative Fee Payment</h3>
      <p>
        You will receive an invoice directly via Stripe with a link to pay the administrative fee. 
        Please check your spam folder if you do not receive it within 24 hours.
      </p>

      <p>
        Following the completion of these steps, your onboarding to The Digital Economist digital platforms, 
        including Slack—our primary collaboration and communication hub—will be initiated.
      </p>

      <p>
        The year ahead will challenge and inspire you—to think systemically, engage deeply, and contribute meaningfully 
        to shaping the future of our interconnected world.
      </p>

      <br />

      <p>
        <strong>Welcome to The Digital Economist!</strong> We look forward to your active engagement in this Fellowship 
        and to witnessing the impact of your leadership within this community of global change agents.
      </p>

    </div>
  `,
  text: `
Dear ${name},

We are pleased to formally welcome you to the 2026 Executive Fellowship Program at The Digital Economist.

The Fellowship will run from January 1, 2026 to March 31, 2027.

To confirm your participation, please complete the following by January 31, 2026 (11:59 PM EST):

1. Sign Terms & Conditions (sent via Dropbox Sign)
2. Complete Onboarding Form:
${FRONTEND_URL}/onboarding/${userId}
3. Complete Administrative Fee Payment (via Stripe)

We look forward to your participation and impact.

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

export const paymentConfirmationTemplate = ({ name, fellowshipName, amount, dashboardUrl }) => ({
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
      <a href=${dashboardUrl}><button><p>Access your dahsboard here to start onboarding</p></button></a>
      
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
