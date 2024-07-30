import { HousePermissions } from "../enum/Houses";
import { Equipment, Renters, Rooms } from "../models";
import { ApiException, checkPermissions, Exception } from "../utils";
import { Request, Response, NextFunction } from "express";

const access = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Check access");

        const url = req.originalUrl;
        let id: Number = req.params.id || req.params.houseId;
        const user = req.user;

        let permission: String = HousePermissions.HOUSE_OWNER;
        let isAccess = await checkPermissions(user.id, id, permission);

        console.log("Check house owner permission:", isAccess);

        if (!isAccess) {
            const permissionMap: { [key: string]: { [key: string]: string } } = {
                houses: {
                    details: HousePermissions.HOUSE_DETAILS,
                    update: HousePermissions.UPDATE_HOUSE,
                    delete: HousePermissions.DELETE_HOUSE,
                },
                rooms: {
                    create: HousePermissions.CREATE_ROOMS,
                    details: HousePermissions.READ_ROOMS,
                    list: HousePermissions.READ_ROOMS,
                    update: HousePermissions.UPDATE_ROOMS,
                    delete: HousePermissions.DELETE_ROOMS,
                },
                services: {
                    create: HousePermissions.CREATE_SERVICES,
                    details: HousePermissions.READ_SERVICES,
                    list: HousePermissions.READ_SERVICES,
                    update: HousePermissions.UPDATE_SERVICES,
                    delete: HousePermissions.DELETE_SERVICES,
                },
                bills: {
                    create: HousePermissions.CREATE_BILLS,
                    details: HousePermissions.READ_BILLS,
                    list: HousePermissions.READ_BILLS,
                    update: HousePermissions.UPDATE_BILLS,
                    delete: HousePermissions.DELETE_BILLS,
                },
                equipments: {
                    create: HousePermissions.CREATE_EQUIPMENTS,
                    details: HousePermissions.READ_EQUIPMENTS,
                    list: HousePermissions.READ_EQUIPMENTS,
                    update: HousePermissions.UPDATE_EQUIPMENTS,
                    delete: HousePermissions.DELETE_EQUIPMENTS,
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
