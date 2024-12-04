"use strict";
import "dotenv/config";
import * as jwt from "jsonwebtoken";
import messageResponse from "../enums/message.enum";
import {
    AccessTokenPayload,
    AccessTokenRenterPayload,
    RefreshTokenPayload,
    RefreshTokenRenterPayload,
} from "../interfaces";
import ApiException from "./Exceptions/ApiException";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || "";
const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "1h";
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || "7d";

const jwtToken = {
    signAccessToken: (payload: AccessTokenPayload | AccessTokenRenterPayload, time = ACCESS_TOKEN_EXPIRE) =>
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: time,
        }),
    signRefreshToken: (payload: RefreshTokenPayload | RefreshTokenRenterPayload, time = REFRESH_TOKEN_EXPIRE) =>
        jwt.sign(payload, JWT_SECRET_REFRESH, {
            expiresIn: time,
        }),
    verifyAccessToken: (token: string) => {
        token = token.replace("Bearer ", "");
        try {
            const data = jwt.verify(token, JWT_SECRET);
            return data;
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError)
                if (e.message === "jwt expired") throw new ApiException(messageResponse.TOKEN_EXPIRED, 401);

            throw new ApiException(messageResponse.TOKEN_INVALID, 401);
        }
    },
    verifyRefreshToken: (token: string) => {
        try {
            const data = jwt.verify(token, JWT_SECRET_REFRESH);
            return data;
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError)
                if (err.message === "jwt expired") throw new ApiException(messageResponse.TOKEN_EXPIRED, 401);

            throw new ApiException(messageResponse.TOKEN_INVALID, 401);
        }
    },
};

export default jwtToken;
