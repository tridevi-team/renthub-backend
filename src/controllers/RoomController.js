const { validationResult } = require("express-validator");
const { Rooms, RoomImages, RoomServices, Services } = require("../models");
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
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            const { houseId } = req.params;
            const userInfo = jwtToken.verify(authorization);

            const hasAccess = await checkHousePermissions(userInfo.id, houseId, housePermissions.READ_ROOMS);
            if (!hasAccess) {
                throw new ApiException(1007, "You don't have permission to access this house");
            }

            const roomList = await Rooms.query().where({ house_id: houseId });
            if (!roomList || roomList.length === 0) {
                throw new ApiException(1001, "There are no rooms in this house", []);
            }

            res.json(formatJson.success(1002, "Get room list successfully", roomList));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async createRoom(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            let { houseId } = req.params;
            houseId = parseInt(houseId);

            const userInfo = jwtToken.verify(authorization);

            const hasAccess = await checkHousePermissions(userInfo.id, houseId, housePermissions.CREATE_ROOMS);
            if (!hasAccess) {
                throw new ApiException(1007, "You don't have permission to access this house");
            }

            const { name, price, floor, maxRenters, services, images } = req.body;
            const newRoom = await Rooms.query().insert({ name, floor, max_renters: maxRenters, price, house_id: houseId, created_by: userInfo.id });

            if (!newRoom) {
                throw new ApiException(1003, "Error creating room");
            }

            await RoomServices.query().delete().whereNotIn("service_id", services).andWhere({ room_id: newRoom.id });
            if (services && services.length > 0) {
                services.forEach(async (service) => {
                    const checkService = await Services.query().findOne({ id: service, house_id: houseId });
                    if (!checkService) {
                        throw new ApiException(1010, "Service not found");
                    }
                    await RoomServices.query().insert({ room_id: newRoom.id, service_id: service });
                });
            }

            await RoomImages.query().delete().whereNotIn("image_url", images).andWhere({ room_id: newRoom.id });
            if (images && images.length > 0) {
                images.forEach(async (image) => {
                    await RoomImages.query().insert({ room_id: newRoom.id, image_url: image, created_by: userInfo.id });
                });
            }

            res.json(formatJson.success(1007, "Room created successfully", newRoom));
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
                throw new ApiException(1006, "You don't have permission to access this house");
            }

            const { name, floor, maxRenters, price, services, images } = req.body;
            const updatedRoom = await Rooms.query().patchAndFetchById(roomId, { name, floor, max_renters: maxRenters, price });

            if (!updatedRoom) {
                throw new ApiException(1004, "Error updating room");
            }

            await RoomServices.query().delete().whereNotIn("service_id", services).andWhere({ room_id: roomId });
            if (services && services.length > 0) {
                services.forEach(async (service) => {
                    const checkService = await Services.query().findOne({ id: service });
                    if (!checkService) {
                        throw new ApiException(1010, "Service not found");
                    }
                    await RoomServices.query().insert({ room_id: roomId, service_id: service });
                });
            }

            await RoomImages.query().delete().whereNotIn("image_url", images).andWhere({ room_id: roomId });
            if (images && images.length > 0) {
                images.forEach(async (image) => {
                    await RoomImages.query().insert({ room_id: roomId, image_url: image, created_by: userInfo.id });
                });
            }

            res.json(formatJson.success(1008, "Room updated successfully", updatedRoom));
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
                throw new ApiException(1007, "You don't have permission to access this house");
            }

            const deletedRoom = await Rooms.query().deleteById(roomId);

            if (!deletedRoom) {
                throw new ApiException(1006, "Error deleting room");
            }

            res.json(formatJson.success(1009, "Room deleted successfully", deletedRoom));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getRoomDetails(req, res) {
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

            const hasAccess = await checkHousePermissions(userInfo.id, houseId, housePermissions.READ_ROOMS);
            if (!hasAccess) {
                throw new ApiException(1007, "You don't have permission to access this house");
            }

            const roomDetails = await Rooms.query().findOne({ id: roomId, house_id: houseId });
            if (!roomDetails) {
                throw new ApiException(1001, "Room not found", []);
            }

            const roomServices = await RoomServices.query().where({ room_id: roomId });
            const roomImages = await RoomImages.query().where({ room_id: roomId });

            res.json(formatJson.success(1002, "Get room details successfully", { roomDetails, roomServices, roomImages }));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },
};

module.exports = roomController;