"use strict";
import "dotenv/config";
import * as jwt from "jsonwebtoken";
import messageResponse from "../enums/message.enum";
import ApiException from "./Exceptions/ApiException";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || "";

const jwtToken = {
    signAccessToken: (payload: any, time = "1h") =>
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: time,
        }),
    signRefreshToken: (payload: any, time = "7d") =>
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: time,
        }),
    verifyAccessToken: (token: any) => {
        token = token.replace("Bearer ", "");
        try {
            const data = jwt.verify(token, JWT_SECRET);
            return data;
        } catch (e) {
            if (e.name === "TokenExpiredError") throw new ApiException(messageResponse.TOKEN_EXPIRED, 401);
            throw new ApiException(messageResponse.TOKEN_INVALID, 401);
        }
    },
    verifyRefreshToken: (token: any) => {
        const data = jwt.verify(token, JWT_SECRET_REFRESH);
        const currentTime = Date.now() / 1000;

        if (data.exp < currentTime) {
            throw new ApiException(messageResponse.TOKEN_EXPIRED, 401);
        } else if (data.iat > currentTime) {
            throw new ApiException(messageResponse.TOKEN_INVALID, 401);
        }
    },
    decode: (token: any) => jwt.decode(token),
};

export default jwtToken;
