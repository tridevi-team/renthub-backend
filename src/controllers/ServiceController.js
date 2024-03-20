const { validationResult } = require("express-validator");
const { Houses, Services } = require("../models");
const { formatJson, jwtToken, checkHousePermissions, Exception, ApiException } = require("../utils");
const { houseStatus, housePermissions } = require("../enum/Houses");

const serviceController = {
    async create(req, res) {
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
            const { name, unitPrice, rules, type } = req.body;
            const user = jwtToken.verify(authorization);

            const house = await Houses.query().findById(houseId);
            if (!house) {
                throw new ApiException(1003, "House not found");
            }

            const hasAccess = await checkHousePermissions(user.id, houseId, housePermissions.CREATE_SERVICES);
            if (!hasAccess) {
                throw new ApiException(1001, "You don't have permission to create services");
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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            const { houseId } = req.params;
            const user = jwtToken.verify(authorization);

            const hasAccess = await checkHousePermissions(user.id, houseId, housePermissions.READ_SERVICES);
            if (!hasAccess) {
                throw new ApiException(1001, "You don't have permission to read services");
            }

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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            const { houseId, serviceId } = req.params;
            const user = jwtToken.verify(authorization);

            const hasAccess = await checkHousePermissions(user.id, houseId, housePermissions.READ_SERVICES);
            if (!hasAccess) {
                throw new ApiException(1001, "You don't have permission to read services");
            }

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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            const { houseId, serviceId } = req.params;
            const { name, unitPrice, rules, type } = req.body;
            const user = jwtToken.verify(authorization);

            const hasAccess = await checkHousePermissions(user.id, houseId, housePermissions.UPDATE_SERVICES);
            if (!hasAccess) {
                throw new ApiException(1001, "You don't have permission to update services");
            }

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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            const { houseId, serviceId } = req.params;
            const user = jwtToken.verify(authorization);

            const hasAccess = await checkHousePermissions(user.id, houseId, housePermissions.DELETE_SERVICES);
            if (!hasAccess) {
                throw new ApiException(1001, "You don't have permission to delete services");
            }

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

module.exports = serviceController;
