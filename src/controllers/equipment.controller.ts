"use strict";

import { Model } from "objection";
import { messageResponse } from "../enums";
import { EquipmentService } from "../services";
import { apiResponse, Exception, RedisUtils } from "../utils";

class EquipmentController {
    static async addEquipment(req, res) {
        const { houseId } = req.params;
        const { floorId, roomId, code, name, status, sharedType, description } = req.body;
        const userInfo = req.user;
        try {
            const data = {
                houseId: houseId,
                floorId: floorId,
                roomId: roomId,
                code,
                name,
                status,
                sharedType,
                description,
                createdBy: userInfo.id,
                updatedBy: userInfo.id,
            };
            const equipment = await EquipmentService.create(data);

            await RedisUtils.deletePattern("rooms:*");
            await RedisUtils.deletePattern("floors:*");
            await RedisUtils.deletePattern("houses:*");

            return res.json(apiResponse(messageResponse.CREATE_EQUIPMENT_SUCCESS, true, equipment));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getEquipmentDetails(req, res) {
        const { equipmentId } = req.params;
        try {
            const equipment = await EquipmentService.getById(equipmentId);
            return res.json(apiResponse(messageResponse.GET_EQUIPMENT_DETAILS_SUCCESS, true, equipment));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async searchEquipment(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;
        try {
            const data = await EquipmentService.listEquipment(houseId, {
                filter,
                sort,
                pagination,
            });
            return res.json(apiResponse(messageResponse.GET_EQUIPMENT_LIST_SUCCESS, true, data));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateEquipment(req, res) {
        const { equipmentId } = req.params;
        const userInfo = req.user;
        const { floorId, roomId, code, name, status, sharedType, description } = req.body;
        try {
            const data = {
                floorId: floorId,
                roomId: roomId,
                code,
                name,
                status,
                sharedType,
                description,
                updatedBy: userInfo.id,
            };
            const equipment = await EquipmentService.update(userInfo.id, equipmentId, data);

            await RedisUtils.deletePattern("rooms:*");
            await RedisUtils.deletePattern("floors:*");
            await RedisUtils.deletePattern("houses:*");

            return res.json(apiResponse(messageResponse.UPDATE_EQUIPMENT_SUCCESS, true, equipment));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateEquipmentStatus(req, res) {
        const { equipmentId } = req.params;
        const { status, sharedType } = req.body;
        const userInfo = req.user;
        try {
            const data = {
                status,
                sharedType,
                updatedBy: userInfo.id,
            };
            const equipment = await EquipmentService.updateStatus(userInfo.id, equipmentId, data);
            return res.json(apiResponse(messageResponse.UPDATE_EQUIPMENT_STATUS_SUCCESS, true, equipment));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteEquipment(req, res) {
        const { equipmentId } = req.params;
        const user = req.user;
        try {
            await EquipmentService.delete(user.id, equipmentId);
            return res.json(apiResponse(messageResponse.DELETE_EQUIPMENT_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteEquipmentInHouse(req, res) {
        const { houseId } = req.params;
        const { ids } = req.body;
        const trx = await Model.startTransaction();
        try {
            await EquipmentService.deleteMany(req.user.id, houseId, ids, trx);

            // commit transaction
            await trx.commit();
            return res.json(apiResponse(messageResponse.DELETE_EQUIPMENT_SUCCESS, true));
        } catch (err) {
            // rollback transaction
            await trx.rollback();
            Exception.handle(err, req, res);
        }
    }
}

export default EquipmentController;
