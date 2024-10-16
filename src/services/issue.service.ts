import { messageResponse } from "../enums";
import { IssueFilter, IssueRequest, Pagination } from "../interfaces";
import { Issues } from "../models";
import { ApiException, camelToSnake } from "../utils";
import { UserService } from "./";

class IssueService {
    static async getById(id: string) {
        const details = await Issues.query().findById(id);

        if (!details) throw new ApiException(messageResponse.ISSUE_NOT_FOUND, 404);

        return details;
    }

    static async search(filter: IssueFilter, pagination: Pagination) {
        const issues = Issues.query().andWhere((builder) => {
            if (filter.houseId) builder.where("house_id", filter.houseId);
            if (filter.floorId) builder.where("floor_id", filter.floorId);
            if (filter.roomId) builder.where("room_id", filter.roomId);
            if (filter.equipmentId) builder.where("equipment_id", filter.equipmentId);
            if (filter.title) builder.where("title", "like", `%${filter.title}%`);
            if (filter.content) builder.where("content", "like", `%${filter.content}%`);
            if (filter.status) builder.where("status", filter.status);
            if (filter.description) builder.where("description", "like", `%${filter.description}%`);
            if (filter.assignTo) builder.where("assignTo", filter.assignTo);
        });

        if (pagination.page !== -1) {
            const result = await issues.page(pagination.page, pagination.pageSize);
            if (!result.results.length) throw new ApiException(messageResponse.NO_ISSUES_FOUND, 404);
            return result;
        }

        const query = await issues;

        if (!query) throw new ApiException(messageResponse.NO_ISSUES_FOUND, 404);

        return query;
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
