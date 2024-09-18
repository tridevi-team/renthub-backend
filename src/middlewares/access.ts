import { HousePermissions } from "../enum/Houses";
import { Equipment, Houses, Renters, Rooms } from "../models";
import { ApiException, checkPermissions, Exception } from "../utils";
import { Request, Response, NextFunction } from "express";

const access = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Check access");

        const url = req.originalUrl;
        let id: Number = Number(req.params.id) || Number(req.params.houseId);
        const user = req.user;
        const isHouseExist = await Houses.query().findById(id as number);
        if (!isHouseExist) {
            throw new ApiException(1004, "House not found.");
        }
        if (url.includes("permissionsByUser")) {
            next();
            return;
        }
        let permission: String = HousePermissions.HOUSE_OWNER;
        let isAccess = await checkPermissions(user.id, id, permission);

        console.log("Check house owner permission:", isAccess);

        if (!isAccess) {
            const permissionMap: { [key: string]: { [key: string]: string } } = {
                houses: {
                    details: HousePermissions.READ_HOUSE,
                    update: HousePermissions.UPDATE_HOUSE,
                    delete: HousePermissions.DELETE_HOUSE,
                },
                rooms: {
                    create: HousePermissions.CREATE_ROOM,
                    details: HousePermissions.READ_ROOM,
                    list: HousePermissions.READ_ROOM,
                    update: HousePermissions.UPDATE_ROOM,
                    delete: HousePermissions.DELETE_ROOM,
                },
                services: {
                    create: HousePermissions.CREATE_SERVICE,
                    details: HousePermissions.READ_SERVICE,
                    list: HousePermissions.READ_SERVICE,
                    update: HousePermissions.UPDATE_SERVICE,
                    delete: HousePermissions.DELETE_SERVICE,
                },
                bills: {
                    create: HousePermissions.CREATE_BILL,
                    details: HousePermissions.READ_BILL,
                    list: HousePermissions.READ_BILL,
                    update: HousePermissions.UPDATE_BILL,
                    delete: HousePermissions.DELETE_BILL,
                },
                equipments: {
                    create: HousePermissions.CREATE_EQUIPMENT,
                    details: HousePermissions.READ_EQUIPMENT,
                    list: HousePermissions.READ_EQUIPMENT,
                    update: HousePermissions.UPDATE_EQUIPMENT,
                    delete: HousePermissions.DELETE_EQUIPMENT,
                },
            };

            for (const [entity, actions] of Object.entries(permissionMap)) {
                if (url.includes(entity)) {
                    for (const [action, perm] of Object.entries(actions)) {
                        if (url.includes(action)) {
                            if (url.includes("houses")) {
                                id = req.params.id;
                            } else if (url.includes("rooms") || url.includes("services") || url.includes("equipments")) {
                                id = req.params.houseId;
                            } else if (url.includes("renters")) {
                                const houseId = req.params.houseId;
                                const roomId = req.params.roomId;
                                const renterId = req.params.renterId;
                                const equipmentId = req.params.equipmentId;

                                if (houseId) {
                                    id = houseId;
                                } else if (roomId) {
                                    const roomInfo = await Rooms.query().findById(roomId);
                                    id = roomInfo.house_id;
                                } else if (renterId) {
                                    const renterInfo = await Renters.query().join("rooms", "renters.room_id", "rooms.id").select("rooms.house_id").where("renters.id", renterId).first();
                                    id = renterInfo.house_id;
                                } else if (equipmentId) {
                                    const equipmentInfo = await Equipment.query().findById(equipmentId);
                                    id = equipmentInfo.house_id;
                                }
                            }
                            permission = perm;
                            break;
                        }
                    }
                }
            }

            isAccess = await checkPermissions(user.id, id, permission);
            console.log("Check access permission:", permission, isAccess);

            if (!isAccess) throw new ApiException(500, "You don't have this permission.");
        }

        next();
    } catch (err) {
        Exception.handle(err, req, res);
    }
};

export default access;
