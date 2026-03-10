export const fellowshipReviewEmailTemplate = ({
  name,
  fellowshipName,
  action,
  paymentAmount,
  dashboardUrl,
}) => {
  const isApproved = action === "APPROVED";

  return {
    subject: isApproved
      ? "Fellowship Application Approved"
      : "Fellowship Application Update",

    html: `
      <div style="font-family: Arial, sans-serif; background-color:#f9fafb; padding: 24px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:24px; border-radius:8px;">
          
          <h2 style="color:#111827; margin-bottom:16px;">
            ${
              isApproved
                ? `Congratulations, ${name}!`
                : `Application Update`
            }
          </h2>

          <p style="color:#374151; font-size:15px;">
            ${
              isApproved
                ? `Your application for <strong>${fellowshipName}</strong> has been 
                   <span style="color:#16a34a; font-weight:600;">approved</span>.`
                : `Hi ${name},<br/><br/>
                   Thank you for applying to <strong>${fellowshipName}</strong>.
                   After careful review, we regret to inform you that your application
                   has been <span style="color:#dc2626; font-weight:600;">not selected</span> for this cycle.`
            }
          </p>

          ${
            isApproved
              ? `
              <div style="background:#f3f4f6; padding:16px; border-radius:6px; margin:20px 0;">
                <p style="margin:0; font-size:14px; color:#111827;">
                  <strong>Program Fee:</strong> ₹${paymentAmount}
                </p>
              </div>

              <p style="font-size:14px; color:#374151;">
                To confirm your seat and proceed with payment, please visit your dashboard:
              </p>

              <div style="text-align:center; margin:24px 0;">
                <a href="${dashboardUrl}" 
                   style="background:#111827; color:#ffffff; padding:12px 20px; 
                          text-decoration:none; border-radius:6px; font-size:14px; 
                          font-weight:600; display:inline-block;">
                  Go to Dashboard & Complete Payment
                </a>
              </div>

              <p style="font-size:12px; color:#2563eb; word-break:break-all;">
                ${dashboardUrl}
              </p>
              `
              : `
              <p style="font-size:14px; color:#4b5563; margin-top:16px;">
                We encourage you to apply again in future cycles.
              </p>
              `
          }

          <hr style="margin:24px 0; border:none; border-top:1px solid #e5e7eb;" />

          <p style="font-size:12px; color:#6b7280;">
            The Digital Economist Team
          </p>
        </div>
      </div>
    `,
  };
};