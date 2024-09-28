"use strict";

import { RoomStatus } from "../enums";
import messageResponse from "../enums/message.enum";
import { RoomService } from "../services";
import { apiResponse, Exception } from "../utils";

class RoomController {
    static async getRoomsByHouse(req, res) {
        const { houseId } = req.params;
        const { page, limit } = req.query;
        try {
            const rooms = await RoomService.listByHouse(houseId, { page: parseInt(page), limit: parseInt(limit) });
            return res.json(apiResponse(messageResponse.GET_ROOMS_BY_HOUSE_SUCCESS, true, rooms));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

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

            await RoomService.addServiceToRoom(newRoom.id, services, userId);

            await RoomService.addImagesToRoom(newRoom.id, images, userId);

            const room = await RoomService.getRoomById(newRoom.id);

            return res.json(apiResponse(messageResponse.CREATE_ROOM_SUCCESS, true, room));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRoomDetails(req, res) {
        const { roomId } = req.params;
        try {
            const room = await RoomService.getRoomById(roomId);

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

            return res.json(apiResponse(messageResponse.UPDATE_ROOM_SUCCESS, true, updatedRoom));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteRoom(req, res) {
        const { roomId } = req.params;
        const userId = req.user.id;
        try {
            const deletedRoom = await RoomService.deleteRoom(roomId, userId);
            return res.json(apiResponse(messageResponse.DELETE_ROOM_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default RoomController;
