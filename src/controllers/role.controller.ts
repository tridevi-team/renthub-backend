import { messageResponse } from "../enums";
import type { Role } from "../interfaces";
import { HouseService, RoleService, UserService } from "../services";
import { ApiException, apiResponse, Exception, RedisUtils } from "../utils";

const prefix = "roles";
const cachePattern = `${prefix}:*`;

class RoleController {
    static async createRole(req, res) {
        const { houseId } = req.params;
        const { name, permissions, description, status }: Role = req.body;
        const user = req.user;
        try {
            const data = {
                houseId,
                name,
                permissions,
                description,
                status,
                createdBy: user.id,
            };
            const create = await RoleService.create(houseId, data);

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.CREATE_ROLE_SUCCESS, true, create));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRolesListByHouse(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination = {} } = req.query;

        const cacheKey = RedisUtils.generateCacheKeyWithFilter(prefix + `:getRolesListByHouse:${houseId}`, {
            filter,
            sort,
            pagination,
        });
        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const cacheData = await RedisUtils.getSetMembers(cacheKey);
                return res.json(
                    apiResponse(messageResponse.GET_ROLES_BY_HOUSE_SUCCESS, true, JSON.parse(cacheData[0]))
                );
            }
            const list = await RoleService.getByHouse(houseId);

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(list));

            return res.json(apiResponse(messageResponse.GET_ROLES_BY_HOUSE_SUCCESS, true, list));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRoleDetails(req, res) {
        const { roleId } = req.params;
        const cacheKey = RedisUtils.generateCacheKeyWithId(prefix, roleId, "details");
        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const cacheData = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_ROLE_DETAILS_SUCCESS, true, JSON.parse(cacheData[0])));
            }

            const details = await RoleService.getById(roleId);

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(details));

            return res.json(apiResponse(messageResponse.GET_ROLE_DETAILS_SUCCESS, true, details));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateRole(req, res) {
        const { roleId } = req.params;
        const { name, permissions, description, status }: Role = req.body;

        try {
            const data = { name, permissions, description, status };
            const update = await RoleService.update(roleId, data);

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.UPDATE_ROLE_SUCCESS, true, update));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateStatus(req, res) {
        const { roleId } = req.params;
        const { status } = req.body;
        try {
            const updateStatus = await RoleService.updateStatus(roleId, status);

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.UPDATE_ROLE_STATUS_SUCCESS, true, updateStatus));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async assignRole(req, res) {
        const { houseId } = req.params;
        const { userId, roleId } = req.body;
        const user = req.user;
        try {
            const houseDetails = await HouseService.getHouseById(houseId);
            await UserService.getUserById(userId);

            if (user.id === userId) throw new ApiException(messageResponse.CANNOT_ASSIGN_ROLE_TO_SELF, 403);
            if (userId === houseDetails.createdBy)
                throw new ApiException(messageResponse.CANNOT_ASSIGN_ROLE_TO_HOUSE_OWNER, 403);

            if (!roleId) {
                await RoleService.removeAssignedRole(userId, houseId);

                return res.json(apiResponse(messageResponse.REMOVE_ROLE_SUCCESS, true));
            }
            const data = await RoleService.assign(houseId, userId, roleId, user.id);

            return res.json(apiResponse(messageResponse.ASSIGN_ROLE_SUCCESS, true, data));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteRole(req, res) {
        const { roleId } = req.params;
        try {
            await RoleService.delete(roleId);

            // delete cache
            await RedisUtils.deletePattern(cachePattern);

            return res.json(apiResponse(messageResponse.DELETE_ROLE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default RoleController;
