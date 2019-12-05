import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { nodemailerConfig } from '../config';
const { user, pass } = nodemailerConfig;
const transportOptions = smtpTransport({
    auth: { pass, user },
    port: 25, secure: false, service: 'gmail',
    tls: {
        rejectUnauthorized: false,
    },
});
class EmailService {
    constructor() {
        this.emailClient = nodemailer.createTransport(transportOptions);
    }

    async sendText(to, subject, text) {
        const res = await this.emailClient.sendMail({
            from: user,
            subject, text, to,
        });
        return res;
    }
}
export default new EmailService();
