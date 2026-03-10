

export const successfulSignupTemplate = ({ name, message, actionUrl, actionText }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>The Digital Economist</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:20px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

            <tr>
              <td style="background:#111827; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:20px;">
                  The Digital Economist
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
                
                <p>Hi ${name},</p>

                <p>${message}</p>

                <div style="text-align:center; margin:30px 0;">
                  <a href="${actionUrl}" 
                     style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-weight:bold;">
                    ${actionText}
                  </a>
                </div>

                <p>If the button above doesn’t work, copy and paste this link:</p>
                <p style="word-break:break-all; color:#2563eb;">
                  ${actionUrl}
                </p>

                <p>
                  Regards,<br/>
                  The Digital Economist Team
                </p>

              </td>
            </tr>

            <tr>
              <td style="background:#f9fafb; padding:20px; font-size:12px; color:#6b7280; text-align:center;">
                <p style="margin:0;">
                  The Digital Economist<br/>
                  Indore, Madhya Pradesh, India
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


// utils/emailTemplates/profileUpdatedTemplate.js

export const profileUpdatedTemplate = ({ name, profileUrl}) => {

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Profile Updated</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:20px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <tr>
              <td style="background:#111827; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:20px;">The Digital Economist</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
                
                <p>Hi ${name},</p>

                <p>Your profile has been updated successfully.</p>

                <p>The following changes were saved:</p>


                <div style="text-align:center; margin:30px 0;">
                  <a href="${profileUrl}"
                     style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-weight:bold;">
                    View Profile
                  </a>
                </div>

                <p>If you did not make this update, please contact support.</p>

                <p>
                  Regards,<br/>
                  The Digital Economist Team
                </p>

              </td>
            </tr>

            <tr>
              <td style="background:#f9fafb; padding:20px; font-size:12px; color:#6b7280; text-align:center;">
                <p style="margin:0;">
                  The Digital Economist<br/>
                  Indore, Madhya Pradesh, India
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


// utils/emailTemplates/mfaEnabledTemplate.js

export const mfaEnabledTemplate = ({ name, dashboardUrl, supportEmail }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Multi-Factor Authentication Enabled</title>
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
                  Multi-Factor Authentication (MFA) has been successfully enabled on your account.
                </p>

                <p>
                  This adds an extra layer of security and helps protect your account from unauthorized access.
                </p>

                <div style="background:#f3f4f6; padding:15px; border-radius:6px; margin:20px 0;">
                  <strong>What this means:</strong>
                  <ul style="margin:10px 0 0 20px;">
                    <li>You’ll be asked for an additional verification code during login.</li>
                    <li>Your account is now significantly more secure.</li>
                  </ul>
                </div>

                <div style="text-align:center; margin:30px 0;">
                  <a href="${dashboardUrl}"
                     style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-weight:bold;">
                    Go to Dashboard
                  </a>
                </div>

                <p>
                  If you did not enable MFA, please contact us immediately at
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
                  This is a security notification. Please do not reply directly.
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

// utils/emailTemplates/passwordChangedTemplate.js

export const passwordChangedTemplate = ({
  name,
  loginUrl,
  supportEmail,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Changed Successfully</title>
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
                  Your password has been changed successfully.
                </p>

                <p>
                  You can now log in using your new credentials.
                </p>

                <!-- CTA -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="${loginUrl}"
                     style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:6px; display:inline-block; font-weight:bold;">
                    Login to your account
                  </a>
                </div>

                <div style="background:#fef2f2; padding:15px; border-radius:6px; margin:20px 0;">
                  <strong>Security notice:</strong>
                  <ul style="margin:10px 0 0 20px;">
                    <li>If you did not make this change, secure your account immediately.</li>
                    <li>Reset your password again and contact support.</li>
                  </ul>
                </div>

                <p>
                  Need help? Contact us at 
                  <a href="mailto:${supportEmail}" style="color:#2563eb; text-decoration:none;">
                    ${supportEmail}
                  </a>
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
                  This is a security notification. Please do not reply directly.
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


