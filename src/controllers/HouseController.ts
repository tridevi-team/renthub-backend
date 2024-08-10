"use strict";
import { Houses, HousePermissions, Rooms, Permissions } from "../models";
import { formatJson, Exception, ApiException } from "../utils";
import { HouseStatus, RoomStatus } from "../enum";
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
            const { name, address, numberOfFloors, numberOfRoomsPerFloor, description, contractDefault, status, maxRenters, squareMeter, avgPrice } = req.body;
            const totalRooms = numberOfFloors ? numberOfFloors * numberOfRoomsPerFloor : 0;

            console.log("avgPrice", avgPrice);

            const { user } = req;

            const houseExist = await Houses.query().findOne({ name, created_by: user.id });

            if (houseExist) {
                throw new ApiException(1003, "House already exist");
            }

            const statusDefault = status || HouseStatus.AVAILABLE.toString();

            const house = await Houses.query().insert({
                name,
                address,
                number_of_floors: numberOfFloors,
                number_of_rooms: totalRooms,
                description: description,
                contract_default: contractDefault,
                status: statusDefault,
                created_by: user.id,
            });

            if (!house) {
                throw new ApiException(1002, "Create house failed");
            }

            if (numberOfRoomsPerFloor) {
                for (let i = 1; i <= numberOfFloors; i++) {
                    for (let j = 1; j <= numberOfRoomsPerFloor; j++) {
                        const roomNumber = j < 9 ? `0${j}` : j;
                        const roomName = `Phòng ${i}${roomNumber}`;
                        console.log({
                            name: roomName,
                            house_id: house.id,
                            max_renters: maxRenters,
                            num_of_renters: 0,
                            floor: i,
                            price: avgPrice,
                            square_meter: squareMeter,
                        });

                        await Rooms.query().insert({
                            name: roomName,
                            house_id: house.id,
                            max_renters: maxRenters,
                            num_of_renters: 0,
                            floor: i,
                            price: avgPrice,
                            square_meter: squareMeter,
                            status: RoomStatus.AVAILABLE.toString(),
                            created_by: user.id,
                        });
                    }
                }
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

            const updateStatus = status || HouseStatus.AVAILABLE.toString();
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

            const usersList = await HousePermissions.query()
                .joinRelated("permissions")
                .joinRelated("users")
                .where("house_id", id)
                .select("users.id", "users.full_name", "users.email", raw(`CONCAT('[', GROUP_CONCAT('"', permissions.key, '"'), ']') AS permissions`));

            if (!usersList) {
                throw new ApiException(1016, "The user list is empty.");
            }

            const permissionsToArray = usersList.map((user) => {
                return {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    permissions: JSON.parse(user.permissions),
                };
            });

            return res.json(formatJson.success(1017, "Get user has access to house successful", permissionsToArray));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async getPermissionsByToken(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;

            // Fetch permissions associated with the user
            const permissions: {
                key: string;
            }[] = await HousePermissions.query().joinRelated("permissions").where("user_id", user.id).andWhere("house_id", id).select("permissions.key");

            const checkHouseOwner = await Houses.query().findOne({ id, created_by: user.id });

            if (checkHouseOwner) permissions.push({ key: "HOUSE_OWNER" });

            console.log("permissions", permissions);
            console.log("checkHouseOwner", checkHouseOwner);

            if (!permissions && !checkHouseOwner) {
                throw new ApiException(1018, "The permissions list is empty.");
            }

            // Fetch all permissions
            const permissionsList = await Permissions.query().select("key");

            // Initialize the permissions object
            const list = permissionsList.reduce((acc, per) => {
                if (per.key === "HOUSE_OWNER") return acc;

                const [action, key] = per.key.split("_");
                if (!acc[key]) acc[key] = {};
                acc[key][action] = false;

                return acc;
            }, {});

            // Update the list with the user's permissions
            if (checkHouseOwner) {
                Object.keys(list).forEach((key) => {
                    list[key] = { CREATE: true, READ: true, UPDATE: true, DELETE: true };
                });
            } else {
                permissions.forEach(({ key }) => {
                    const [action, keyName] = key.split("_");
                    if (list[keyName]) list[keyName][action] = true;
                });
            }

            return res.json(formatJson.success(1019, "Get permissions by token successful", list));
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
            // const deletePer = await HousePermissions.query().delete().joinRelated("permissions").whereNotIn("permissions.key", permissions).andWhere("house_id", id).andWhere("user_id", userId);
            // if (!deletePer) {
            //     throw new ApiException(1019, "Revoke permissions failed");
            // }

            // insert permissions not exist
            var list = await Promise.all(
                permissions.map(async (per: String) => {
                    const permissionExist = await HousePermissions.query().joinRelated("permissions").where("house_id", id).andWhere("user_id", userId).andWhere("permissions.key", per.toString());

                    if (permissionExist.length === 0) {
                        const getPer = await Permissions.query().findOne({ key: per });

                        const addPer = await HousePermissions.query().insert({
                            house_id: Number(id),
                            user_id: userId,
                            permission_id: getPer.id,
                            created_by: user.id,
                        });

                        if (!addPer) {
                            throw new ApiException(1018, "Grant permissions failed");
                        }

                        return addPer;
                    }
                })
            );

            return res.json(formatJson.success(1020, "Grant permissions successful", list));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },
};

export default HouseController;
