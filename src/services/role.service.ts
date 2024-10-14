import Objection from "objection";
import { messageResponse } from "../enums";
import type { Role } from "../interfaces";
import { Roles, UserRoles } from "../models";
import { ApiException, camelToSnake } from "../utils";

class RoleService {
    static async create(houseId: string, data: Role) {
        // check name by house
        const isNameExists = await Roles.query().findOne(
            camelToSnake({
                houseId,
                name: data.name,
            })
        );

        if (isNameExists) throw new ApiException(messageResponse.ROLE_NAME_ALREADY_EXISTS, 409);

        const createRole = await Roles.query().insert(camelToSnake(data));

        return createRole;
    }

    static async getById(roleId: string) {
        const roleDetails = await Roles.query().findById(roleId);

        if (!roleDetails) throw new ApiException(messageResponse.ROLE_NOT_FOUND, 404);

        return roleDetails;
    }

    static async getByHouse(houseId: string) {
        const rolesList = await Roles.query().where(camelToSnake({ houseId }));
        if (rolesList.length === 0) throw new ApiException(messageResponse.HOUSE_NO_ROLE_CREATED, 404);

        return rolesList;
    }

    static async update(roleId: string, data: Role) {
        const roleDetails = await this.getById(roleId);
        // check name by house
        const isNameExists = await Roles.query().findOne(
            camelToSnake({
                houseId: roleDetails.houseId,
                name: data.name,
            })
        );

        if (isNameExists && isNameExists.id !== roleId)
            throw new ApiException(messageResponse.ROLE_NAME_ALREADY_EXISTS, 409);

        const updatedRow = await roleDetails.$query().patch(camelToSnake(data));

        const isUpdated = updatedRow > 0;

        if (!isUpdated) throw new ApiException(messageResponse.UPDATE_ROLE_ERROR, 500);

        return roleDetails;
    }

    static async delete(roleId: string) {
        try {
            const details = await this.getById(roleId);
            const deletedRow = await details.$query().delete();
            const isDeleted = deletedRow > 0;
            if (!isDeleted) throw new ApiException(messageResponse.DELETE_ROLE_ERROR, 500);
        } catch (error) {
            if (error instanceof Objection.ForeignKeyViolationError)
                throw new ApiException(messageResponse.CANNOT_DELETE_ROLE_ASSIGNED_TO_USER, 409);
        }
    }

    static async updateStatus(roleId: string, status: boolean) {
        const roleDetails = await this.getById(roleId);

        const updatedRow = await roleDetails.$query().patch({ status });

        const isUpdated = updatedRow > 0;

        if (!isUpdated) throw new ApiException(messageResponse.UPDATE_ROLE_ERROR, 500);

        return roleDetails;
    }

    static async assign(houseId: string, userId: string, roleId: string, createdBy: string) {
        const isExists = await UserRoles.query().findOne(
            camelToSnake({
                userId,
                houseId,
            })
        );

        if (isExists)
            return await isExists.$query().patchAndFetch(
                camelToSnake({
                    roleId,
                    createdBy,
                })
            );

        return await UserRoles.query().insertAndFetch(
            camelToSnake({
                userId,
                houseId,
                roleId,
                createdBy,
            })
        );
    }

    static async isAccessible(userId: string, roleId: string, action: string): Promise<boolean> {
        const role = await Roles.query().findById(roleId);

        if (!role) throw new ApiException(messageResponse.ROLE_NOT_FOUND, 404);
        // get houseId
        const houseDetails = await Roles.query()
            .join("houses", "roles.house_id", "houses.id")
            .where("roles.id", roleId)
            .select("houses.created_by")
            .first();
        if (!houseDetails) throw new ApiException(messageResponse.HOUSE_NOT_FOUND, 404);

        if (houseDetails.createdBy === userId) return true;

        // get house permissions
        const housePermissions = await Roles.query()
            .leftJoin("user_roles", "roles.id", "user_roles.role_id")
            .where("roles.id", roleId)
            .andWhere("user_id", userId)
            .select("roles.permissions")
            .first();

        if (!housePermissions?.permissions) return false;
        else if (action === "read") {
            return (
                housePermissions.permissions.role.read ||
                housePermissions.permissions.role.update ||
                housePermissions.permissions.role.delete
            );
        }

        return true;
    }
}

export default RoleService;
