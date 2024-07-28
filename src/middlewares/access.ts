import { housePermissions } from "../enum/Houses";
import { ApiException, checkPermissions, Exception } from "../utils";
import { Request, Response, NextFunction } from "express";

const access = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = req.originalUrl;
        const { id, houseId } = req.params;
        const user = req.user;
        const house = houseId || id;

        if (!house) return next(); // If house ID is not present, move to the next middleware

        let permission = housePermissions.HOUSE_OWNER;
        let isAccess = await checkPermissions(user.id, house, permission);

        console.log("Check house owner permission:", isAccess);

        if (!isAccess) {
            const permissionMap: { [key: string]: { [key: string]: string } } = {
                houses: {
                    details: housePermissions.HOUSE_DETAILS,
                    update: housePermissions.UPDATE_HOUSE,
                    delete: housePermissions.DELETE_HOUSE,
                },
                rooms: {
                    create: housePermissions.CREATE_ROOMS,
                    details: housePermissions.READ_ROOMS,
                    list: housePermissions.READ_ROOMS,
                    update: housePermissions.UPDATE_ROOMS,
                    delete: housePermissions.DELETE_ROOMS,
                },
                services: {
                    create: housePermissions.CREATE_SERVICES,
                    details: housePermissions.READ_SERVICES,
                    list: housePermissions.READ_SERVICES,
                    update: housePermissions.UPDATE_SERVICES,
                    delete: housePermissions.DELETE_SERVICES,
                },
                bills: {
                    create: housePermissions.CREATE_BILLS,
                    details: housePermissions.READ_BILLS,
                    list: housePermissions.READ_BILLS,
                    update: housePermissions.UPDATE_BILLS,
                    delete: housePermissions.DELETE_BILLS,
                },
                equipments: {
                    create: housePermissions.CREATE_EQUIPMENTS,
                    details: housePermissions.READ_EQUIPMENTS,
                    list: housePermissions.READ_EQUIPMENTS,
                    update: housePermissions.UPDATE_EQUIPMENTS,
                    delete: housePermissions.DELETE_EQUIPMENTS,
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