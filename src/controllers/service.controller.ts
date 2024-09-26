"use strict";

import messageResponse from "../enums/message.enum";
import { HouseService, RoomService } from "../services";
import { apiResponse, Exception } from "../utils";

class ServiceController {
    static async createServiceForHouse(req, res) {
        const { houseId } = req.params;
        const { name, unitPrice, hasIndex, type } = req.body;
        const user = req.user;
        try {
            const service = await HouseService.createService(houseId, {
                name,
                unitPrice,
                hasIndex,
                type,
                createdBy: user.id,
            });

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
            return res.json(apiResponse(messageResponse.CREATE_ROOM_SERVICE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async removeServiceFromRoom(req, res) {
        const { roomId } = req.params;
        const user = req.user;
        const { servicesId } = req.body;
        try {
            await RoomService.removeServicesFromRoom(roomId, servicesId, user.id);
            return res.json(apiResponse(messageResponse.DELETE_ROOM_SERVICE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getServicesByHouse(req, res) {
        const { houseId } = req.params;
        try {
            const services = await HouseService.listServicesByHouse(houseId);
            return res.json(apiResponse(messageResponse.GET_SERVICES_BY_HOUSE_SUCCESS, true, services));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getServiceDetails(req, res) {
        const { serviceId } = req.params;
        try {
            const service = await HouseService.getServiceDetails(serviceId);
            return res.json(apiResponse(messageResponse.GET_SERVICE_DETAILS_SUCCESS, true, service));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateService(req, res) {
        const { serviceId } = req.params;
        const { name, unitPrice, hasIndex, type, description } = req.body;
        const user = req.user;
        try {
            const updatedService = await HouseService.updateService(serviceId, {
                name,
                unitPrice,
                type,
                hasIndex,
                description,
                updatedBy: user.id,
            });

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
            return res.json(apiResponse(messageResponse.DELETE_SERVICE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default ServiceController;
