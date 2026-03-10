// utils/emailTemplates/profileVerifiedTemplate.js

export const profileVerifiedTemplate = ({
  name,
  dashboardUrl,
  supportEmail,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Profile Verified</title>
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
                  Your profile has been successfully verified by The Digital Economist.
                </p>

                <p>
                  You can now access your dashboard and start using the privileges and features available to you.
                </p>

                <!-- CTA -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${dashboardUrl}"
                     style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-weight:bold;">
                    Go to Dashboard
                  </a>
                </div>

                <p>
                  If you have any questions or face any issues accessing your account, contact us at 
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
                  This is an automated notification email.
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
