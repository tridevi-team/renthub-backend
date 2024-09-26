import messageResponse from "../enums/message.enum";
import FloorService from "../services/floor.service";
import { apiResponse, Exception } from "../utils";

class FloorController {
    static async createFloor(req, res) {
        const { houseId } = req.params;
        const { name, description } = req.body;
        const userId = req.user.id;
        try {
            const newFloor = await FloorService.createFloor({
                houseId,
                name,
                description,
                createdBy: userId,
                updatedBy: userId,
            });

            return res.json(apiResponse(messageResponse.CREATE_FLOOR_SUCCESS, true, newFloor));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getFloorsByHouse(req, res) {
        const { houseId } = req.params;
        try {
            const floors = await FloorService.listByHouse(houseId);
            return res.json(apiResponse(messageResponse.GET_FLOOR_BY_HOUSE_SUCCESS, true, floors));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getFloorDetails(req, res) {
        const { floorId } = req.params;
        try {
            const floor = await FloorService.getFloorDetails(floorId);
            return res.json(apiResponse(messageResponse.GET_FLOOR_DETAILS_SUCCESS, true, floor));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateFloor(req, res) {
        const { floorId } = req.params;
        const { name, description } = req.body;
        const userId = req.user.id;
        try {
            const updatedFloor = await FloorService.updateFloor(floorId, {
                name,
                description,
                updatedBy: userId,
            });

            return res.json(apiResponse(messageResponse.UPDATE_FLOOR_SUCCESS, true, updatedFloor));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteFloor(req, res) {
        const { floorId } = req.params;
        const userId = req.user.id;
        try {
            await FloorService.deleteFloor(floorId, userId);
            return res.json(apiResponse(messageResponse.DELETE_FLOOR_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default FloorController;
