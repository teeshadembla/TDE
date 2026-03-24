export const membershipWelcomeTemplate = ({ name, FRONTEND_URL }) => {
  return {
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#000000;border-radius:16px;overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(180deg,#000000 0%,#003172 100%);padding:48px 48px 40px;text-align:left;">
                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">The Digital Economist</p>
                    <h1 style="margin:0;color:#ffffff;font-size:36px;font-weight:400;line-height:44px;">
                      Thank you, ${name}
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 48px;background:#000000;">
                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:16px;line-height:26px;font-weight:300;">
                      Your membership is now active. You have full access to everything TDE has to offer.
                    </p>

                    <div style="height:0.5px;background:#d9d9d9;opacity:0.2;margin:32px 0;"></div>

                    <p style="margin:0 0 20px;color:#ffffff;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;font-weight:400;">
                      What's included
                    </p>

                    <div style="margin-bottom:14px;">
                      <span style="color:#004aad;margin-right:12px;">→</span>
                      <span style="color:#d9d9d9;font-size:15px;line-height:24px;font-weight:300;">Access all exclusive publications & research</span>
                    </div>
                    <div style="margin-bottom:14px;">
                      <span style="color:#004aad;margin-right:12px;">→</span>
                      <span style="color:#d9d9d9;font-size:15px;line-height:24px;font-weight:300;">Join member-only events and expert sessions</span>
                    </div>
                    <div style="margin-bottom:14px;">
                      <span style="color:#004aad;margin-right:12px;">→</span>
                      <span style="color:#d9d9d9;font-size:15px;line-height:24px;font-weight:300;">On-demand session recordings & expert briefings</span>
                    </div>
                    <div style="margin-bottom:14px;">
                      <span style="color:#004aad;margin-right:12px;">→</span>
                      <span style="color:#d9d9d9;font-size:15px;line-height:24px;font-weight:300;">Connect with fellows and chairs globally</span>
                    </div>
                    <div style="margin-bottom:14px;">
                      <span style="color:#004aad;margin-right:12px;">→</span>
                      <span style="color:#d9d9d9;font-size:15px;line-height:24px;font-weight:300;">Early access to new programmes & initiatives</span>
                    </div>

                    <div style="height:0.5px;background:#d9d9d9;opacity:0.2;margin:32px 0;"></div>

                    <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                      <tr>
                        <td style="background:#004aad;border-radius:8px;">
                          <a href="${FRONTEND_URL}/publications"
                            style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
                            Explore Publications
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0;color:#d9d9d9;font-size:14px;line-height:22px;font-weight:300;">
                      Manage your subscription anytime from your
                      <a href="${FRONTEND_URL}/profile/membership" style="color:#004aad;text-decoration:none;">profile dashboard</a>.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 48px;border-top:0.5px solid rgba(217,217,217,0.2);">
                    <p style="margin:0;color:#6b7280;font-size:12px;line-height:20px;font-weight:300;">
                      © ${new Date().getFullYear()} The Digital Economist. All rights reserved.<br>
                      <a href="mailto:teesha@thedigitaleconomist.com" style="color:#004aad;text-decoration:none;">teesha@thedigitaleconomist.com</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
      Thank you for joining The Digital Economist, ${name}.

      Your membership is now active. You now have access to:
      - All exclusive publications & research
      - Member-only events and expert sessions
      - On-demand session recordings & expert briefings
      - Connection with fellows and chairs globally
      - Early access to new programmes & initiatives

      Explore Publications: ${FRONTEND_URL}/publications
      Manage your subscription: ${FRONTEND_URL}/profile/membership

      © ${new Date().getFullYear()} The Digital Economist
    `
  };
};