import { HousePermissions } from "../enum/Houses";
import { ApiException, checkPermissions, Exception } from "../utils";
import { Request, Response, NextFunction } from "express";

const access = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = req.originalUrl;
        const { id, houseId } = req.params;
        const user = req.user;
        const house = houseId || id;

        if (!house) return next(); // If house ID is not present, move to the next middleware

        let permission: String = HousePermissions.HOUSE_OWNER;
        let isAccess = await checkPermissions(user.id, house, permission);

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
                            permission = perm;
                            break;
                        }
                    }
                }
            }

            isAccess = await checkPermissions(user.id, house, permission);
            console.log("Check access permission:", isAccess);

            if (!isAccess) throw new ApiException(500, "You don't have this permission.");
        }

        next();
    } catch (err) {
        Exception.handle(err, req, res);
    }
};

export default access;
