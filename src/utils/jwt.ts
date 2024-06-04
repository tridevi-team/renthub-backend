"use strict";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "";

const jwtToken = {
    sign: (payload: any, time = "10h") =>
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: time,
        }),
    verify: (token: any) => jwt.verify(token, JWT_SECRET),
    decode: (token: any) => jwt.decode(token),
};

export default jwtToken;
