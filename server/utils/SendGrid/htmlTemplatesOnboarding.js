// utils/emailTemplates/profileAcceptedTemplate.js

export const profileAcceptedTemplate = ({
  name,
  dashboardUrl,
  slackInviteUrl,
  supportEmail,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>You're Onboarded!</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:20px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#111827; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:20px;">
                  The Digital Economist
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
                
                <p>Hi ${name},</p>

                <p>
                  Your profile has been successfully accepted and you’ve been onboarded to The Digital Economist.
                </p>

                <p>
                  You can now access your dashboard and start exploring the opportunities and privileges available to you.
                </p>

                <!-- Dashboard CTA -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${dashboardUrl}"
                     style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-weight:bold;">
                    Go to Dashboard
                  </a>
                </div>

                <p>
                  We also invite you to join our community Slack channel to stay connected, collaborate, and receive updates.
                </p>

                <!-- Slack CTA -->
                <div style="text-align:center; margin:20px 0;">
                  <a href="${slackInviteUrl}"
                     style="background-color:#4A154B; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-weight:bold;">
                    Join Slack Community
                  </a>
                </div>

                <p>
                  If you have any questions or need assistance getting started, feel free to reach out at 
                  <a href="mailto:${supportEmail}" style="color:#2563eb; text-decoration:none;">
                    ${supportEmail}
                  </a>.
                </p>

                <p>
                  Welcome aboard,<br/>
                  The Digital Economist Team
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:20px; font-size:12px; color:#6b7280; text-align:center;">
                <p style="margin:0;">
                  The Digital Economist<br/>
                  Indore, Madhya Pradesh, India
                </p>
                <p style="margin:8px 0 0;">
                  This is an automated onboarding email.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};


// utils/emailTemplates/profileRevisionRequestedTemplate.js

export const profileRevisionRequestedTemplate = ({
  name,
  profileName,
  comments,
  editProfileUrl,
  supportEmail,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Revision Requested</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:20px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#111827; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:20px;">
                  The Digital Economist
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
                
                <p>Hi ${name},</p>

                <p>
                  Your profile <strong>${profileName}</strong> requires some revisions before it can be approved.
                </p>

                <p>
                  Our team has reviewed your submission and shared feedback below. Please make the necessary updates and resubmit your profile.
                </p>

                <!-- Reviewer comments -->
                <div style="background:#fff7ed; padding:15px; border-radius:6px; margin:20px 0;">
                  <strong>Reviewer comments:</strong>
                  <p style="margin-top:10px;">${comments}</p>
                </div>

                <!-- CTA -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${editProfileUrl}"
                     style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-weight:bold;">
                    Update Your Profile
                  </a>
                </div>

                <p>
                  After updating, please resubmit your profile for review. Our team will evaluate it again.
                </p>

                <p>
                  If you have questions or need assistance, contact us at 
                  <a href="mailto:${supportEmail}" style="color:#2563eb; text-decoration:none;">
                    ${supportEmail}
                  </a>.
                </p>

                <p>
                  Regards,<br/>
                  The Digital Economist Team
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:20px; font-size:12px; color:#6b7280; text-align:center;">
                <p style="margin:0;">
                  The Digital Economist<br/>
                  Indore, Madhya Pradesh, India
                </p>
                <p style="margin:8px 0 0;">
                  This is an automated review notification email.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};

export const profileSubmittedTemplate = ({
  name,
  profileName,
  dashboardUrl,
  supportEmail,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Profile Submitted Successfully</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:20px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#111827; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:20px;">
                  The Digital Economist
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
                
                <p>Hi ${name},</p>

                <p>
                  Your profile <strong>${profileName}</strong> has been successfully submitted.
                </p>

                <p>
                  Our team will now review your submission. You will be notified once the review process is complete.
                </p>

                <div style="background:#eef2ff; padding:15px; border-radius:6px; margin:20px 0;">
                  <strong>What happens next?</strong>
                  <ul style="margin:10px 0 0 20px;">
                    <li>Our team reviews your profile.</li>
                    <li>You may receive feedback if revisions are required.</li>
                    <li>Once approved, you’ll gain full access to fellow privileges.</li>
                  </ul>
                </div>

                <div style="text-align:center; margin:30px 0;">
                  <a href="${dashboardUrl}"
                     style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-weight:bold;">
                    Go to Dashboard
                  </a>
                </div>

                <p>
                  If you have any questions, reach out to us at 
                  <a href="mailto:${supportEmail}" style="color:#2563eb; text-decoration:none;">
                    ${supportEmail}
                  </a>.
                </p>

                <p>
                  Regards,<br/>
                  The Digital Economist Team
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:20px; font-size:12px; color:#6b7280; text-align:center;">
                <p style="margin:0;">
                  The Digital Economist<br/>
                  Indore, Madhya Pradesh, India
                </p>
                <p style="margin:8px 0 0;">
                  This is an automated submission confirmation email.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
