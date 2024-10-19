"use strict";

import { messageResponse, RoomStatus } from "../enums";
import { RoomService } from "../services";
import { ApiException, apiResponse, Exception, RedisUtils } from "../utils";

const prefix = "rooms";
class RoomController {
    // static async getRoomsByHouse(req, res) {
    //     const { houseId } = req.params;
    //     const { filter = [], sorting = [], page, pageSize } = req.query;
    //     try {
    //         const rooms = await RoomService.listByHouse(houseId, {
    //             page: parseInt(page),
    //             pageSize: parseInt(limit),
    //         });
    //         return res.json(apiResponse(messageResponse.GET_ROOMS_BY_HOUSE_SUCCESS, true, rooms));
    //     } catch (err) {
    //         Exception.handle(err, req, res);
    //     }
    // }

    static async createRoom(req, res) {
        const { houseId } = req.params;
        const { name, floor, maxRenters, price, services, images, description, status } = req.body;
        const userId = req.user.id;
        try {
            const newRoom = await RoomService.create(houseId, {
                name,
                floorId: floor,
                maxRenters,
                price,
                description,
                status: status || RoomStatus.AVAILABLE,
                createdBy: userId,
                updatedBy: userId,
            });

            if (newRoom) {
                await RoomService.addServiceToRoom(newRoom.id, services, userId);
                await RoomService.addImagesToRoom(newRoom.id, images, userId);

                const room = await RoomService.getRoomById(newRoom.id);

                // delete cache
                await RedisUtils.deletePattern(`${prefix}:*`);

                return res.json(apiResponse(messageResponse.CREATE_ROOM_SUCCESS, true, room));
            }
            throw new ApiException(messageResponse.CREATE_ROOM_FAIL, 400);
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRoomDetails(req, res) {
        const { roomId } = req.params;
        try {
            const redisKey = `${prefix}:${roomId}`;
            const cache = await RedisUtils.isExists(redisKey);
            if (cache) {
                const room = await RedisUtils.getSetMembers(redisKey);
                return res.json(apiResponse(messageResponse.GET_ROOM_DETAILS_SUCCESS, true, JSON.parse(room[0])));
            }
            const room = await RoomService.getRoomById(roomId);

            // set cache
            await RedisUtils.setAddMember(redisKey, JSON.stringify(room));

            return res.json(apiResponse(messageResponse.GET_ROOM_DETAILS_SUCCESS, true, room));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateRoom(req, res) {
        const { roomId } = req.params;
        const { name, floor, maxRenters, price, services, images } = req.body;
        const userId = req.user.id;
        try {
            const updatedRoom = await RoomService.updateRoom(roomId, {
                name,
                floorId: floor,
                maxRenters,
                price,
                services,
                images,
                updatedBy: userId,
            });

            // delete cache
            await RedisUtils.deletePattern(`${prefix}`);

            return res.json(apiResponse(messageResponse.UPDATE_ROOM_SUCCESS, true, updatedRoom));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteRoom(req, res) {
        const { roomId } = req.params;
        const userId = req.user.id;
        try {
            await RoomService.deleteRoom(roomId, userId);

            // delete cache
            await RedisUtils.deletePattern(`${prefix}:*`);

            return res.json(apiResponse(messageResponse.DELETE_ROOM_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default RoomController;
