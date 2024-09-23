import { Action, Module } from "../enums";
import messageResponse from "../enums/message.enum";
import { HouseService } from "../services";
import RoleService from "../services/role.service";
import { ApiException, Exception } from "../utils";

// Generic authorization function
export const authorize = (module: Module, action: Action) => {
    switch (module) {
        case Module.HOUSE:
        case Module.ROLE:
        case Module.ROOM:
        case Module.BILL:
        case Module.SERVICE:
        case Module.EQUIPMENT:
        case Module.PAYMENT_METHOD:
            return authorizationMiddleware(module, action);
        default:
            throw new ApiException(messageResponse.UNKNOWN_ERROR, 500);
    }
};

// Main authorization middleware handler
const authorizationMiddleware = (module: Module, action: string) => {
    return async (req, res, next) => {
        const { houseId, roleId } = req.params;
        const user = req.user;

        try {
            // Check if user is owner or has access to the resource (if applicable)
            if (houseId) {
                const isOwner = await HouseService.isOwner(user.id, houseId);
                const isAccess = await HouseService.isAccessible(user.id, houseId, action);
                if (!isOwner && !isAccess) {
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

            next();
        } catch (err) {
            Exception.handle(err, req, res);
        }
    };
};
