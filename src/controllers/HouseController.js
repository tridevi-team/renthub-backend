const { validationResult } = require("express-validator");
const { Houses } = require("../models");
const { formatJson, jwtToken, checkHousePermissions, Exception, ApiException } = require("../utils");
const { houseStatus, housePermissions } = require("../enum/Houses");

const HouseController = {
    async getHouseList(req, res) {
        try {
            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Unauthorized");
            }

            const userVerify = await jwtToken.verify(authorization);

            const houses = await Houses.query()
                .leftJoin("house_permissions", "houses.id", "house_permissions.house_id")
                .where("houses.created_by", userVerify.id)
                .orWhere("house_permissions.user_id", userVerify.id)
                .select("houses.*")
                .orderBy("houses.id", "asc");

            if (!houses) {
                throw new ApiException(1004, "The house list is empty.");
            }
            return res.json(formatJson.success(1001, "Get house list successful", houses));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async createHouse(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Unauthorized");
            }

            const { name, address, numberOfFloors, status } = req.body;

            const userVerify = await jwtToken.verify(authorization);

            const houseExist = await Houses.query().findOne({ name, created_by: userVerify.id });

            if (houseExist) {
                throw new ApiException(1003, "House already exist");
            }

            const statusDefault = status || houseStatus.AVAILABLE;

            const house = await Houses.query().insert({
                name,
                address,
                number_of_floors: numberOfFloors,
                status: statusDefault,
                created_by: userVerify.id,
            });

            if (house) {
                return res.json(formatJson.success(1001, "Create house successful", house));
            } else {
                throw new ApiException(1002, "Create house failed");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async updateHouseDetails(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Unauthorized");
            }

            const { id } = req.params;
            const { name, address, numberOfFloors, status } = req.body;

            const userVerify = await jwtToken.verify(authorization);

            const house = await Houses.query().findOne({ id });
            if (!house) {
                throw new ApiException(1004, "House not found");
            }

            // check permission
            const isAccess = await checkHousePermissions(userVerify.id, id, housePermissions.UPDATE_HOUSE);
            if (!isAccess) {
                throw new ApiException(500, "Unauthorized");
            }

            const updateStatus = status || houseStatus.AVAILABLE;
            const updateHouse = await Houses.query().patchAndFetchById(id, {
                name,
                address,
                number_of_floors: numberOfFloors,
                status: updateStatus,
            });
            if (updateHouse) {
                return res.json(formatJson.success(1001, "Update house successful", updateHouse));
            } else {
                throw new ApiException(1002, "Update house failed");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async deleteHouse(req, res) {
        try {
            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Unauthorized");
            }

            const { id } = req.params;

            const userVerify = await jwtToken.verify(authorization);

            const house = await Houses.query().findOne({ id });
            if (!house) {
                throw new ApiException(1004, "House not found");
            }

            // check permission
            const isAccess = await checkHousePermissions(userVerify.id, id, housePermissions.DELETE_HOUSE);
            if (!isAccess) {
                throw new ApiException(500, "Unauthorized");
            }

            const deleteHouse = await Houses.query().deleteById(id);

            if (deleteHouse) {
                return res.json(formatJson.success(1001, "Delete house successful"));
            } else {
                throw new ApiException(1002, "Delete house failed");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async updateHouseStatus(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array());
            }

            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Unauthorized");
            }

            const { id } = req.params;
            const { status } = req.body;

            const userVerify = await jwtToken.verify(authorization);

            const house = await Houses.query().findOne({ id });
            if (!house) {
                throw new ApiException(1004, "House not found");
            }

            // check permission
            const isAccess = await checkHousePermissions(userVerify.id, id, housePermissions.UPDATE_HOUSE);
            if (!isAccess) {
                throw new ApiException(500, "Unauthorized");
            }

            const updateHouse = await Houses.query().patchAndFetchById(id, {
                status: status,
            });
            if (updateHouse) {
                return res.json(formatJson.success(1001, "Update house status successful", updateHouse));
            } else {
                throw new ApiException(1002, "Update house status failed");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },
};

module.exports = HouseController;
