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
        const { id } = req.params;
        try {
            const details = await HouseService.getHouseById(id);
            return res.json(apiResponse(messageResponse.GET_HOUSE_DETAILS_SUCCESS, true, details));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateHouseDetails(req, res) {
        const { id } = req.params;
        try {
            const update = await HouseService.update(id, req.body);
            if (!update) throw new ApiException(messageResponse.UPDATE_HOUSE_FAIL, 500);

            return res.json(apiResponse(messageResponse.UPDATE_HOUSE_SUCCESS, true, update));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateHouseStatus(req, res) {
        const { id } = req.params;
        try {
            const isUpdate = await HouseService.updateStatus(id, req.body.status);
            if (!isUpdate) throw new ApiException(messageResponse.UPDATE_HOUSE_STATUS_FAIL, 500);

            return res.json(apiResponse(messageResponse.UPDATE_HOUSE_STATUS_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteHouse(req, res) {
        const { id } = req.params;
        try {
            const isDelete = await HouseService.delete(id);
            if (!isDelete) throw new ApiException(messageResponse.DELETE_HOUSE_FAIL, 500);

            return res.json(apiResponse(messageResponse.DELETE_HOUSE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default HouseController;
