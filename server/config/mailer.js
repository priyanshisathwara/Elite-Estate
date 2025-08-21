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
 * Sends an email using nodemailer
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} text - email body text
 */

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,  // Corrected to use the function parameter
        subject: subject,
        text: text
    };

    console.log("to email", to)

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

export class Mail {
    constructor() {
        this.mailOptions = {
            from: {
                address: process.env.EMAIL_USER,
                name: "Vacation Rental",
            },
        };
    }

    /**
     * Sets the company name
     * @param {string} name - Name of the company
     */
    setCompanyName(name) {
        this.mailOptions.from.name = name;
    }

    /**
     * Sets the sender email
     * @param {string} email - Email of the sender
     */
    setSenderEmail(email) {
        this.mailOptions.from.address = email;
    }

    /**
     * Sets the recipient email
     * @param {string} receiver - Receiver's email address
     */
    setTo(receiver) {
        this.mailOptions.to = receiver;
    }

    /**
     * Sets the email subject
     * @param {string} subject - Email subject
     */
    setSubject(subject) {
        this.mailOptions.subject = subject;
    }

    /**
     * Sets the email text content
     * @param {string} text - Email body text
     */
    setText(text) {
        this.mailOptions.text = text;
    }

    /**
     * Sends the email
     */
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
