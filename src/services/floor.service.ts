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

    static async listByHouse(houseId: string, filterData?: Filter) {
        const { filter = [], sort = [], pagination } = filterData || {};

        const page = pagination?.page || EPagination.DEFAULT_PAGE;
        const pageSize = pagination?.pageSize || EPagination.DEFAULT_LIMIT;

        let query = HouseFloors.query().where("house_id", houseId);

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
}

export default FloorService;
