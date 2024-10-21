"use strict";

import redisConfig from "../config/redis.config";
import { messageResponse } from "../enums";
import { RenterService } from "../services";
import MailService from "../services/mail.service";
import { ApiException, apiResponse, Exception, RedisUtils } from "../utils";

const prefix = "renters";
const cachePattern = `${prefix}:*`;
class RenterController {
    static async addNewRenter(req, res) {
        const { roomId } = req.params;
        const user = req.user;
        const { name, citizenId, birthday, gender, email, phoneNumber, address, tempReg, moveInDate, represent, note } =
            req.body;

        try {
            // check max renter
            const data = {
                roomId,
                name,
                citizenId,
                birthday: birthday,
                gender: gender || "other",
                email: email || null,
                phoneNumber: phoneNumber || null,
                address: address || null,
                tempReg: tempReg || false,
                moveInDate: moveInDate || null,
                represent: represent || false,
                note: note,
                createdBy: user.id,
            };
            const createRenter = await RenterService.create(data);

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.CREATE_RENTER_SUCCESS, true, createRenter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRentersByRoom(req, res) {
        const { roomId } = req.params;
        const { filter = [], sort = [], pagination = {} } = req.query;
        const cacheKey = RedisUtils.generateCacheKeyWithFilter(prefix + `:getRentersByRoom_${roomId}`, {
            filter,
            sort,
            pagination,
        });
        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const renters = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_RENTERS_BY_ROOM_SUCCESS, true, JSON.parse(renters[0])));
            }

            const renters = await RenterService.listByRoom(roomId, {
                filter,
                sort,
                pagination,
            });

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(renters));

            return res.json(apiResponse(messageResponse.GET_RENTERS_BY_ROOM_SUCCESS, true, renters));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRentersByHouse(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination = {} } = req.query;
        const cacheKey = RedisUtils.generateCacheKeyWithFilter(prefix + `:getRentersByHouse_${houseId}`, {
            filter,
            sort,
            pagination,
        });
        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const renters = await RedisUtils.getSetMembers(cacheKey);
                return res.json(
                    apiResponse(messageResponse.GET_RENTERS_BY_HOUSE_SUCCESS, true, JSON.parse(renters[0]))
                );
            }

            const renters = await RenterService.listByHouse(houseId, {
                filter,
                sort,
                pagination,
            });

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(renters));

            return res.json(apiResponse(messageResponse.GET_RENTERS_BY_HOUSE_SUCCESS, true, renters));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRenterDetails(req, res) {
        const { renterId } = req.params;

        const cacheKey = RedisUtils.generateCacheKeyWithId(prefix, renterId, "details");
        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const renter = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_RENTER_DETAILS_SUCCESS, true, renter));
            }

            const renter = await RenterService.getById(renterId);

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(renter));

            return res.json(apiResponse(messageResponse.GET_RENTER_DETAILS_SUCCESS, true, renter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateRenterDetails(req, res) {
        const { renterId } = req.params;
        const user = req.user;
        const { name, citizenId, birthday, gender, email, phoneNumber, address, tempReg, moveInDate, represent, note } =
            req.body;
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

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.UPDATE_RENTER_SUCCESS, true, updateRenter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteRenter(req, res) {
        const { renterId } = req.params;
        try {
            await RenterService.delete(renterId);

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

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

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.CHANGE_REPRESENT_SUCCESS, true, changeRepresent));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async login(req, res) {
        const { email, phoneNumber } = req.body;
        try {
            if (!email && !phoneNumber) {
                throw new ApiException(messageResponse.VALIDATION_ERROR, 400);
            }
            const renterDetails = await RenterService.checkExists({
                email,
                phoneNumber,
            });
            const redis = await redisConfig;
            const code = Math.floor(1000 + Math.random() * 9000);
            const username = email || phoneNumber;
            if (email) {
                await MailService.sendLoginMail(email, renterDetails.name, String(code));
            } else if (phoneNumber) {
                // send code to phone number
            }
            await redis.set(`verify-renter:${username}`, String(code));
            await redis.expire(`verify-renter:${username}`, 300);

            return res.json(apiResponse(messageResponse.SEND_CODE_SUCCESS, true));
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
            const renterDetails = await RenterService.checkExists({
                email,
                phoneNumber,
            });
            if (email) {
                await MailService.sendLoginMail(email, renterDetails.name, String(code));
            } else if (phoneNumber) {
                // send code to phone
            }
            await redis.set(`verify-renter:${username}`, String(code));
            return res.json(apiResponse(messageResponse.SEND_CODE_SUCCESS, true));
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
            if (verifyCode !== code) {
                throw new ApiException(messageResponse.INVALID_VERIFICATION_CODE, 401);
            }
            await redis.del(`verify-renter:${username}`);
            const renter = await RenterService.login({
                email,
                phoneNumber,
            });
            return res.json(apiResponse(messageResponse.LOGIN_SUCCESS, true, renter));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default RenterController;
