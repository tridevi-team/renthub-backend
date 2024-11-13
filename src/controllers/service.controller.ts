"use strict";

import { messageResponse } from "../enums";
import { HouseService, RoomService } from "../services";
import { ApiException, apiResponse, Exception, RedisUtils } from "../utils";

const prefix = "services";
const cachePattern = `${prefix}:*`;

class ServiceController {
    static async createServiceForHouse(req, res) {
        const { houseId } = req.params;
        const { name, unitPrice, type } = req.body;
        const user = req.user;
        try {
            const service = await HouseService.createService(houseId, {
                name,
                unitPrice,
                type,
                createdBy: user.id,
            });

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.CREATE_SERVICE_SUCCESS, true, service));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async addServiceToRoom(req, res) {
        const { roomId } = req.params;
        const user = req.user;
        const { services } = req.body;
        try {
            await RoomService.addServiceToRoom(roomId, services, user.id);

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.CREATE_ROOM_SERVICE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async addServiceToRooms(req, res) {
        const user = req.user;
        const { houseId } = req.params;
        const { ids, services } = req.body;
        try {
            const servicesInHouse = await HouseService.listServicesByHouse(houseId);
            const serviceIds = servicesInHouse.map((service) => service.id);

            const roomsInHouse = await HouseService.getHouseWithRooms(houseId);
            const roomIds = roomsInHouse.map((room) => room.id);

            for (const roomId of ids) {
                if (!roomIds.includes(roomId)) {
                    throw new ApiException(messageResponse.ROOM_NOT_FOUND, 404);
                }
            }

            for (const id of ids) {
                if (!serviceIds.includes(id)) {
                    throw new ApiException(messageResponse.SERVICE_NOT_FOUND, 404);
                }
            }

            for (const roomId of ids) {
                await RoomService.addServiceToRoom(roomId, services, user.id);
            }

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.CREATE_ROOM_SERVICE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async removeServiceFromRoom(req, res) {
        const { roomId } = req.params;
        const user = req.user;
        const { serviceIds } = req.body;
        try {
            await RoomService.removeServicesFromRoom(roomId, serviceIds, user.id);

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.DELETE_ROOM_SERVICE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getServicesByHouse(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;
        const cacheKey = RedisUtils.generateCacheKeyWithFilter(prefix + `:getByHouse:${houseId}`, {
            filter,
            sort,
            pagination,
        });
        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const data = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_SERVICES_BY_HOUSE_SUCCESS, true, JSON.parse(data[0])));
            }

            const services = await HouseService.listServicesByHouse(houseId, {
                filter,
                sort,
                pagination,
            });

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(services));

            return res.json(apiResponse(messageResponse.GET_SERVICES_BY_HOUSE_SUCCESS, true, services));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getServiceDetails(req, res) {
        const { serviceId } = req.params;
        const cacheKey = RedisUtils.generateCacheKeyWithId(prefix, serviceId, "details");

        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const data = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_SERVICE_DETAILS_SUCCESS, true, JSON.parse(data[0])));
            }

            const service = await HouseService.getServiceDetails(serviceId);

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(service));

            return res.json(apiResponse(messageResponse.GET_SERVICE_DETAILS_SUCCESS, true, service));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateService(req, res) {
        const { serviceId } = req.params;
        const { name, unitPrice, type, description } = req.body;
        const user = req.user;
        try {
            const updatedService = await HouseService.updateService(serviceId, {
                name,
                unitPrice,
                type,
                description,
                updatedBy: user.id,
            });

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.UPDATE_SERVICE_SUCCESS, true, updatedService));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteService(req, res) {
        const { serviceId } = req.params;
        const user = req.user;
        try {
            await HouseService.deleteService(serviceId, user.id);

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.DELETE_SERVICE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default ServiceController;
