import { EPagination, messageResponse } from "../enums";
import { Filter, IssueRequest } from "../interfaces";
import { Houses, Issues } from "../models";
import { ApiException, camelToSnake, filterHandler, sortingHandler } from "../utils";
import { UserService } from "./";

class IssueService {
    static async getById(id: string) {
        const details = await Issues.query()
            .leftJoin("house_floors", "house_floors.id", "issues.floor_id")
            .leftJoin("rooms", "rooms.id", "issues.room_id")
            .leftJoin("equipment", "equipment.id", "issues.equipment_id")
            .leftJoin("renters", "renters.id", "issues.created_by")
            .leftJoin("users as assignee", "assignee.id", "issues.assign_to")
            .select(
                "issues.*",
                "house_floors.name as floorName",
                "rooms.name as roomName",
                "equipment.name as equipmentName",
                "renters.name as createdName",
                "assignee.full_name as assigneeName"
            )
            .findById(id);

        if (!details) throw new ApiException(messageResponse.ISSUE_NOT_FOUND, 404);

        return details;
    }

    static async search(houseId: string, filterData?: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_LIMIT } = {},
        } = filterData || {};

        let query = Houses.query()
            .join("issues", "houses.id", "issues.house_id")
            .leftJoin("house_floors", "house_floors.id", "issues.floor_id")
            .leftJoin("rooms", "rooms.id", "issues.room_id")
            .leftJoin("equipment", "equipment.id", "issues.equipment_id")
            .leftJoin("renters", "renters.id", "issues.created_by")
            .leftJoin("users as assignee", "assignee.id", "issues.assign_to")
            .select(
                "issues.*",
                "houses.name as houseName",
                "house_floors.name as floorName",
                "rooms.name as roomName",
                "equipment.name as equipmentName",
                "renters.name as createdName",
                "assignee.full_name as assigneeName"
            )
            .where("houses.id", houseId);

        query = filterHandler(query, filter);

        query = sortingHandler(query, sort);

        const clone = query.clone();
        const total = await clone.resultSize();

        if (total === 0) throw new ApiException(messageResponse.NO_ISSUES_FOUND, 404);

        const totalPages = Math.ceil(total / pageSize);

        if (page === -1 && pageSize === -1) {
            await query.page(0, total);
        } else {
            await query.page(page - 1, pageSize);
        }

        const fetchData = await query;

        return {
            ...fetchData,
            total,
            page,
            pageCount: totalPages,
            pageSize,
        };
    }

    static async create(data: IssueRequest) {
        const issue = await Issues.query().insert(camelToSnake(data));

        return issue;
    }

    static async update(id: string, data: IssueRequest) {
        const issue = await this.getById(id);

        const updated = issue.$query().patchAndFetch(camelToSnake(data));

        return updated;
    }

    static async delete(id: string) {
        const issue = await this.getById(id);

        const deleted = await issue.$query().delete();

        return deleted;
    }

    static async updateStatus(id: string, status: string) {
        const issue = await this.getById(id);

        const updated = issue.$query().patchAndFetch({ status });

        return updated;
    }

    static async updateAssignee(id: string, assignTo: string) {
        const issue = await this.getById(id);

        // Check if assignTo is valid
        await UserService.getUserById(assignTo);

        const updated = issue.$query().patchAndFetch({ assignTo });

        return updated;
    }
}

export default IssueService;
