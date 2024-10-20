import { messageResponse } from "../enums";
import { FloorService } from "../services";
import { apiResponse, Exception, RedisUtils } from "../utils";

const prefix = "floors";

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

            // delete cache
            const cacheKey = `${prefix}:*`;

            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.CREATE_FLOOR_SUCCESS, true, newFloor));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getFloorsByHouse(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;
        try {
            const cacheKey = RedisUtils.generateCacheKeyWithFilter(prefix, {
                filter,
                sort,
                pagination,
            });
            const cache = await RedisUtils.isExists(cacheKey);

            if (cache) {
                const result = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_FLOOR_BY_HOUSE_SUCCESS, true, JSON.parse(result[0])));
            }
            const floors = await FloorService.listByHouse(houseId);

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(floors));

            return res.json(apiResponse(messageResponse.GET_FLOOR_BY_HOUSE_SUCCESS, true, floors));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getFloorDetails(req, res) {
        const { floorId } = req.params;
        try {
            const cacheKey = RedisUtils.generateCacheKeyWithId(prefix, floorId, "details");
            const cache = await RedisUtils.isExists(cacheKey);
            if (cache) {
                const result = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_FLOOR_DETAILS_SUCCESS, true, JSON.parse(result[0])));
            }

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

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

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

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.DELETE_FLOOR_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default FloorController;
