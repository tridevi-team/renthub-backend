"use strict";
import { Equipment, Rooms } from "../models";
import { ApiException, Exception, formatJson, jwtToken, checkHousePermissions } from "../utils";
import { housePermissions } from "../enum/Houses";

const equipmentController = {
    async addEquipment(req, res) {
        try {
            const { houseId, roomId } = req.params;

            // check permission
            const userInfo = req.user;
            const isAccess = await checkHousePermissions(userInfo.id, houseId, housePermissions.CREATE_EQUIPMENTS);
            if (!isAccess) {
                throw new ApiException(1007, "You don't have permission to access this house");
            }

            const { name, quantity, status, expDate, created_by } = req.body;

            // check house and room exists
            const checkRoom = await Rooms.query().findOne({ id: roomId, house_id: houseId });
            if (!checkRoom) {
                throw new ApiException(1004, "Room not found", []);
            }

            const insertEquipment = await Equipment.query().insert({
                name,
                quantity: quantity || 1,
                status,
                exp_date: expDate,
                room_id: roomId,
                created_by,
            });

            if (!insertEquipment) {
                throw new ApiException(1003, "Error creating equipment");
            }

            res.json(formatJson.success(1002, "Add equipment successfully", insertEquipment));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getEquipmentDetail(req, res) {
        try {
            const userInfo = req.user;
            const { houseId, roomId, equipmentId } = req.params;

            // check permission
            const isAccess = checkHousePermissions(userInfo.id, houseId, housePermissions.READ_EQUIPMENTS);
            if (!isAccess) {
                throw new ApiException(1007, "You don't have permission to access this house");
            }

            // check house and room exists
            const checkRoom = await Rooms.query().findOne({
                id: roomId,
                house_id: houseId,
            });
            if (!checkRoom) {
                throw new ApiException(1004, "Room not found", []);
            }

            const details = await Equipment.query().findOne({ id: equipmentId });
            if (!details) {
                throw new ApiException(1001, "Equipment not found", []);
            }

            res.json(formatJson.success(1003, "Get equipment details successfully", details));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getEquipmentList(req, res) {
        try {
            const { houseId, roomId } = req.params;
            const userInfo = req.user;

            const isAccess = await checkHousePermissions(userInfo.id, houseId, housePermissions.READ_EQUIPMENTS);

            if (!isAccess) {
                throw new ApiException(1007, "You don't have permission to access this house");
            }

            // check house and room exists
            const checkRoom = await Rooms.query().findOne({
                id: roomId,
                house_id: houseId,
            });
            if (!checkRoom) {
                throw new ApiException(1004, "Room not found", []);
            }

            const lists = await Equipment.query().where({ room_id: roomId });

            res.json(formatJson.success(1004, "Get equipment list successfully", lists));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },
};

export default equipmentController;
