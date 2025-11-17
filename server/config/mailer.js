import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using nodemailer (supports both plain text and HTML)
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} message - email body (text or HTML)
 * @param {boolean} isHtml - set to true if message is HTML
 */
const sendMail = (to, subject, message, isHtml = false) => {
  const mailOptions = {
    from: {
      name: "Elite Estate",
      address: process.env.EMAIL_USER,
    },
    to,
    subject,
    ...(isHtml ? { html: message } : { text: message }),
  };

  console.log("📧 Sending email to:", to);

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error sending email:", error);
        reject(error);
      } else {
        console.log("✅ Email sent successfully:", info.response);
        resolve(info);
      }
    });
  });
};

export class Mail {
  constructor() {
    this.mailOptions = {
      from: {
        address: process.env.EMAIL_USER,
        name: "Elite Estate",
      },
    };
  }

  setCompanyName(name) {
    this.mailOptions.from.name = name;
  }

  setSenderEmail(email) {
    this.mailOptions.from.address = email;
  }

  setTo(receiver) {
    this.mailOptions.to = receiver;
  }

  setSubject(subject) {
    this.mailOptions.subject = subject;
  }

  setText(text) {
    this.mailOptions.text = text;
  }

  setHtml(html) {
    this.mailOptions.html = html;
  }

  send() {
    transporter.sendMail(this.mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }
}

export default sendMail;
