"use strict";
import { Houses, Services } from "../models";
import { formatJson, jwtToken, Exception, ApiException } from "../utils";
import { housePermissions } from "../enum/Houses";

const serviceController = {
    async create(req, res) {
        try {
            const { houseId } = req.params;
            const { name, unitPrice, rules, type } = req.body;
            const user = req.user;
            const house = await Houses.query().findById(houseId);
            if (!house) {
                throw new ApiException(1003, "House not found");
            }

            const service = await Services.query().insert({
                house_id: Number(houseId),
                name,
                unit_price: parseFloat(unitPrice),
                rules: JSON.stringify(rules) || null,
                type,
                created_by: user.id,
            });

            if (!service) {
                throw new ApiException(1002, "Ocurred an error while creating service");
            }

            res.json(formatJson.success(1007, "Create service successful", service));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getServiceByHouse(req, res) {
        try {
            const { houseId } = req.params;

            const house = await Houses.query().findById(houseId);
            if (!house) {
                throw new ApiException(1003, "House not found");
            }

            const services = await Services.query().where("house_id", houseId);
            if (!services) {
                throw new ApiException(1004, "Services not found");
            }
            res.json(formatJson.success(1006, "Get services by house successful", services));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getServiceDetails(req, res) {
        try {
            const { houseId, serviceId } = req.params;

            const house = await Houses.query().findById(houseId);
            if (!house) {
                throw new ApiException(1003, "House not found");
            }

            const service = await Services.query().findById(serviceId);
            if (!service) {
                throw new ApiException(1003, "Service not found");
            }

            res.json(formatJson.success(1003, "Get service details successful", service));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async update(req, res) {
        try {
            const { houseId, serviceId } = req.params;
            const { name, unitPrice, rules, type } = req.body;

            const house = await Houses.query().findById(houseId);
            if (!house) {
                throw new ApiException(1003, "House not found");
            }

            const service = await Services.query().findById(serviceId);
            if (!service) {
                throw new ApiException(1003, "Service not found");
            }

            const updated = await Services.query()
                .findById(Number(serviceId))
                .patch({
                    name,
                    unit_price: unitPrice,
                    rules: JSON.stringify(rules) || null,
                    type,
                });

            if (!updated) {
                throw new ApiException(1002, "Ocurred an error while updating service");
            }

            res.json(formatJson.success(1003, "Update service successful"));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async delete(req, res) {
        try {
            const { houseId, serviceId } = req.params;

            const house = await Houses.query().findById(houseId);
            if (!house) {
                throw new ApiException(1003, "House not found");
            }

            const service = await Services.query().findById(serviceId);
            if (!service) {
                throw new ApiException(1003, "Service not found");
            }

            const deleted = await Services.query().deleteById(serviceId);
            if (!deleted) {
                throw new ApiException(1002, "Ocurred an error while deleting service");
            }

            res.json(formatJson.success(1003, "Delete service successful"));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },
};

export default serviceController;
