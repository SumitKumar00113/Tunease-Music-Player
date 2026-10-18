import nodemailer, { Transporter, SentMessageInfo } from "nodemailer";
import _config from "../config/config";

const createTransporter = (): Transporter => {
  if (_config.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: _config.EMAIL_USER,
        pass: _config.EMAIL_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: _config.EMAIL_USER,
      clientId: _config.GOOGLE_CLIENT_ID,
      clientSecret: _config.GOOGLE_CLIENT_SECRET,
      refreshToken: _config.REFRESH_TOKEN,
    },
  });
};

const transporter = createTransporter();

transporter.verify((error: Error | null) => {
  if (error) {
    console.error("Error connecting to email server:", error.message || error);
    if (error.message && error.message.includes("invalid_grant")) {
      console.warn(
        "⚠️ Google OAuth token is expired or revoked. Please update REFRESH_TOKEN or configure EMAIL_PASS (App Password) in .env."
      );
    }
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<SentMessageInfo> => {
  const info = await transporter.sendMail({
    from: _config.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
};

export default sendEmail;
module.exports = sendEmail;
