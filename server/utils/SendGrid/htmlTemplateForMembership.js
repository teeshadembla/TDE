import sgMail from '@sendgrid/mail';
import logger from '../logger.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL; // e.g. noreply@thedigitaleconomist.com
const FROM_NAME  = 'The Digital Economist';

/* ─────────────────────────────────────────────
   1. WELCOME EMAIL
   Sent when membership is first activated
───────────────────────────────────────────── */
export const sendWelcomeEmail = async ({ to, name }) => {
  const msg = {
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Welcome to The Digital Economist',
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
                      Welcome, ${name}
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 48px;background:#000000;">
                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:16px;line-height:26px;font-weight:300;">
                      Your membership is now active. You have full access to everything TDE has to offer.
                    </p>

                    <!-- Divider -->
                    <div style="height:0.5px;background:#d9d9d9;opacity:0.2;margin:32px 0;"></div>

                    <!-- What's included -->
                    <p style="margin:0 0 20px;color:#ffffff;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;font-weight:400;">
                      What's included
                    </p>

                    ${[
                      'Access all exclusive publications & research',
                      'Join member-only events and expert sessions',
                      'On-demand session recordings & expert briefings',
                      'Connect with fellows and chairs globally',
                      'Early access to new programmes & initiatives',
                    ].map(f => `
                      <div style="display:flex;align-items:flex-start;margin-bottom:14px;">
                        <span style="color:#004aad;margin-right:12px;font-size:16px;line-height:24px;">→</span>
                        <span style="color:#d9d9d9;font-size:15px;line-height:24px;font-weight:300;">${f}</span>
                      </div>
                    `).join('')}

                    <!-- Divider -->
                    <div style="height:0.5px;background:#d9d9d9;opacity:0.2;margin:32px 0;"></div>

                    <!-- CTA -->
                    <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                      <tr>
                        <td style="background:#004aad;border-radius:8px;">
                          <a href="${process.env.FRONTEND_URL}/publications"
                            style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;letter-spacing:0.01em;">
                            Explore Publications
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0;color:#d9d9d9;font-size:14px;line-height:22px;font-weight:300;">
                      You can manage your subscription at any time from your 
                      <a href="${process.env.FRONTEND_URL}/profile/membership" style="color:#004aad;text-decoration:none;">profile dashboard</a>.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 48px;border-top:0.5px solid rgba(217,217,217,0.2);">
                    <p style="margin:0;color:#6b7280;font-size:12px;line-height:20px;font-weight:300;">
                      © ${new Date().getFullYear()} The Digital Economist. All rights reserved.<br>
                      If you have any questions, contact us at 
                      <a href="mailto:support@thedigitaleconomist.com" style="color:#004aad;text-decoration:none;">support@thedigitaleconomist.com</a>
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
  };

  try {
    await sgMail.send(msg);
    logger.info({ to }, 'Welcome email sent');
  } catch (err) {
    logger.error({ to, errorMsg: err.message }, 'Failed to send welcome email');
  }
};

/* ─────────────────────────────────────────────
   2. RENEWAL REMINDER EMAIL
   Sent 1 day before membership renews
───────────────────────────────────────────── */
export const sendRenewalReminderEmail = async ({ to, name, renewalDate, amount }) => {
  const msg = {
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Your TDE membership renews tomorrow',
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
                  <td style="background:linear-gradient(180deg,#000000 0%,#003172 100%);padding:48px 48px 40px;">
                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">The Digital Economist</p>
                    <h1 style="margin:0;color:#ffffff;font-size:36px;font-weight:400;line-height:44px;">
                      Renewal reminder
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 48px;background:#000000;">
                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:16px;line-height:26px;font-weight:300;">
                      Hi ${name}, your TDE membership will automatically renew tomorrow.
                    </p>

                    <!-- Renewal box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#000d24;border:0.5px solid #004aad;border-radius:12px;margin-bottom:32px;">
                      <tr>
                        <td style="padding:24px 28px;">
                          <p style="margin:0 0 8px;color:#d9d9d9;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;font-weight:300;">Renewal details</p>
                          <p style="margin:0 0 6px;color:#ffffff;font-size:20px;font-weight:400;">$${amount} / month</p>
                          <p style="margin:0;color:#d9d9d9;font-size:14px;font-weight:300;">Renews on ${renewalDate}</p>
                        </td>
                      </tr>
                    </table>

                    <div style="height:0.5px;background:#d9d9d9;opacity:0.2;margin:32px 0;"></div>

                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:14px;line-height:22px;font-weight:300;">
                      No action is needed if you'd like to continue your membership. If you wish to cancel, you can do so from your profile before the renewal date.
                    </p>

                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#004aad;border-radius:8px;margin-right:12px;">
                          <a href="${process.env.FRONTEND_URL}/profile/membership"
                            style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
                            Manage Subscription
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 48px;border-top:0.5px solid rgba(217,217,217,0.2);">
                    <p style="margin:0;color:#6b7280;font-size:12px;line-height:20px;font-weight:300;">
                      © ${new Date().getFullYear()} The Digital Economist. All rights reserved.<br>
                      <a href="mailto:support@thedigitaleconomist.com" style="color:#004aad;text-decoration:none;">support@thedigitaleconomist.com</a>
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
  };

  try {
    await sgMail.send(msg);
    logger.info({ to }, 'Renewal reminder email sent');
  } catch (err) {
    logger.error({ to, errorMsg: err.message }, 'Failed to send renewal reminder email');
  }
};

/* ─────────────────────────────────────────────
   3. CANCELLATION CONFIRMATION EMAIL
───────────────────────────────────────────── */
export const sendCancellationEmail = async ({ to, name, accessUntil }) => {
  const msg = {
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Your TDE membership has been cancelled',
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
                  <td style="background:linear-gradient(180deg,#000000 0%,#003172 100%);padding:48px 48px 40px;">
                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">The Digital Economist</p>
                    <h1 style="margin:0;color:#ffffff;font-size:36px;font-weight:400;line-height:44px;">
                      Membership cancelled
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 48px;background:#000000;">
                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:16px;line-height:26px;font-weight:300;">
                      Hi ${name}, we've received your cancellation request.
                    </p>

                    <!-- Access box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#000d24;border:0.5px solid rgba(217,217,217,0.3);border-radius:12px;margin-bottom:32px;">
                      <tr>
                        <td style="padding:24px 28px;">
                          <p style="margin:0 0 8px;color:#d9d9d9;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;font-weight:300;">Your access continues until</p>
                          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:400;">${accessUntil}</p>
                        </td>
                      </tr>
                    </table>

                    <div style="height:0.5px;background:#d9d9d9;opacity:0.2;margin:32px 0;"></div>

                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:14px;line-height:22px;font-weight:300;">
                      Changed your mind? You can reactivate your membership at any time before your access ends.
                    </p>

                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#004aad;border-radius:8px;">
                          <a href="${process.env.FRONTEND_URL}/profile/membership"
                            style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
                            Reactivate Membership
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 48px;border-top:0.5px solid rgba(217,217,217,0.2);">
                    <p style="margin:0;color:#6b7280;font-size:12px;line-height:20px;font-weight:300;">
                      © ${new Date().getFullYear()} The Digital Economist. All rights reserved.<br>
                      <a href="mailto:support@thedigitaleconomist.com" style="color:#004aad;text-decoration:none;">support@thedigitaleconomist.com</a>
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
  };

  try {
    await sgMail.send(msg);
    logger.info({ to }, 'Cancellation email sent');
  } catch (err) {
    logger.error({ to, errorMsg: err.message }, 'Failed to send cancellation email');
  }
};

/* ─────────────────────────────────────────────
   4. PAYMENT FAILED EMAIL
───────────────────────────────────────────── */
export const sendPaymentFailedEmail = async ({ to, name }) => {
  const msg = {
    to,
    from: { email: FROM_EMAIL, name: FROM_NAME },
    subject: 'Action required — payment failed for your TDE membership',
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
                  <td style="background:linear-gradient(180deg,#000000 0%,#003172 100%);padding:48px 48px 40px;">
                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">The Digital Economist</p>
                    <h1 style="margin:0;color:#ffffff;font-size:36px;font-weight:400;line-height:44px;">
                      Payment failed
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 48px;background:#000000;">
                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:16px;line-height:26px;font-weight:300;">
                      Hi ${name}, we were unable to process your membership payment.
                    </p>

                    <!-- Warning box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a0000;border:0.5px solid #dc2626;border-radius:12px;margin-bottom:32px;">
                      <tr>
                        <td style="padding:24px 28px;">
                          <p style="margin:0 0 8px;color:#fca5a5;font-size:14px;font-weight:400;">Your membership is at risk</p>
                          <p style="margin:0;color:#d9d9d9;font-size:14px;line-height:22px;font-weight:300;">
                            Please update your payment method to avoid losing access to TDE publications and events.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <div style="height:0.5px;background:#d9d9d9;opacity:0.2;margin:32px 0;"></div>

                    <p style="margin:0 0 24px;color:#d9d9d9;font-size:14px;line-height:22px;font-weight:300;">
                      Stripe will automatically retry your payment. If it continues to fail, your membership will be suspended.
                    </p>

                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#004aad;border-radius:8px;">
                          <a href="${process.env.FRONTEND_URL}/profile/membership"
                            style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
                            Update Payment Method
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 48px;border-top:0.5px solid rgba(217,217,217,0.2);">
                    <p style="margin:0;color:#6b7280;font-size:12px;line-height:20px;font-weight:300;">
                      © ${new Date().getFullYear()} The Digital Economist. All rights reserved.<br>
                      <a href="mailto:support@thedigitaleconomist.com" style="color:#004aad;text-decoration:none;">support@thedigitaleconomist.com</a>
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
  };

  try {
    await sgMail.send(msg);
    logger.info({ to }, 'Payment failed email sent');
  } catch (err) {
    logger.error({ to, errorMsg: err.message }, 'Failed to send payment failed email');
  }
};