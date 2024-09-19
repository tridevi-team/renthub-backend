"use strict";
import { EquipmentType } from "../enums";
import { Equipment, RoomEquipment, Rooms } from "../models";
import { ApiException, Exception, formatJson } from "../utils";

const equipmentController = {
    async addEquipment(req, res) {
        try {
            const { houseId } = req.params;
            const userInfo = req.user;

            const { name, quantity, status, expDate, sharedType, description } = req.body;

            const checkEquipment = await Equipment.query().findOne({
                name: name || "",
                house_id: houseId,
            });

            if (checkEquipment) {
                throw new ApiException(1005, "Equipment already exists", checkEquipment);
            }

            const insertEquipment = await Equipment.query().insert({
                name,
                quantity: quantity || 1,
                status,
                shared_type: sharedType,
                description,
                exp_date: expDate,
                house_id: Number(houseId),
                created_by: userInfo.id,
            });

            if (!insertEquipment) {
                throw new ApiException(1003, "Error creating equipment");
            }

            res.json(formatJson.success(1002, "Add equipment successfully", insertEquipment));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async addEquipmentToRoom(req, res) {
        try {
            const userInfo = req.user;
            const { roomId } = req.params;
            const { equipment } = req.body;

            // check house and room exists
            const checkRoom = await Rooms.query().findOne({
                id: Number(roomId),
            });
            if (!checkRoom) {
                throw new ApiException(1004, "Room not found", []);
            }

            for (let equipmentId of equipment) {
                const checkEquipment = await Equipment.query().findOne({ id: equipmentId });
                if (!checkEquipment) {
                    throw new ApiException(1001, "Equipment not found", []);
                } else if (checkEquipment.shared_type === EquipmentType.HOUSE) {
                    throw new ApiException(1006, "This equipment is shared in house", []);
                }

                const checkEquipmentInRoom = await RoomEquipment.query().findOne({
                    room_id: Number(roomId),
                    equipment_id: equipmentId,
                });

                if (checkEquipmentInRoom) {
                    throw new ApiException(1005, "Equipment already exists in this room", checkEquipmentInRoom);
                }

                const insertEquipment = await RoomEquipment.query().insert({
                    room_id: Number(roomId),
                    equipment_id: equipmentId,
                    created_by: userInfo.id,
                });

                if (!insertEquipment) {
                    throw new ApiException(1003, "Error adding equipment to room");
                }

                res.json(formatJson.success(1002, "Add equipment to room successfully", insertEquipment));
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getEquipmentListInHouse(req, res) {
        try {
            const { houseId } = req.params;

            const lists = await Equipment.query().where("house_id", houseId);

            res.json(formatJson.success(1004, "Get equipment list successfully", lists));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getEquipmentListInRoom(req, res) {
        try {
            const { roomId } = req.params;

            const checkRoom = await Rooms.query().findOne({
                id: roomId,
            });

            if (!checkRoom) {
                throw new ApiException(1004, "Room not found", []);
            }

            const equipments = await RoomEquipment.query().join("equipment", "room_equipment.equipment_id", "equipment.id").where("room_id", roomId).select("equipment.*");

            res.json(formatJson.success(1004, "Get equipment list successfully", equipments));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async updateEquipment(req, res) {
        try {
            const userInfo = req.user;
            const { equipmentId } = req.params;
            const { name, quantity, status, expDate, sharedType, description } = req.body;

            const checkEquipment = await Equipment.query().findOne({ id: equipmentId });

            if (!checkEquipment) {
                throw new ApiException(1001, "Equipment not found", []);
            }

            const updateEquipment = await Equipment.query().patchAndFetchById(equipmentId, {
                name,
                quantity: quantity || 1,
                status,
                shared_type: sharedType,
                description,
                exp_date: expDate,
                created_by: userInfo.id,
            });

            if (!updateEquipment) {
                throw new ApiException(1003, "Error updating equipment");
            }

            res.json(formatJson.success(1002, "Update equipment successfully", updateEquipment));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async deleteEquipment(req, res) {
        try {
            const { equipmentId } = req.params;

            const checkEquipment = await Equipment.query().findOne({ id: equipmentId });

            if (!checkEquipment) {
                throw new ApiException(1001, "Equipment not found", []);
            }

            const deleteEquipment = await Equipment.query().deleteById(equipmentId);

            if (!deleteEquipment) {
                throw new ApiException(1003, "Error deleting equipment");
            }

            res.json(formatJson.success(1002, "Delete equipment successfully", null));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },
};

export default equipmentController;
