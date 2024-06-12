"use strict";
import { Houses, HousePermissions } from "../models";
import { formatJson, jwtToken, checkHousePermissions, Exception, ApiException } from "../utils";
import { houseStatus, housePermissions } from "../enum/Houses";
import Objection from "objection";

const raw = Objection.raw;

const HouseController = {
    async getHouseList(req: any, res: any) {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                throw new ApiException(500, "Unauthorized");
            }

            const userVerify = await jwtToken.verify(authorization);
            if (!userVerify) {
                throw new ApiException(500, "Unauthorized");
            }

            const houses = await Houses.query()
                .leftJoin("house_permissions", "houses.id", "house_permissions.house_id")
                .where("houses.created_by", userVerify.id)
                .orWhere("house_permissions.user_id", userVerify.id)
                .select("houses.*")
                .orderBy("houses.id", "asc");

            if (!houses || houses.length === 0) {
                throw new ApiException(1007, "The house list is empty.");
            }
            return res.json(formatJson.success(1008, "Get house list successful", houses));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async createHouse(req, res) {
        try {
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
                return res.json(formatJson.success(1012, "Update house successful", updateHouse));
            } else {
                throw new ApiException(1011, "Update house failed");
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

            // check constraint before delete
            const rooms = await house.$relatedQuery("rooms");
            if (rooms.length > 0) {
                throw new ApiException(1010, "Delete house failed. The house has rooms.");
            }

            const deleteHouse = await Houses.query().deleteById(id);

            if (deleteHouse) {
                return res.json(formatJson.success(1009, "Delete house successful"));
            } else {
                throw new ApiException(1010, "Delete house failed");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async updateHouseStatus(req, res) {
        try {
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
                return res.json(formatJson.success(1013, "Update house status successful", updateHouse));
            } else {
                throw new ApiException(1014, "Update house status failed");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getHouseDetails(req, res) {
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
            const isAccess = await checkHousePermissions(userVerify.id, id, housePermissions.HOUSE_DETAILS);

            if (!isAccess) {
                throw new ApiException(500, "Unauthorized");
            }

            return res.json(formatJson.success(1015, "Get house details successful", house));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getUserHasAccessToHouse(req, res) {
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

            const isAccess = await checkHousePermissions(userVerify.id, id);
            if (!isAccess) {
                throw new ApiException(500, "Unauthorized");
            }

            const usersList = await HousePermissions.query()
                .joinRelated("permissions")
                .joinRelated("users")
                .where("house_id", id)
                .select("users.id", "users.full_name", "users.email", raw(`CONCAT('[', GROUP_CONCAT('"', permissions.key, '"'), ']') AS permissions`));

            if (!usersList) {
                throw new ApiException(1016, "The user list is empty.");
            }

            // const permissionsToArray = usersList.map((user) => {
            //     return {
            //         id: user.id,
            //         full_name: user.full_name,
            //         email: user.email,
            //         permissions: JSON.parse(user.permissions),
            //     };
            // });

            // console.log(permissionsToArray);

            return res.json(formatJson.success(1017, "Get user has access to house successful", null));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async grantPermissions(req, res) {
        try {
            const { authorization } = req.headers;
            if (!jwtToken.verify(authorization)) {
                throw new ApiException(500, "Unauthorized");
            }

            const { id } = req.params;
            const { userId, permissions } = req.body;

            const userVerify = await jwtToken.verify(authorization);

            const house = await Houses.query().findOne({ id, created_by: userVerify.id });
            if (!house) {
                throw new ApiException(1004, "House not found or you are not the owner of the house.");
            }

            // delete permissions not in the list
            const deletePer = await HousePermissions.query().delete().joinRelated("permissions").whereNotIn("permissions.key", permissions).andWhere("house_id", id).andWhere("user_id", userId);
            if (!deletePer) {
                throw new ApiException(1019, "Revoke permissions failed");
            }

            // insert permissions not exist
            permissions.forEach(async (per) => {
                const permissionExist = await HousePermissions.query().joinRelated("permissions").where("house_id", id).andWhere("user_id", userId).andWhere("permissions.key", per);
                if (!permissionExist) {
                    const addPer = await HousePermissions.query().insert({
                        house_id: id,
                        user_id: userId,
                        permission_id: per,
                    });
                    if (!addPer) {
                        throw new ApiException(1018, "Grant permissions failed");
                    }
                }
            });

            return res.json(formatJson.success(1020, "Grant permissions successful"));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },
};

export default HouseController;
