"use strict";

import { JwtPayload } from "jsonwebtoken";
import redisClient from "../config/redis.config";
import { messageResponse } from "../enums";
import { RefreshTokenPayload, RefreshTokenRenterPayload } from "../interfaces";
import { Renters, Users } from "../models";
import { RenterService, UserService } from "../services";
import MailService from "../services/mail.service";
import { ApiException, apiResponse, bcrypt, Exception, jwtToken, RedisUtils } from "../utils";

const REDIS_EXPIRE_REFRESH_TOKEN = 604800; // 7 days

class UserController {
    static async getAllUsers(req, res) {
        // const user = req.user;
        try {
            // if (user.role !== AccountRoles.ADMIN) {
            //     throw new ApiException(messageResponse.PERMISSION_DENIED, 403);
            // }
            const users = await UserService.getUsers();
            return res.status(200).json(apiResponse(messageResponse.GET_USERS_LIST_SUCCESS, true, users));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async search(req, res) {
        const { q } = req.query;
        try {
            const users = await UserService.search(q);
            return res.status(200).json(apiResponse(messageResponse.GET_USERS_LIST_SUCCESS, true, users));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getUserByHouseId(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination = {} } = req.query;

        try {
            const users = await UserService.getUserInHouse(houseId, {
                filter,
                sort,
                pagination,
            });
            return res.status(200).json(apiResponse(messageResponse.GET_USERS_LIST_SUCCESS, true, users));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getUserInfo(req, res) {
        const user = req.user;
        try {
            const userInfo = await UserService.getUserById(user.id);

            return res.status(200).json(apiResponse(messageResponse.GET_USER_SUCCESS, true, userInfo));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async login(req, res) {
        const { username, password } = req.body;
        try {
            // const decryptPassword = aesDecrypt(password);
            // const user = await UserService.login(username, decryptPassword);
            const userData = await UserService.login(username, password);
            res.cookie("refreshToken", userData.token.refreshToken);
            const userInfo = {
                id: userData.user.id,
                email: userData.user.email,
                fullName: userData.user.fullName,
                gender: userData.user.gender,
                phoneNumber: userData.user.phoneNumber,
                address: userData.user.address,
                birthday: userData.user.birthday,
                role: userData.user.role,
                type: userData.user.type,
                status: userData.user.status,
                verify: userData.user.verify,
                firstLogin: userData.user.firstLogin,
                accessToken: userData.token.accessToken,
                refreshToken: userData.token.refreshToken,
                houses: userData.houses,
            };

            const redisKey = `users:${userInfo.id}:${userData.token.refreshToken}`;
            await RedisUtils.setString(redisKey, userData.token.accessToken, REDIS_EXPIRE_REFRESH_TOKEN);

            return res.status(200).json(apiResponse(messageResponse.LOGIN_SUCCESS, true, userInfo));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async signup(req, res) {
        try {
            const { email, password, fullName, gender, phoneNumber, birthday, address } = req.body;

            // const decryptPassword = aesDecrypt(password);
            // const hashPassword = await bcrypt.hash(decryptPassword.trim());
            const hashPassword = await bcrypt.hash(password.trim());
            const newUser = {
                email: email.toLowerCase().trim(),
                fullName: fullName.trim(),
                password: hashPassword,
                phoneNumber: phoneNumber?.trim(),
                gender,
                birthday: birthday || "1970-01-01",
                address: address || "",
            };

            const user = await UserService.createUser(newUser);

            if (user) {
                const verifyCode = String(Math.floor(1000 + Math.random() * 9000));

                const redis = await redisClient;
                await redis.set(`verify-account:${user.email}`, verifyCode);
                await redis.expire(`verify-account:${user.email}`, parseInt(process.env.REDIS_EXPIRE_TIME || "300"));

                const mail = await MailService.sendVerificationMail(user.email, verifyCode);
                if (mail) {
                    return res.status(200).json(apiResponse(messageResponse.CHECK_EMAIL_VERIFY_ACCOUNT, true, {}));
                } else {
                    throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 200);
                }
            } else {
                throw new ApiException(messageResponse.FAILED_CREATE_USER, 200);
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async verifyAccount(req, res) {
        try {
            const { verifyCode, email } = req.body;
            await UserService.verifyAccount({
                email,
                verifyCode,
            });
            return res.status(200).json(apiResponse(messageResponse.ACCOUNT_VERIFIED_SUCCESSFULLY, true, {}));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async resendCode(req, res) {
        const { email } = req.body;
        try {
            const verifyCode = String(Math.floor(1000 + Math.random() * 9000));
            await MailService.sendVerificationMail(email, verifyCode);
            return res.status(200).json(apiResponse(messageResponse.CHECK_EMAIL_VERIFY_ACCOUNT, true, {}));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            await UserService.getUserByEmail(email);

            const verifyCode = String(Math.floor(1000 + Math.random() * 9000));
            await MailService.sendResetPasswordMail(email, verifyCode);

            const redis = await redisClient;
            await redis.set(`reset-password:${email}`, verifyCode);
            await redis.expire(`reset-password:${email}`, parseInt(process.env.REDIS_EXPIRE_TIME || "300"));

            return res.status(200).json(apiResponse(messageResponse.CHECK_EMAIL_RESET_PASSWORD, true, {}));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async resetPassword(req, res) {
        try {
            const { code, email, password } = req.body;
            await UserService.getUserByEmail(email);
            const isReset = await UserService.resetPassword({
                code,
                email,
                password,
            });
            if (!isReset) {
                throw new ApiException(messageResponse.INVALID_VERIFICATION_CODE, 401);
            }
            return res.status(200).json(apiResponse(messageResponse.PASSWORD_RESET_SUCCESS, true, {}));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updatePassword(req, res) {
        const userInfo = req.user;
        const { email } = userInfo;
        const { oldPassword, newPassword } = req.body;
        try {
            await UserService.verifyPassword(email, oldPassword);

            // change password
            await UserService.changePassword(email, newPassword);

            return res.status(200).json(apiResponse(messageResponse.PASSWORD_UPDATE_SUCCESS, true, {}));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateProfile(req, res) {
        const { fullName, phoneNumber, birthday, address, gender } = req.body;
        const user = req.user;
        try {
            const updateInfo = await UserService.updateProfile(user.id, {
                fullName,
                phoneNumber,
                birthday,
                address,
                gender,
            });
            return res.status(200).json(apiResponse(messageResponse.PROFILE_UPDATE_SUCCESS, true, updateInfo));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async firstLogin(req, res) {
        const { user } = req;
        try {
            await UserService.updateFirstLoginStatus(user.id);
            return res.status(200).json(apiResponse(messageResponse.FIRST_LOGIN_STATUS_UPDATE_SUCCESS, true, {}));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async refreshToken(req, res) {
        const { refreshToken } = req.body;
        const { authorization } = req.headers;

        const accessToken = authorization?.split(" ")[1];

        try {
            // verify refresh token
            const payload = jwtToken.verifyRefreshToken(refreshToken);

            const isRenter = (payload as JwtPayload).role === "renter";
            const redisKey = isRenter
                ? `renters:${(payload as RefreshTokenRenterPayload).id}:${refreshToken}`
                : `users:${(payload as RefreshTokenPayload).id}:${refreshToken}`;

            const aToken = await RedisUtils.getString(redisKey);

            if (aToken !== accessToken) throw new ApiException(messageResponse.TOKEN_INVALID, 401);

            // sign new access token
            const user: Renters | Users = isRenter
                ? await RenterService.getById((payload as RefreshTokenRenterPayload).id)
                : await UserService.getUserById((payload as RefreshTokenPayload).id);

            const newAccessToken = isRenter
                ? await RenterService.generateAccessToken({
                      id: user.id,
                      email: user.email,
                      phoneNumber: user.phoneNumber,
                      roomId: (user as Renters).roomId,
                  })
                : await UserService.generateAccessToken({
                      id: user.id,
                      email: user.email,
                      fullName: (user as Users).fullName,
                      phoneNumber: user.phoneNumber,
                      role: (user as Users).role,
                      status: (user as Users).status,
                  });

            // set new access token in redis
            const getTTL = await RedisUtils.getTTL(redisKey);
            await RedisUtils.setString(redisKey, newAccessToken, getTTL);

            return res.send(apiResponse(messageResponse.REFRESH_TOKEN_SUCCESS, true, { accessToken: newAccessToken }));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async logout(req, res) {
        const { refreshToken } = req.body;
        const { authorization } = req.headers;
        const user = req.user;

        const accessToken = authorization?.split(" ")[1];

        try {
            // verify refresh token
            jwtToken.verifyRefreshToken(refreshToken);

            // check in redis
            const redisKey = `users:${user.id}:${refreshToken}`;
            const aToken = await RedisUtils.getString(redisKey);

            if (aToken !== accessToken) {
                throw new ApiException(messageResponse.TOKEN_INVALID, 401);
            }

            // delete refresh token in redis
            await RedisUtils.deleteString(redisKey);

            return res.send(apiResponse(messageResponse.LOGOUT_SUCCESS, true, {}));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default UserController;
