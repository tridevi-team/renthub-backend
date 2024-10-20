import assert from "assert";
import { Action, EPagination, EquipmentStatus, EquipmentType, messageResponse } from "../enums";
import { EquipmentInfo, Filter } from "../interfaces";
import { Equipment, Houses, Renters, Roles, Rooms, Users } from "../models";
import { ApiException, camelToSnake, filterHandler, sortingHandler } from "../utils";

class EquipmentService {
    static async create(data: EquipmentInfo) {
        // check code is unique
        const details = await Equipment.query().findOne({ code: data.code });
        if (details) {
            throw new ApiException(messageResponse.EQUIPMENT_ALREADY_EXISTS, 400);
        }
        const equipment = await Equipment.query().insert(camelToSnake(data));
        return equipment;
    }

    static async getById(id: string) {
        const data = await Equipment.query().findById(id);
        if (!data) {
            throw new ApiException(messageResponse.EQUIPMENT_NOT_FOUND, 404);
        } else if (data.floorId) {
            const data = await Equipment.query()
                .findById(id)
                .joinRelated("floor")
                .select("equipment.*", "floor.name as floorName");
            return data;
        } else if (data.roomId) {
            const data = await Equipment.query()
                .findById(id)
                .joinRelated("room")
                .select("equipment.*", "room.name as roomName");
            return data;
        }
        return data;
    }

    static async listEquipment(houseId: string, dataFilter?: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_LIMIT } = {},
        } = dataFilter || {};

        let query = Houses.query()
            .join("equipment", "houses.id", "equipment.houseId")
            .leftJoin("house_floors", "equipment.floor_id", "house_floors.id")
            .leftJoin("rooms", "equipment.room_id", "rooms.id")
            .where("houses.id", houseId)
            .select("equipment.*", "house_floors.name as floorName", "rooms.name as roomName");

        // filter
        query = filterHandler(query, filter);

        // sort
        query = sortingHandler(query, sort);

        // clone
        const clone = query.clone();
        const total = await clone.resultSize();

        if (total === 0) throw new ApiException(messageResponse.EQUIPMENT_NOT_FOUND, 404);

        const totalPages = Math.ceil(total / pageSize);

        if (page === -1 && pageSize === -1) {
            await query.page(0, total);
        } else {
            await query.page(page - 1, pageSize);
        }

        const fetchData = await query;

        return {
            ...fetchData,
            total,
            page,
            pageCount: totalPages,
            pageSize,
        };
    }

    static async update(actionBy: string, id: string, data: EquipmentInfo) {
        const equipment = await this.getById(id);
        assert(equipment);
        await equipment.$query().patch(camelToSnake({ updatedBy: actionBy }));
        await equipment.$query().patchAndFetch(camelToSnake(data));
        return equipment;
    }

    static async updateStatus(
        actionBy: string,
        id: string,
        data: { status?: EquipmentStatus; sharedType?: EquipmentType }
    ) {
        const equipment = await this.getById(id);
        if (!equipment) {
            throw new ApiException(messageResponse.EQUIPMENT_NOT_FOUND, 404);
        }
        await equipment.$query().patch(camelToSnake({ updatedBy: actionBy }));
        if (data.status) {
            await equipment.$query().patch(camelToSnake({ status: data.status }));
        }
        if (data.sharedType) {
            await equipment.$query().patch(camelToSnake({ sharedType: data.sharedType }));
        }
        return equipment;
    }

    static async delete(actionBy: string, id: string) {
        const equipment = await this.getById(id);
        if (!equipment) {
            throw new ApiException(messageResponse.EQUIPMENT_NOT_FOUND, 404);
        }
        await equipment.$query().patch(camelToSnake({ updatedBy: actionBy }));
        await equipment.$query().delete();
        return equipment;
    }

    static async isAccessible(userId: string, equipmentId: string, action: string) {
        const userData = (await Users.query().findById(userId)) || (await Renters.query().findById(userId));
        if (userData instanceof Users) {
            // owner check
            const isOwner = await Equipment.query().findById(equipmentId).joinRelated("house").findOne({
                "house.createdBy": userId,
                "equipment.id": equipmentId,
            });
            if (isOwner) return true;
            else {
                // access check
                const equipment = await Equipment.query().findById(equipmentId);
                if (!equipment) return false;

                const isAccess = await Roles.query()
                    .joinRelated("userRoles")
                    .findOne(
                        camelToSnake({
                            "userRoles.userId": userId,
                            "userRoles.houseId": equipment.houseId,
                        })
                    );

                if (!isAccess) return false;

                if (action === Action.READ) {
                    return (
                        isAccess.permissions.equipment.create ||
                        isAccess.permissions.equipment.read ||
                        isAccess.permissions.equipment.update ||
                        isAccess.permissions.equipment.delete
                    );
                } else if (action === Action.UPDATE) {
                    return isAccess.permissions.equipment.update;
                } else if (action === Action.DELETE) {
                    return isAccess.permissions.equipment.delete;
                } else if (action === Action.CREATE) {
                    return isAccess.permissions.equipment.create;
                }
            }
        } else if (userData instanceof Renters) {
            if (!userData.represent) return false;

            const houseData = await Rooms.query().joinRelated("floor").joinRelated("house").findOne({
                "rooms.id": userData.roomId,
            });
            if (!houseData) return false;

            const equipment = await Equipment.query().findOne({
                "equipment.id": equipmentId,
                "equipment.houseId": houseData.houseId,
            });

            if (!equipment) return false;
            return true;
        }
        return false;
    }
}

export default EquipmentService;
