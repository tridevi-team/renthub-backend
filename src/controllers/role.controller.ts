import messageResponse from "../enums/message.enum";
import { Role } from "../interfaces";
import { HouseService, UserService } from "../services";
import RoleService from "../services/role.service";
import { ApiException, apiResponse, Exception } from "../utils";

class RoleController {
    static async createRole(req, res) {
        const { houseId } = req.params;
        const { name, permissions, description, status }: Role = req.body;
        const user = req.user;
        try {
            const data = { houseId, name, permissions, description, status, createdBy: user.id };
            const create = await RoleService.create(houseId, data);

            return res.json(apiResponse(messageResponse.CREATE_ROLE_SUCCESS, true, create));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRolesListByHouse(req, res) {
        const { houseId } = req.params;
        try {
            const list = await RoleService.getByHouse(houseId);

            return res.json(apiResponse(messageResponse.GET_ROLES_BY_HOUSE_SUCCESS, true, list));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getRoleDetails(req, res) {
        const { roleId } = req.params;
        try {
            const details = await RoleService.getById(roleId);
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
            if (userId === houseDetails.createdBy) throw new ApiException(messageResponse.CANNOT_ASSIGN_ROLE_TO_HOUSE_OWNER, 403);

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

            return res.json(apiResponse(messageResponse.DELETE_ROLE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default RoleController;
