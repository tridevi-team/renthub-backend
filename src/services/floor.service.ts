import { EPagination, messageResponse } from "../enums";
import type { Filter, Floor } from "../interfaces";
import { HouseFloors } from "../models";
import { ApiException, camelToSnake, filterHandler, sortingHandler } from "../utils";

class FloorService {
    static async createFloor(data: Floor) {
        const floor = await HouseFloors.query().findOne({
            name: data.name,
            house_id: data.houseId,
        });

        if (floor) {
            throw new ApiException(messageResponse.FLOOR_ALREADY_EXISTS, 409);
        }

        const newFloor = await HouseFloors.query().insertAndFetch(camelToSnake(data));
        return newFloor;
    }

    static async getFloorById(floorId: string) {
        const floor = await HouseFloors.query().findById(floorId);
        if (!floor) {
            throw new ApiException(messageResponse.FLOOR_NOT_FOUND, 404);
        }
        return floor;
    }

    static async getFloorDetails(floorId: string) {
        const floor = await HouseFloors.query().findById(floorId);
        if (!floor) {
            throw new ApiException(messageResponse.FLOOR_NOT_FOUND, 404);
        }
        return floor;
    }

    static async listByHouse(houseId: string, filterData?: Filter, isSelect: boolean = false) {
        const { filter = [], sort = [], pagination } = filterData || {};

        const page = pagination?.page || EPagination.DEFAULT_PAGE;
        const pageSize = pagination?.pageSize || EPagination.DEFAULT_LIMIT;

        let query = HouseFloors.query().alias("floors").where("house_id", houseId);

        if (isSelect === true) {
            query = query.select("id", "name");
            const floors = await query;
            return floors;
        }

        // filter
        query = filterHandler(query, filter);

        // sort
        query = sortingHandler(query, sort);

        const clone = query.clone();
        const total = await clone.resultSize();
        const totalPages = Math.ceil(total / pageSize);

        if (page !== -1 && pageSize !== -1) {
            query.page(page - 1, pageSize);
        } else {
            query.page(0, total);
        }

        const fetchData = await query;

        return {
            ...fetchData,
            page,
            pageCount: totalPages,
            total,
            pageSize,
        };
    }

    static async floorIdsByHouse(houseId: string) {
        const floors = await HouseFloors.query().where("house_id", houseId).select("id");
        return floors.map((floor) => floor.id);
    }

    static async updateFloor(floorId: string, data: Floor) {
        const floor = await this.getFloorById(floorId);
        const updatedFloor = await floor.$query().patchAndFetch(camelToSnake(data));
        return updatedFloor;
    }

    static async deleteFloor(floorId: string, deletedBy: string) {
        const floor = await this.getFloorById(floorId);
        // update the deleted_by field
        await floor.$query().patch(camelToSnake({ updatedBy: deletedBy }));
        const deletedFloor = await floor.$query().delete();
        return deletedFloor;
    }

    static async deleteFloorsByHouse(houseId: string, floorIds: string[], deletedBy: string) {
        await HouseFloors.query().patch({ updatedBy: deletedBy }).whereIn("id", floorIds).andWhere("house_id", houseId);

        const deletedFloors = await HouseFloors.query().delete().whereIn("id", floorIds).andWhere("house_id", houseId);

        return deletedFloors;
    }
}

export default FloorService;
