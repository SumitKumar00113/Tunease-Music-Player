
const nodemailer = require('nodemailer');
const _config = require("../config/config");

const createTransporter = () => {
  if (_config.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: _config.EMAIL_USER,
        pass: _config.EMAIL_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: _config.EMAIL_USER,
      clientId: _config.GOOGLE_CLIENT_ID,
      clientSecret: _config.GOOGLE_CLIENT_SECRET,
      refreshToken: _config.REFRESH_TOKEN,
    },
  });
};

const transporter = createTransporter();

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error.message || error);
    if (error.message && error.message.includes('invalid_grant')) {
      console.warn('⚠️ Google OAuth token is expired or revoked. Please update REFRESH_TOKEN or configure EMAIL_PASS (App Password) in .env.');
    }
  } else {
    console.log('Email server is ready to send messages');
  }
});// Function to send email
const sendEmail = async (to, subject, text, html) => {
  const info = await transporter.sendMail({
    from: _config.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });

  console.log('Message sent: %s', info.messageId);
  return info;
};

module.exports = sendEmail;