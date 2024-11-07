import { Action, messageResponse, Module } from "../enums";
import {
    BillService,
    EquipmentService,
    FloorService,
    HouseService,
    PaymentService,
    RenterService,
    RoleService,
    RoomService,
} from "../services";
import IssueService from "../services/issue.service";
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
        let houseIdAccess: string = houseId;
        if (houseId) {
            const houseData = await HouseService.getHouseById(houseId);
            houseIdAccess = houseData.id;
        } else if (roomId) {
            houseIdAccess = await RoomService.getHouseId(roomId);
        } else if (floorId) {
            const floorDetails = await FloorService.getFloorById(floorId);
            houseIdAccess = floorDetails.houseId;
        } else if (equipmentId) {
            const equipmentDetails = await EquipmentService.getById(equipmentId);
            if (!equipmentDetails) return false;
            houseIdAccess = equipmentDetails.houseId;
        } else if (paymentId) {
            const paymentDetails = await PaymentService.getById(paymentId);
            houseIdAccess = paymentDetails.houseId;
        } else if (billId) {
            houseIdAccess = await BillService.getHouseId(billId);
        } else if (serviceId) {
            const serviceDetails = await HouseService.getServiceDetails(serviceId);
            houseIdAccess = serviceDetails.houseId;
        } else if (issueId) {
            houseIdAccess = await IssueService.getHouseId(issueId);
        } else if (renterId) {
            houseIdAccess = await RenterService.getHouseId(renterId);
        } else if (roleId) {
            houseIdAccess = await RoleService.getHouseId(roleId);
        }

        const houseOwner = await HouseService.isOwner(user.id, houseIdAccess);
        if (houseOwner) return next();

        const isAccess = await HouseService.isAccessToResource(user.id, houseId, module, action);
        if (!isAccess) {
            throw new ApiException(messageResponse.UNAUTHORIZED, 403);
        }

        return next();
    };
};
