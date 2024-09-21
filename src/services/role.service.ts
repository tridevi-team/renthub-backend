import messageResponse from "../enums/message.enum";
import { Role } from "../interfaces";
import { Roles, UserRoles } from "../models";
import { ApiException } from "../utils";
import camelToSnake from "../utils/camelToSnake";

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
        if (!rolesList) throw new ApiException(messageResponse.HOUSE_NO_ROLE_CREATED, 404);

        return rolesList;
    }

    static async update(roleId: string, data: Role) {
        const roleDetails = await this.getById(roleId);

        const updatedRow = await roleDetails.$query().patch(camelToSnake(data));

        const isUpdated = updatedRow > 0;

        if (!isUpdated) throw new ApiException(messageResponse.UPDATE_ROLE_ERROR, 500);

        return roleDetails;
    }

    static async delete(roleId: string) {
        const details = await this.getById(roleId);

        const deletedRow = await details.$query().delete();

        const isDeleted = deletedRow > 0;

        if (!isDeleted) throw new ApiException(messageResponse.DELETE_ROLE_ERROR, 500);
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

        return await UserRoles.query().insert(
            camelToSnake({
                userId,
                houseId,
                roleId,
                createdBy,
            })
        );
    }
}

export default RoleService;
