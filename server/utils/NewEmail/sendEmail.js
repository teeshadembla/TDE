// src/services/email/sendEmail.js
import { transporter } from "./transporter.js";

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!to || !subject || !html) {
    throw new Error("Missing required email fields");
  }

  return transporter.sendMail({
    from: `"The Digital Economist" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
    text,
  });
};
