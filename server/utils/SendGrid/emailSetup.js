import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);

const msg = {
  to: 'teeshadembla@gmail.com', // Change to your recipient
  from: 'teesha@thedigitaleconomist.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

export default sgMail;

