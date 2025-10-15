// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'you@example.com',
    pass: process.env.SMTP_PASS || 'password'
  }
});

function sendEmail(to, subject, html){
  return transporter.sendMail({ from: process.env.SMTP_FROM || 'Site <no-reply@site.com>', to, subject, html });
}

module.exports = { sendEmail };
