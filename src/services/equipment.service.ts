import { Action, EquipmentStatus, EquipmentType, messageResponse } from "../enums";
import { EquipmentInfo, Pagination } from "../interfaces";
import { Equipment, Renters, Roles, Rooms, Users } from "../models";
import { ApiException, camelToSnake } from "../utils";

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

    static async listEquipment(
        filter: {
            houseId?: string;
            floorId?: string;
            roomId?: string;
            code?: string;
            name?: string;
            status?: string;
            sharedType?: string;
        },
        pagination: Pagination = { page: -1, pageSize: -1 },
        sort: { orderBy?: string; sortBy?: "DESC" | "ASC" } = { orderBy: "created_at", sortBy: "DESC" }
    ) {
        const { houseId, floorId, roomId } = filter;
        let query = Equipment.query().where((builder) => {
            if (filter.code) builder.where("code", filter.code);
            if (filter.name) builder.where("name", filter.name);
            if (filter.status) builder.where("status", filter.status);
            if (filter.sharedType) builder.where("shared_type", filter.sharedType);
        });

        if (houseId) {
            query = query.where("house_id", houseId);
        } else if (floorId) {
            query = query
                .where("floor_id", floorId)
                .joinRelated("floor")
                .select("equipment.*", "floor.name as floorName");
        } else if (roomId) {
            query = query.where("room_id", roomId).joinRelated("room").select("equipment.*", "room.name as roomName");
        }

        if (sort.orderBy && sort.sortBy) {
            query = query.orderBy(sort.orderBy, sort.sortBy);
        }

        if (pagination.page === -1 && pagination.pageSize === -1) {
            const data = await query;
            return [
                {
                    data,
                    pagination: {
                        total: data.length,
                        page: 1,
                        limit: data.length,
                    },
                },
            ];
        }
        const clone = await query.clone();
        if (!clone) {
            throw new ApiException(messageResponse.EQUIPMENT_NOT_FOUND, 404);
        }

        const data = await query.page(pagination.page - 1, pagination.pageSize);
        return data;
    }

    static async update(actionBy: string, id: string, data: EquipmentInfo) {
        const equipment = await this.getById(id);
        if (!equipment) {
            throw new ApiException(messageResponse.EQUIPMENT_NOT_FOUND, 404);
        }
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
