"use strict";
import * as nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: 465,
    service: "gmail",
    auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
});

export default transporter;