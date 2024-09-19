"use strict";

import redisClient from "../config/redis.config";
import messageResponse from "../enums/message.enum";
import { UserService } from "../services";
import { ApiException, apiResponse, bcrypt, Exception, sendMail } from "../utils";

class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getUsers();
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
            const user = await UserService.login(username, password);
            res.cookie("accessToken", user.token.refreshToken, { httpOnly: true });
            const userInfo = { ...user, token: user.token.accessToken };
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
                full_name: fullName.trim(),
                password: hashPassword,
                phone_number: phoneNumber?.trim(),
                gender,
                birthday: birthday || "1970-01-01",
                address: address || "",
            };

            const user = await UserService.createUser(newUser);

            if (user) {
                let verifyCode = Math.floor(1000 + Math.random() * 9000);
                while (verifyCode.toString().length !== 4) {
                    verifyCode = Math.floor(1000 + Math.random() * 9000);
                }

                const redis = await redisClient;
                await redis.set(`verify-account:${user.email}`, verifyCode);
                await redis.expire(`verify-account:${user.email}`, parseInt(process.env.REDIS_EXPIRE_TIME));

                const mail = await sendMail(user.email, "Verify your account", `Your verification code is: ${verifyCode}`);
                if (mail) {
                    return res.status(200).json(apiResponse(messageResponse.CHECK_EMAIL_VERIFY_ACCOUNT, true, null));
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
            const result = await UserService.verifyAccount({ email, verifyCode });
            return res.status(200).json(apiResponse(messageResponse.ACCOUNT_VERIFIED_SUCCESSFULLY, true, null));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async resendCode(req, res) {
        try {
            const { email } = req.body;
            await UserService.resendCode(email);
            return res.status(200).json(apiResponse(messageResponse.CHECK_EMAIL_VERIFY_ACCOUNT, true, null));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            await UserService.forgotPassword(email);
            return res.status(200).json(apiResponse(messageResponse.CHECK_EMAIL_RESET_PASSWORD, true, null));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async resetPassword(req, res) {
        try {
            const { code, email, password } = req.body;

            const user = await UserService.resetPassword({ code, email, password });

            return res.status(200).json(apiResponse(messageResponse.PASSWORD_RESET_SUCCESS, true, null));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updatePassword(req, res) {
        const userInfo = req.user;
        const { email } = userInfo;
        const { oldPassword, newPassword } = req.body;
        try {
            const verifyOldPassword = UserService.verifyPassword(email, oldPassword);

            // change password
            const changePassword = UserService.changePassword(email, newPassword);

            return res.status(200).json(apiResponse(messageResponse.PASSWORD_UPDATE_SUCCESS, true, null));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateProfile(req, res) {
        const { fullName, phoneNumber, birthday } = req.body;
        const user = req.user;
        try {
            const updateInfo = await UserService.updateProfile(user.id, { email: user.email, full_name: fullName, phone_number: phoneNumber, birthday });
            return res.status(200).json(apiResponse(messageResponse.PROFILE_UPDATE_SUCCESS, true, null));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async firstLogin(req, res) {
        const { user } = req;
        try {
            const userUpdate = await UserService.updateFirstLoginStatus(user.id);
            return res.status(200).json(apiResponse(messageResponse.FIRST_LOGIN_STATUS_UPDATE_SUCCESS, true, null));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default UserController;
