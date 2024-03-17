const nodemailer = require("nodemailer");

class OrderMailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            service: process.env.SMPT_SERVICE,
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD,
            },
        });
    }

    async sendOrderConfirmation(options) {
        try {
            const mailOptions = {
                from: process.env.SMPT_MAIL,
                to: options.email,
                subject: options.subject,
                html: options.html,
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error("Failed to send order confirmation email.");
        }
    }
}

module.exports = OrderMailer;
