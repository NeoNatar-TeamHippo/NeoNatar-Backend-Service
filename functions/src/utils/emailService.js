const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const { nodemailerConfig } = require('../config');
const { user, pass } = nodemailerConfig;
const transportOptions = smtpTransport({
    auth: { pass, user },
    port: 25, secure: false, service: 'gmail',
    tls: {
        rejectUnauthorized: false,
    },
});
const emailClient = nodemailer.createTransport(transportOptions);

const sendText = async (to, subject, text) => {
    try {
        const res = await emailClient.sendMail({
            from: user,
            subject, text, to,
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    sendText,
};
