import { Action, Module } from "../enums";
import messageResponse from "../enums/message.enum";
import { HouseService, RenterService, RoomService } from "../services";
import RoleService from "../services/role.service";
import { ApiException, Exception } from "../utils";

// Generic authorization function
export const authorize = (module: Module, action: Action) => {
    // check renter permissions
    if (module === Module.RENTER) renterAuthorize(action);

    switch (module) {
        case Module.HOUSE:
        case Module.ROLE:
        case Module.ROOM:
        case Module.RENTER:
        case Module.BILL:
        case Module.SERVICE:
        case Module.EQUIPMENT:
        case Module.PAYMENT_METHOD:
            return authorizationMiddleware(module, action);
        default:
            throw new ApiException(messageResponse.UNKNOWN_ERROR, 500);
    }
};

const renterAuthorize = (action: Action) => {
    return async (req, res, next) => {
        const user = req.user;
        const { roomId, houseId, renterId } = req.params;
        try {
            if (user.type === "renter") {
                switch (action) {
                    case Action.CREATE:
                    case Action.UPDATE:
                    case Action.DELETE:
                        if (user.represent) {
                            const hasAccessRoom = await RenterService.isOwner(user.id, roomId);
                            if (hasAccessRoom) next();
                            else throw new ApiException(messageResponse.UNAUTHORIZED, 403);
                        } else throw new ApiException(messageResponse.UNAUTHORIZED, 403);
                        break;
                    case Action.READ:
                        const hasAccessRoom = await RenterService.isOwner(user.id, roomId);
                        const hasAccessHouse = await RenterService.accessHouse(user.id, houseId);
                        if (!hasAccessRoom && !hasAccessHouse) {
                            throw new ApiException(messageResponse.UNAUTHORIZED, 403);
                        }
                        next();
                        break;
                    default:
                        throw new ApiException(messageResponse.UNKNOWN_ERROR, 500);
                }
            } else {
                next();
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    };
};

// Main authorization middleware handler
const authorizationMiddleware = (module: Module, action: string) => {
    return async (req, res, next) => {
        const { houseId, roleId, roomId } = req.params;
        const user = req.user;

        try {
            // Check if user is owner or has access to the resource (if applicable)
            if (houseId) {
                const isOwner = await HouseService.isOwner(user.id, houseId);
                if (isOwner) return next();
                const isAccess = await HouseService.isAccessible(user.id, houseId, action);
                if (!isAccess) {
                    throw new ApiException(messageResponse.UNAUTHORIZED, 403);
                }
            }

            // Specific check for roles (when roleId is provided)
            if (roleId && module === Module.ROLE) {
                const isAccessRole = await RoleService.isAccessible(user.id, roleId, action);
                if (!isAccessRole) {
                    throw new ApiException(messageResponse.UNAUTHORIZED, 403);
                }
            }

            // Specific check for rooms (when roomId is provided)
            if (roomId && module === Module.ROOM) {
                const isAccessRoom = await RoomService.isRoomAccessible(user.id, roomId, action);
                if (!isAccessRoom) {
                    throw new ApiException(messageResponse.UNAUTHORIZED, 403);
                }
            }

            next();
        } catch (err) {
            Exception.handle(err, req, res);
        }
    };
};
