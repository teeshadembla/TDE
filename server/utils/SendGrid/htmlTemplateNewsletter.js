export const newsletterSubscriptionTemplate = ({
  dashboardUrl,
  eventsUrl,
  publicationsUrl,
  fellowshipUrl,
}) => {
  return (    `
      <div style="font-family: Arial, sans-serif; background-color:#f9fafb; padding: 24px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:24px; border-radius:8px;">
          

          <p style="color:#374151; font-size:15px;">
            You’ve successfully subscribed to The Digital Economist newsletter.
            You’ll now receive updates on events, research, fellowships, and community initiatives.
          </p>

          <p style="color:#374151; font-size:15px; margin-top:18px;">
            You can explore everything from your dashboard and key sections below:
          </p>

          <div style="margin:24px 0;">

            <div style="margin-bottom:12px;">
              <a href="${dashboardUrl}" 
                 style="background:#111827; color:#ffffff; padding:12px 18px; 
                        text-decoration:none; border-radius:6px; font-size:14px; 
                        font-weight:600; display:inline-block;">
                Go to Dashboard
              </a>
            </div>

            <div style="margin-bottom:12px;">
              <a href="${eventsUrl}" 
                 style="background:#2563eb; color:#ffffff; padding:12px 18px; 
                        text-decoration:none; border-radius:6px; font-size:14px; 
                        font-weight:600; display:inline-block;">
                Explore Events
              </a>
            </div>

            <div style="margin-bottom:12px;">
              <a href="${publicationsUrl}" 
                 style="background:#059669; color:#ffffff; padding:12px 18px; 
                        text-decoration:none; border-radius:6px; font-size:14px; 
                        font-weight:600; display:inline-block;">
                View Publications
              </a>
            </div>

            <div style="margin-bottom:12px;">
              <a href="${fellowshipUrl}" 
                 style="background:#7c3aed; color:#ffffff; padding:12px 18px; 
                        text-decoration:none; border-radius:6px; font-size:14px; 
                        font-weight:600; display:inline-block;">
                Apply for Fellowships
              </a>
            </div>

          </div>

          <p style="font-size:13px; color:#6b7280;">
            If any button doesn’t work, copy and paste the links below into your browser:
          </p>

          <p style="font-size:12px; color:#2563eb; word-break:break-all;">
            Dashboard: ${dashboardUrl}<br/>
            Events: ${eventsUrl}<br/>
            Publications: ${publicationsUrl}<br/>
            Fellowships: ${fellowshipUrl}
          </p>

          <hr style="margin:24px 0; border:none; border-top:1px solid #e5e7eb;" />

          <p style="font-size:12px; color:#6b7280;">
            The Digital Economist Team
          </p>
        </div>
      </div>
    `)
};