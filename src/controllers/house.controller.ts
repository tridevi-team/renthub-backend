"use strict";
import { messageResponse } from "../enums";
import { HouseService } from "../services";
import { ApiException, apiResponse, Exception, RedisUtils } from "../utils";

const prefix = "houses";

class HouseController {
    static async createHouse(req, res) {
        const user = req.user;
        try {
            const house = await HouseService.create({
                ...req.body,
                createdBy: user.id,
            });

            // delete cache
            const detailsCache = `${prefix}:*`;
            await RedisUtils.deletePattern(detailsCache);

            return res.json(apiResponse(messageResponse.CREATE_HOUSE_SUCCESS, true, house));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getHouseList(req, res) {
        const user = req.user;
        const { filter = [], sort = [], pagination = {} } = req.query;

        const cacheKey = RedisUtils.generateCacheKeyWithFilter(prefix + ":list", { filter, sort, pagination });

        try {
            const isCacheExists = await RedisUtils.isExists(cacheKey);
            if (isCacheExists) {
                const result = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_HOUSE_LIST_SUCCESS, true, JSON.parse(result[0])));
            }

            const list = await HouseService.getHouseByUser(user.id, {
                filter,
                sort,
                pagination,
            });

            if (!list) throw new ApiException(messageResponse.NO_HOUSES_FOUND, 404);

            await RedisUtils.setAddMember(cacheKey, JSON.stringify(list));

            return res.json(apiResponse(messageResponse.GET_HOUSE_LIST_SUCCESS, true, list));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getHouseDetails(req, res) {
        const { houseId } = req.params;
        try {
            const cacheKey = RedisUtils.generateCacheKeyWithId(prefix, houseId, "details");
            const isRedisExists = await RedisUtils.isExists(cacheKey);
            if (isRedisExists) {
                const result = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_HOUSE_DETAILS_SUCCESS, true, JSON.parse(result[0])));
            }

            const details = await HouseService.getHouseById(houseId);
            RedisUtils.setAddMember(cacheKey, JSON.stringify(details));

            return res.json(apiResponse(messageResponse.GET_HOUSE_DETAILS_SUCCESS, true, details));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getHouseWithRooms(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination = {}, isSelect } = req.query;
        const isApp = req.isApp;

        try {
            // cache
            const roomCache = RedisUtils.generateCacheKeyWithFilter(
                `${prefix}:getRooms_${isSelect}_${isApp}:${houseId}`,
                {
                    filter,
                    sort,
                    pagination,
                }
            );

            const isRedisExists = await RedisUtils.isExists(roomCache);
            if (isRedisExists) {
                const result = await RedisUtils.getSetMembers(roomCache);
                return res.json(apiResponse(messageResponse.GET_ROOMS_BY_HOUSE_SUCCESS, true, JSON.parse(result[0])));
            }

            const details = isApp
                ? await HouseService.getHouseWithRoomsGraph(houseId)
                : await HouseService.getHouseWithRooms(
                      houseId,
                      {
                          filter,
                          sort,
                          pagination,
                      },
                      isSelect
                  );
            await RedisUtils.setAddMember(roomCache, JSON.stringify(details));

            return res.json(apiResponse(messageResponse.GET_ROOMS_BY_HOUSE_SUCCESS, true, details));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateHouseDetails(req, res) {
        const { houseId } = req.params;
        const { user } = req;
        const { name, address, description, collectionCycle, invoiceDate, numCollectDays } = req.body;
        try {
            const data = {
                name,
                address,
                description: description,
                collectionCycle,
                invoiceDate,
                numCollectDays,
                updatedBy: user.id,
            };
            const update = await HouseService.update(houseId, data);
            if (!update) throw new ApiException(messageResponse.UPDATE_HOUSE_FAIL, 500);

            // delete cache
            const detailsCache = `${prefix}:*`;
            await RedisUtils.deletePattern(detailsCache);

            return res.json(apiResponse(messageResponse.UPDATE_HOUSE_SUCCESS, true, update));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateHouseStatus(req, res) {
        const { houseId } = req.params;
        try {
            const isUpdate = await HouseService.updateStatus(houseId, req.body.status);
            if (!isUpdate) throw new ApiException(messageResponse.UPDATE_HOUSE_STATUS_FAIL, 500);

            // delete cache
            const detailsCache = `${prefix}:*`;
            await RedisUtils.deletePattern(detailsCache);

            return res.json(apiResponse(messageResponse.UPDATE_HOUSE_STATUS_SUCCESS, true, isUpdate));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteHouse(req, res) {
        const { houseId } = req.params;
        try {
            const isDelete = await HouseService.delete(houseId);
            if (!isDelete) throw new ApiException(messageResponse.DELETE_HOUSE_FAIL, 500);

            // delete cache
            const detailsCache = `${prefix}:*`;
            await RedisUtils.deletePattern(detailsCache);

            return res.json(apiResponse(messageResponse.DELETE_HOUSE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async searchHouse(req, res) {
        const { filter = [], sort = [], pagination = {} } = req.query;

        try {
            // check cache
            const cacheKey = RedisUtils.generateCacheKeyWithFilter(prefix + ":search", { filter, sort, pagination });
            const isSearchCache = await RedisUtils.isExists(cacheKey);

            if (isSearchCache) {
                const result = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.SEARCH_HOUSE_SUCCESS, true, JSON.parse(result[0])));
            }

            const result = await HouseService.search({
                filter,
                sort,
                pagination,
            });

            // save to cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(result));

            return res.json(apiResponse(messageResponse.SEARCH_HOUSE_SUCCESS, true, result));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async signupReceiveInfo(req, res) {
        const { roomId, fullName, phoneNumber, email } = req.body;
        try {
            console.log(req.body);
            
            const signup = await HouseService.signupReceiveInformation({
                roomId,
                fullName,
                phoneNumber,
                email: email || null,
            });

            return res.json(apiResponse(messageResponse.SIGNUP_RECEIVE_INFO_SUCCESS, true, signup));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getSignupReceiveInfo(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination = {} } = req.query;
        try {
            const signup = await HouseService.getSignupReceiveInformation(houseId, {
                filter,
                sort,
                pagination,
            });

            return res.json(apiResponse(messageResponse.GET_SIGNUP_RECEIVE_INFO_SUCCESS, true, signup));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateSignupReceiveInfo(req, res) {
        const { signupId } = req.params;
        const { status } = req.body;
        try {
            await HouseService.updateSignupReceiveInformation(signupId, status);

            return res.json(apiResponse(messageResponse.UPDATE_SIGNUP_RECEIVE_INFO_SUCCESS, true, {}));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default HouseController;
