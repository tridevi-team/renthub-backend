"use strict";
import mailConfig from "../config/mail.config";
import "dotenv/config";

const sendMail = async (to: string, subject: string, text: string, html = "") => {
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

export default sendMail;
