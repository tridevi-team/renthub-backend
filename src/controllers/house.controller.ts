"use strict";
import redisConfig from "../config/redis.config";
import { EPagination, messageResponse } from "../enums";
import { HouseService } from "../services";
import { ApiException, apiResponse, Exception } from "../utils";

class HouseController {
    static async createHouse(req, res) {
        const user = req.user;
        try {
            const house = await HouseService.create({
                ...req.body,
                createdBy: user.id,
            });
            return res.json(apiResponse(messageResponse.CREATE_HOUSE_SUCCESS, true, house));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getHouseList(req, res) {
        const user = req.user;
        const {
            filter = [],
            sort = [],
            pagination = { page: EPagination.DEFAULT_PAGE, pageSize: EPagination.DEFAULT_LIMIT },
        } = req.query;

        try {
            const list = await HouseService.getHouseByUser(user.id, {
                filter,
                sort,
                pagination,
            });
            if (!list) throw new ApiException(messageResponse.NO_HOUSES_FOUND, 404);
            return res.json(apiResponse(messageResponse.GET_HOUSE_LIST_SUCCESS, true, list));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getHouseDetails(req, res) {
        const { houseId } = req.params;
        try {
            const redis = await redisConfig;
            const cache = await redis.sIsMember(`house:${houseId}:details`, houseId);
            if (cache) {
                const result = await redis.sMembers(`house:${houseId}:details`);
                return res.json(apiResponse(messageResponse.GET_HOUSE_DETAILS_SUCCESS, true, JSON.parse(result[0])));
            }

            const details = await HouseService.getHouseById(houseId);
            redis.sAdd(`house:${houseId}:details`, JSON.stringify(details));
            redis.expire(`house:${houseId}:details`, 300);

            return res.json(apiResponse(messageResponse.GET_HOUSE_DETAILS_SUCCESS, true, details));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getHouseWithRooms(req, res) {
        const { houseId } = req.params;
        try {
            // cache
            const redis = await redisConfig;
            const cache = await redis.sIsMember(`house:${houseId}:rooms`, houseId);
            if (cache) {
                const result = await redis.sMembers(`house:${houseId}:rooms`);
                return res.json(apiResponse(messageResponse.GET_HOUSE_DETAILS_SUCCESS, true, JSON.parse(result[0])));
            }

            const details = await HouseService.getHouseWithRooms(houseId);
            redis.sAdd(`house:${houseId}:rooms`, JSON.stringify(details));
            redis.expire(`house:${houseId}:rooms`, 300);

            return res.json(apiResponse(messageResponse.GET_HOUSE_DETAILS_SUCCESS, true, details));
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

            return res.json(apiResponse(messageResponse.DELETE_HOUSE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async searchHouse(req, res) {
        const {
            filter = [],
            sort = [],
            pagination = { page: EPagination.DEFAULT_PAGE, pageSize: EPagination.DEFAULT_LIMIT },
        } = req.query;
        try {
            // check cache
            // const redis = await redisConfig;
            // const cache = await redis.sIsMember(
            //     `search:house:keyword_${keyword}:limit_${limit}:page_${page}:sortBy_${sortBy}:orderBy_${orderBy}:numOfBeds_${numOfBeds}:street_${street}:ward_${ward}:district_${district}:city_${city}:numOfRenters_${numOfRenters}:roomArea_${roomArea}:priceFrom_${priceFrom}:priceTo_${priceTo}`,
            //     JSON.stringify(data)
            // );
            // if (cache) {
            //     const result = await redis.sMembers(
            //         `search:house:keyword_${keyword}:limit_${limit}:page_${page}:sortBy_${sortBy}:orderBy_${orderBy}:numOfBeds_${numOfBeds}:street_${street}:ward_${ward}:district_${district}:city_${city}:numOfRenters_${numOfRenters}:roomArea_${roomArea}:priceFrom_${priceFrom}:priceTo_${priceTo}`
            //     );
            //     return res.json(apiResponse(messageResponse.SEARCH_HOUSE_SUCCESS, true, JSON.parse(result[0])));
            // }

            const result = await HouseService.search({
                filter,
                sort,
                pagination,
            });

            // save to cache
            // redis.sAdd(
            //     `search:house:keyword_${keyword}:limit_${limit}:page_${page}:sortBy_${sortBy}:orderBy_${orderBy}:numOfBeds_${numOfBeds}:street_${street}:ward_${ward}:district_${district}:city_${city}:numOfRenters_${numOfRenters}:roomArea_${roomArea}:priceFrom_${priceFrom}:priceTo_${priceTo}`,
            //     JSON.stringify(result)
            // );
            // redis.expire(
            //     `search:house:keyword_${keyword}:limit_${limit}:page_${page}:sortBy_${sortBy}:orderBy_${orderBy}:numOfBeds_${numOfBeds}:street_${street}:ward_${ward}:district_${district}:city_${city}:numOfRenters_${numOfRenters}:roomArea_${roomArea}:priceFrom_${priceFrom}:priceTo_${priceTo}`,
            //     300
            // );

            return res.json(apiResponse(messageResponse.SEARCH_HOUSE_SUCCESS, true, result));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default HouseController;
