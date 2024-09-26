"use strict";
import redisConfig from "../config/redis.config";
import messageResponse from "../enums/message.enum";
import { Houses } from "../models";
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
        try {
            const list = await HouseService.getHouseByUser(user.id);
            if (list.length === 0) throw new ApiException(messageResponse.NO_HOUSES_FOUND, 404);
            return res.json(apiResponse(messageResponse.GET_HOUSE_LIST_SUCCESS, true, list));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getHouseDetails(req, res) {
        const { houseId } = req.params;
        try {
            const details = await HouseService.getHouseById(houseId);
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
        const { keyword, limit, page, sortBy, orderBy, numOfBeds, street, ward, district, city, numOfRenters, roomArea, priceFrom, priceTo } = req.query;
        try {
            const data = {
                keyword,
                limit: limit ? parseInt(limit) : 10,
                page: page ? parseInt(page) : 1,
                sortBy: sortBy,
                orderBy: orderBy,
                numOfBeds: numOfBeds ? parseInt(numOfBeds) : 0,
                address: {
                    street: street,
                    ward: ward,
                    district: district,
                    city: city,
                },
                numOfRenters: numOfRenters,
                roomArea: roomArea,
                price: {
                    from: priceFrom,
                    to: priceTo,
                },
            };
            // check cache
            const redis = await redisConfig;
            const cache = await redis.sIsMember(
                `search:house:keyword_${keyword}:limit_${limit}:page_${page}:sortBy_${sortBy}:orderBy_${orderBy}:numOfBeds_${numOfBeds}:street_${street}:ward_${ward}:district_${district}:city_${city}:numOfRenters_${numOfRenters}:roomArea_${roomArea}:priceFrom_${priceFrom}:priceTo_${priceTo}`,
                JSON.stringify(data)
            );
            if (cache) {
                const result = await redis.sMembers(
                    `search:house:keyword_${keyword}:limit_${limit}:page_${page}:sortBy_${sortBy}:orderBy_${orderBy}:numOfBeds_${numOfBeds}:street_${street}:ward_${ward}:district_${district}:city_${city}:numOfRenters_${numOfRenters}:roomArea_${roomArea}:priceFrom_${priceFrom}:priceTo_${priceTo}`
                );
                return res.json(apiResponse(messageResponse.SEARCH_HOUSE_SUCCESS, true, JSON.parse(result[0])));
            }

            const result = await HouseService.search(data);
            // clean result
            const cleanResult = result.results.map((house: Houses) => {
                return {
                    id: house.id,
                    name: house.name,
                    address: house.address,
                    description: house.description,
                    floors: house.floors.map((floor) => {
                        return {
                            id: floor.id,
                            name: floor.name,
                            rooms: floor.rooms.map((room) => {
                                return {
                                    id: room.id,
                                    name: room.name,
                                    price: room.price,
                                    area: room.area,
                                    maxRenters: room.maxRenters,
                                    status: room.status,
                                    images: room.images || [],
                                    services: room.services
                                        ? room.services.map((service) => {
                                              return {
                                                  id: service.id,
                                                  name: service.name,
                                                  price: service.price,
                                                  description: service.description,
                                              };
                                          })
                                        : [],
                                };
                            }),
                        };
                    }),
                };
            });

            // save to cache
            redis.sAdd(
                `search:house:keyword_${keyword}:limit_${limit}:page_${page}:sortBy_${sortBy}:orderBy_${orderBy}:numOfBeds_${numOfBeds}:street_${street}:ward_${ward}:district_${district}:city_${city}:numOfRenters_${numOfRenters}:roomArea_${roomArea}:priceFrom_${priceFrom}:priceTo_${priceTo}`,
                JSON.stringify({
                    results: cleanResult,
                    total: result.total,
                })
            );
            redis.expire(
                `search:house:keyword_${keyword}:limit_${limit}:page_${page}:sortBy_${sortBy}:orderBy_${orderBy}:numOfBeds_${numOfBeds}:street_${street}:ward_${ward}:district_${district}:city_${city}:numOfRenters_${numOfRenters}:roomArea_${roomArea}:priceFrom_${priceFrom}:priceTo_${priceTo}`,
                300
            );

            return res.json(
                apiResponse(messageResponse.SEARCH_HOUSE_SUCCESS, true, {
                    results: cleanResult,
                    total: result.total,
                })
            );
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default HouseController;
