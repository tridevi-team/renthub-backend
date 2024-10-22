import Objection from "objection";
import { EPagination, messageResponse } from "../enums";
import type { Filter, Role } from "../interfaces";
import { Roles, UserRoles } from "../models";
import { ApiException, camelToSnake, filterHandler, sortingHandler } from "../utils";

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

    static async getHouseId(roleId: string) {
        const role = await Roles.query().findById(roleId);

        if (!role) throw new ApiException(messageResponse.ROLE_NOT_FOUND, 404);

        return role.houseId;
    }

    static async getById(roleId: string) {
        const roleDetails = await Roles.query().findById(roleId);

        if (!roleDetails) throw new ApiException(messageResponse.ROLE_NOT_FOUND, 404);

        return roleDetails;
    }

    static async getByHouse(houseId: string, filterData?: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_LIMIT } = {},
        } = filterData || {};

        let query = Roles.query().where(camelToSnake({ houseId }));

        // Filter
        query = filterHandler(query, filter);

        // Sort
        query = sortingHandler(query, sort);

        const clone = query.clone();
        const total = await clone.resultSize();

        if (total === 0) throw new ApiException(messageResponse.HOUSE_NO_ROLE_CREATED, 404);

        const totalPages = Math.ceil(total / pageSize);

        if (page === -1 && pageSize === -1) await query.page(0, total);
        else await query.page(page - 1, pageSize);

        const fetchData = await query;

        return {
            ...fetchData,
            total,
            page,
            pageCount: totalPages,
            pageSize,
        };
    }

    static async getRolesByUser(userId: string, houseId: string) {
        const roles = await Roles.query()
            .join("user_roles", "roles.id", "user_roles.role_id")
            .where("user_id", userId)
            .andWhere("roles.house_id", houseId)
            .select("roles.permissions")
            .first();

        if (!roles) throw new ApiException(messageResponse.ROLE_NOT_FOUND, 404);

        return roles;
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
}

export default RoleService;
