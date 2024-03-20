const { validationResult } = require("express-validator");
const { Rooms, RoomImages, Houses } = require("../models");
const { checkHousePermissions, jwtToken, formatJson, ApiException, Exception } = require("../utils");
const { housePermissions } = require("../enum/Houses");

const roomController = {
    async getRoomList(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verifyToken(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            const { houseId } = req.params;
            const userInfo = jwtToken.verify(authorization);

            const hasAccess = await checkHousePermissions(userInfo.id, houseId, housePermissions.READ_ROOMS);
            if (!hasAccess) {
                throw new ApiException(500, "You don't have permission to access this house");
            }

            const roomList = await Rooms.query().where({ house_id: houseId });
            if (!roomList) {
                throw new ApiException(1001, "Not rooms found");
            }

            res.json(formatJson.success(1002, "Get room list successfully", roomList));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async createRooms(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            const { houseId } = req.params;
            const userInfo = jwtToken.verify(authorization);

            const hasAccess = await checkHousePermissions(userInfo.id, houseId, housePermissions.CREATE_ROOMS);
            if (!hasAccess) {
                throw new ApiException(500, "You don't have permission to access this house");
            }

            const { name, description, price } = req.body;
            const newRoom = await Rooms.query().insert({ name, description, price, house_id: houseId });

            if (!newRoom) {
                throw new ApiException(1003, "Error creating room");
            }

            res.json(formatJson.success(1004, "Room created successfully", newRoom));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async updateRoom(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            const { houseId, roomId } = req.params;
            const userInfo = jwtToken.verify(authorization);

            const hasAccess = await checkHousePermissions(userInfo.id, houseId, housePermissions.UPDATE_ROOMS);
            if (!hasAccess) {
                throw new ApiException(500, "You don't have permission to access this house");
            }

            const { name, description, price } = req.body;
            const updatedRoom = await Rooms.query().patchAndFetchById(roomId, { name, description, price });

            if (!updatedRoom) {
                throw new ApiException(1003, "Error updating room");
            }

            res.json(formatJson.success(1004, "Room updated successfully", updatedRoom));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async deleteRoom(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            const { houseId, roomId } = req.params;
            const userInfo = jwtToken.verify(authorization);

            const hasAccess = await checkHousePermissions(userInfo.id, houseId, housePermissions.DELETE_ROOMS);
            if (!hasAccess) {
                throw new ApiException(500, "You don't have permission to access this house");
            }

            const deletedRoom = await Rooms.query().deleteById(roomId);

            if (!deletedRoom) {
                throw new ApiException(1003, "Error deleting room");
            }

            res.json(formatJson.success(1004, "Room deleted successfully", deletedRoom));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
};

module.exports = roomController;
