import assert from "assert";
import { TransactionOrKnex } from "objection";
import { EPagination, EquipmentStatus, EquipmentType, messageResponse } from "../enums";
import { EquipmentInfo, Filter } from "../interfaces";
import { Equipment, Houses } from "../models";
import { ApiException, camelToSnake, filterHandler, sortingHandler } from "../utils";

class EquipmentService {
    static async create(data: EquipmentInfo) {
        // check code is unique
        const details = await Equipment.query().findOne({ code: data.code, houseId: data.houseId });
        if (details) {
            throw new ApiException(messageResponse.EQUIPMENT_ALREADY_EXISTS, 400);
        }
        const equipment = await Equipment.query().insert(camelToSnake(data));
        return equipment;
    }

    static async getById(id: string) {
        const data = await Equipment.query()
            .findById(id)
            .leftJoin("house_floors as floor", "equipment.floor_id", "floor.id")
            .leftJoin("rooms", "equipment.room_id", "rooms.id")
            .select("equipment.*", "floor.name as floorName", "rooms.name as roomName");
        if (!data) {
            throw new ApiException(messageResponse.EQUIPMENT_NOT_FOUND, 404);
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
            .leftJoin("house_floors as floors", "equipment.floor_id", "floors.id")
            .leftJoin("rooms", "equipment.room_id", "rooms.id")
            .where("houses.id", houseId)
            .select("equipment.*", "floors.name as floorName", "rooms.name as roomName");

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

    static async listEquipmentByRoom(roomId: string, dataFilter?: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_LIMIT } = {},
        } = dataFilter || {};

        let query = Equipment.query().where((builder) => {
            // get equipment by room id or (house id and floor id and room id is null)
            builder.where("room_id", roomId).orWhere((builder) => {
                builder.where("house_id", roomId).whereNull("floor_id").whereNull("room_id");
            });
        });

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

    static async deleteMany(actionBy: string, houseId: string, ids: string[], trx?: TransactionOrKnex) {
        const equipment = await Equipment.query().whereIn("id", ids).andWhere("houseId", houseId);
        if (equipment.length === 0) {
            throw new ApiException(messageResponse.EQUIPMENT_NOT_FOUND, 404);
        }
        for (const item of equipment) {
            await item.$query(trx).patch(camelToSnake({ updatedBy: actionBy }));
            await item.$query(trx).delete();
        }
    }
}

export default EquipmentService;
