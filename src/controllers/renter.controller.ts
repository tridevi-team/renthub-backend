"use strict";

import redisConfig from "../config/redis.config";
import messageResponse from "../enums/message.enum";
import { RenterService } from "../services";
import { apiResponse, Exception, sendMail } from "../utils";

class RenterController {
    static async addNewRenter(req, res) {
        const { roomId } = req.params;
        const user = req.user;
        const { name, citizenId, birthday, gender, email, phoneNumber, address, tempReg, moveInDate, represent, note } = req.body;
        try {
            // check max renter
            const data = {
                roomId,
                name,
                citizenId,
                birthday,
                gender,
                email,
                phoneNumber,
                address,
                tempReg,
                moveInDate,
                represent,
                note,
                createdBy: user.id,
            };
            const createRenter = await RenterService.create(data);
            return res.json(apiResponse(messageResponse.CREATE_RENTER_SUCCESS, true, createRenter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRentersByRoom(req, res) {
        const { roomId } = req.params;
        try {
            const renters = await RenterService.listByRoom(roomId);
            return res.json(apiResponse(messageResponse.GET_RENTERS_BY_ROOM_SUCCESS, true, renters));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRentersByHouse(req, res) {
        const { houseId } = req.params;
        const { page, limit } = req.query;
        try {
            const renters = await RenterService.listByHouse(houseId, { page: parseInt(page), limit: parseInt(limit) });
            return res.json(apiResponse(messageResponse.GET_RENTERS_BY_HOUSE_SUCCESS, true, renters));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRenterDetails(req, res) {
        const { renterId } = req.params;
        try {
            const renter = await RenterService.get(renterId);
            return res.json(apiResponse(messageResponse.GET_RENTER_DETAILS_SUCCESS, true, renter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateRenterDetails(req, res) {
        const { renterId } = req.params;
        const user = req.user;
        const { name, citizenId, birthday, gender, email, phoneNumber, address, tempReg, moveInDate, represent, note } = req.body;
        try {
            const data = {
                name,
                citizenId,
                birthday,
                gender,
                email,
                phoneNumber,
                address,
                tempReg,
                moveInDate,
                represent,
                note,
                updatedBy: user.id,
            };

            const updateRenter = await RenterService.update(renterId, data);

            return res.json(apiResponse(messageResponse.UPDATE_RENTER_SUCCESS, true, updateRenter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteRenter(req, res) {
        const { renterId } = req.params;
        try {
            const deleteRenter = await RenterService.delete(renterId);
            return res.json(apiResponse(messageResponse.DELETE_RENTER_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async changeRepresent(req, res) {
        const { renterId } = req.params;
        const user = req.user;
        try {
            const changeRepresent = await RenterService.changeRepresent(renterId, user.id);
            return res.json(apiResponse(messageResponse.CHANGE_REPRESENT_SUCCESS, true, changeRepresent));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async login(req, res) {
        const { email, phoneNumber } = req.body;
        try {
            const login = await RenterService.checkExists({ email, phoneNumber });
            const redis = await redisConfig;
            const code = Math.floor(1000 + Math.random() * 9000);
            const username = email || phoneNumber;
            if (email) {
                const mail = await sendMail(username, "Verify your account", `Your verification code is: ${code}`);
                if (mail) {
                    await redis.set(`verify-renter:${username}`, String(code));
                    return res.json(apiResponse(messageResponse.SEND_CODE_SUCCESS, true));
                }
            } else if (phoneNumber) {
                await redis.set(`verify-renter:${username}`, String(code));
                return res.json(apiResponse(messageResponse.SEND_CODE_SUCCESS, true));
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async resendCode(req, res) {
        const { email, phoneNumber } = req.body;
        try {
            const redis = await redisConfig;
            const code = Math.floor(1000 + Math.random() * 9000);
            const username = email || phoneNumber;
            if (email) {
                const mail = await sendMail(username, "Verify your account", `Your verification code is: ${code}`);
                if (mail) {
                    await redis.set(`verify-renter:${username}`, String(code));
                    return res.json(apiResponse(messageResponse.SEND_CODE_SUCCESS, true));
                }
            } else if (phoneNumber) {
                await redis.set(`verify-renter:${username}`, String(code));
                return res.json(apiResponse(messageResponse.SEND_CODE_SUCCESS, true));
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async verifyLogin(req, res) {
        const { email, phoneNumber, code } = req.body;
        try {
            const redis = await redisConfig;
            const username = email || phoneNumber;
            const verifyCode = await redis.get(`verify-renter:${username}`);
            if (verifyCode === code) {
                await redis.del(`verify-renter:${username}`);
                const renter = await RenterService.login({ email, phoneNumber });
                return res.json(apiResponse(messageResponse.LOGIN_SUCCESS, true, renter));
            }
            return res.json(apiResponse(messageResponse.VERIFY_CODE_FAIL, false));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default RenterController;
