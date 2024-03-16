const mailConfig = require("../config/mailConfig");

const sendMail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.USERNAME_EMAIL,
            to,
            subject,
            text,
            html,
        };

        const result = await mailConfig.sendMail(mailOptions);

        return result;
    } catch (err) {
        return err;
    }
};

module.exports = sendMail;