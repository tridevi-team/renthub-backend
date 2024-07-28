"use strict";
import { Houses, HousePermissions } from "../models";
import { formatJson, jwtToken, Exception, ApiException } from "../utils";
import { houseStatus, housePermissions } from "../enum/Houses";
import Objection from "objection";

const raw = Objection.raw;

const HouseController = {
    async getHouseList(req: any, res: any) {
        try {
            const { user } = req;

            const houses = await Houses.query()
                .leftJoin("house_permissions", "houses.id", "house_permissions.house_id")
                .where("houses.created_by", user.id)
                .orWhere("house_permissions.user_id", user.id)
                .select("houses.*")
                .orderBy("houses.id", "asc");

            // const houses = (await Houses.query()).find((house) => house === user.id);
            // let houses = [];

            if (!houses) {
                return res.json(formatJson.success(1007, "The house list is empty", []));
            }
            return res.json(formatJson.success(1008, "Get house list successful", houses));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async createHouse(req, res) {
        try {
            const { name, address, numberOfFloors, numberOfRooms, description, contractDefault, status } = req.body;

            const { user } = req;

            const houseExist = await Houses.query().findOne({ name, created_by: user.id });

            if (houseExist) {
                throw new ApiException(1003, "House already exist");
            }

            const statusDefault = status || houseStatus.AVAILABLE;

            const house = await Houses.query().insert({
                name,
                address,
                number_of_floors: numberOfFloors,
                number_of_rooms: numberOfRooms,
                description: description,
                contract_default: contractDefault,
                status: statusDefault,
                created_by: user.id,
            });

            if (!house) {
                throw new ApiException(1002, "Create house failed");
            }

            return res.json(formatJson.success(1001, "Create house successful", house));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async updateHouseDetails(req, res) {
        try {
            const { id } = req.params;
            const { name, address, numberOfFloors, status } = req.body;

            const user = req.user;

            const house = await Houses.query().findOne({ id });
            if (!house) {
                throw new ApiException(1004, "House not found");
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
            const { id } = req.params;
            const user = req.user;

            const house = await Houses.query().findOne({ id });
            if (!house) {
                throw new ApiException(1004, "House not found");
            }

            // check constraint before delete
            const rooms = await house.$relatedQuery("rooms");
            if (rooms.length > 0) {
                throw new ApiException(1010, "Delete house failed. The house has rooms.");
            }

            const deleteHouse = await Houses.query().deleteById(id);

            if (!deleteHouse) {
                throw new ApiException(1010, "Delete house failed");
            }

            return res.json(formatJson.success(1009, "Delete house successful"));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async updateHouseStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const user = req.user;

            const house = await Houses.query().findOne({ id });
            if (!house) {
                throw new ApiException(1004, "House not found");
            }

            const updateHouse = await Houses.query().patchAndFetchById(id, {
                status: status,
            });

            if (!updateHouse) {
                throw new ApiException(1014, "Update house status failed");
            }

            return res.json(formatJson.success(1013, "Update house status successful", updateHouse));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getHouseDetails(req, res) {
        try {
            const { id } = req.params;

            const user = req.user;

            const house = await Houses.query().findOne({ id });
            if (!house) {
                throw new ApiException(1004, "House not found");
            }

            return res.json(formatJson.success(1015, "Get house details successful", house));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getUserHasAccessToHouse(req, res) {
        try {
            const { id } = req.params;

            const user = req.user;

            const house = await Houses.query().findOne({ id });
            if (!house) {
                throw new ApiException(1004, "House not found");
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
            const { id } = req.params;
            const { userId, permissions } = req.body;

            const user = req.user;

            const house = await Houses.query().findOne({ id, created_by: user.id });
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
