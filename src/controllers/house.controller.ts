"use strict";
import messageResponse from "../enums/message.enum";
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
}

export default HouseController;
