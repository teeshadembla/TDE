import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // yourgmail@gmail.com
    pass: process.env.EMAIL_PASS       // 16-character App Password
  }
});

const sendApprovalEmail = async ({ to, name, status, fellowshipName }) => {
  const subject = `Fellowship Application ${status}`;
  const html = `
    <p>Dear ${name},</p>
    <p>Your application for the "<strong>${fellowshipName}</strong>" fellowship has been <strong>${status.toLowerCase()}</strong>.</p>
    <p>Thank you for applying.</p>
  `;

  await transporter.sendMail({
    from: `"The Digital Economist" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

export default sendApprovalEmail;