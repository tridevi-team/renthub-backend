import { messageResponse } from "../enums";
import type { Floor } from "../interfaces";
import { HouseFloors } from "../models";
import { ApiException, camelToSnake } from "../utils";

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

    static async listByHouse(houseId: string) {
        const floors = await HouseFloors.query().where("house_id", houseId);
        if (floors.length === 0) {
            throw new ApiException(messageResponse.NO_FLOORS_FOUND, 404);
        }
        return floors;
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
