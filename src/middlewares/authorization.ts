import { Action, messageResponse, Module } from "../enums";
import { HouseService } from "../services";
import { ApiException, Exception } from "../utils";

export const authorize = (module: Module, action: Action) => {
    return async (req, res, next) => {
        const user = req.user;
        try {
            if (user.roomId) {
                await renterAuthorize(module, action)(req, res, next);
            } else {
                await managerAuthorize(module, action)(req, res, next);
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    };
};

const renterAuthorize = (module: Module, action: Action) => {
    return async (req, _res, next) => {
        const user = req.user;
        const { roomId, houseId, equipmentId, paymentId, issueId, renterId, serviceId, floorId, billId } = req.params;
        // get renter location (houseId, floorId, roomId)

        const renterRoomId = user.roomId;

        if (renterRoomId !== roomId) {
            throw new ApiException(messageResponse.UNAUTHORIZED, 403);
        } else if (![Module.RENTER, Module.ISSUE].includes(module) && action !== Action.READ) {
            throw new ApiException(messageResponse.UNAUTHORIZED, 403);
        }

        const isAccess = await HouseService.isRenterAccessToResource(user.id, {
            houseId,
            roomId,
            floorId,
            equipmentId,
            paymentId,
            issueId,
            renterId,
            serviceId,
            billId,
        });

        if (!isAccess) {
            throw new ApiException(messageResponse.UNAUTHORIZED, 403);
        }

        return next();
    };
};

const managerAuthorize = (module: Module, action: Action) => {
    return async (req, _res, next) => {
        const user = req.user;
        const { roomId, roleId, houseId, equipmentId, paymentId, issueId, renterId, serviceId, floorId, billId } =
            req.params;

        const houseOwner = await HouseService.isOwner(user.id, houseId);
        if (houseOwner) return next();

        const resource = {
            houseId,
            roomId,
            floorId,
            equipmentId,
            paymentId,
            billId,
            serviceId,
            issueId,
            renterId,
            roleId,
        };

        const isAccess = await HouseService.isAccessToResource(user.id, resource, module, action);
        if (!isAccess) {
            throw new ApiException(messageResponse.UNAUTHORIZED, 403);
        }

        return next();
    };
};
