"use strict";
import "dotenv/config";
import mailConfig from "../config/mail.config";

const sendMail = async (data: { to: string; subject: string; text?: string; html?: string }) => {
    try {
        const mailOptions = {
            from: process.env.USERNAME_EMAIL,
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
        };

        const result = await mailConfig.sendMail(mailOptions);

        return result;
    } catch (err) {
        return err;
    }
};

export default sendMail;
