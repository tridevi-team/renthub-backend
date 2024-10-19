"use strict";
import "dotenv/config";
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: 465,
    auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
    sercure: true,
    tls: {
        rejectUnauthorized: false,
    },
    dkim: {
        domainName: "default._domainkey.tmquang.com.",
        keySelector: "default",
        privateKey: process.env.PRIVATE_KEY_EMAIL,
    },
});

export default transporter;
