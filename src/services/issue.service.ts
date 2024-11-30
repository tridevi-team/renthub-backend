import { TransactionOrKnex } from "objection";
import { EPagination, EquipmentStatus, IssueStatus, messageResponse, NotificationType } from "../enums";
import { Filter, IssueRequestCreate, IssueRequestUpdate } from "../interfaces";
import { Houses, Issues } from "../models";
import { ApiException, camelToSnake, filterHandler, sortingHandler } from "../utils";
import { EquipmentService, HouseService, NotificationService, UserService } from "./";

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

    static async getHouseId(issueId: string) {
        const issue = await Issues.query().findById(issueId).select("house_id");

        if (!issue) {
            throw new ApiException(messageResponse.ISSUE_NOT_FOUND, 404);
        }

        return issue.houseId;
    }

    static async getRoomId(issueId: string) {
        const issue = await Issues.query()
            .findById(issueId)
            .leftJoin("rooms", "rooms.id", "issues.room_id")
            .select("rooms.id");

        if (!issue) {
            throw new ApiException(messageResponse.ISSUE_NOT_FOUND, 404);
        }

        return issue.roomId;
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

    static async create(data: IssueRequestCreate) {
        const issue = await Issues.query().insert(camelToSnake(data));
        const house = await HouseService.getHouseById(data.houseId);
        // send notification to owner and issue manager
        await NotificationService.create({
            title: "Yêu cầu mới",
            content: `Yêu cầu mới ${issue.title} được tạo`,
            type: NotificationType.SYSTEM,
            data: { issueId: issue.id },
            recipients: [data.createdBy, house.createdBy],
        });

        return issue;
    }

    static async update(id: string, data: IssueRequestUpdate) {
        const issue = await this.getById(id);

        const updated = issue.$query().patchAndFetch(camelToSnake(data));

        if (data.status && issue.equipmentId) {
            const status = data.status;

            if (status === IssueStatus.IN_PROGRESS) {
                // update equipment status is REPAIRING
                await EquipmentService.updateStatus(issue.createdBy, issue.equipmentId, {
                    status: EquipmentStatus.REPAIRING,
                });
            } else if (status === IssueStatus.DONE) {
                // update equipment status is NORMAL
                await EquipmentService.updateStatus(issue.createdBy, issue.equipmentId, {
                    status: EquipmentStatus.NORMAL,
                });
            }
        }

        return updated;
    }

    static async delete(id: string) {
        const issue = await this.getById(id);

        const deleted = await issue.$query().delete();

        return deleted;
    }

    static async deleteByIds(ids: string[], houseId: string, actionBy: string, trx?: TransactionOrKnex) {
        // check houseId is valid
        for (const id of ids) {
            const issue = await this.getById(id);
            if (issue.houseId !== houseId) {
                throw new ApiException(messageResponse.ISSUE_NOT_FOUND, 404);
            }

            await issue.$query(trx).patch({ updated_by: actionBy });

            await issue.$query(trx).delete();
        }
    }

    static async updateStatus(id: string, status: string) {
        const issue = await this.getById(id);
        if (issue.equipmentId) {
            const equipment = await EquipmentService.getById(issue.equipmentId);
            if (!equipment) {
                throw new ApiException(messageResponse.EQUIPMENT_NOT_FOUND, 404);
            }
            if (status === IssueStatus.IN_PROGRESS) {
                // if issue status is IN_PROGRESS => update equipment status is REPAIRING
                await EquipmentService.updateStatus(equipment.createdBy, equipment.id, {
                    status: EquipmentStatus.REPAIRING,
                });
            } else if (status === IssueStatus.DONE) {
                // if issue status is DONE => update equipment status is
                await EquipmentService.updateStatus(equipment.createdBy, equipment.id, {
                    status: EquipmentStatus.NORMAL,
                });
            }
        }
        const updated = issue.$query().patchAndFetch({ status });

        return updated;
    }

    static async updateAssignee(id: string, assignTo: string, updatedBy: string) {
        const issue = await this.getById(id);

        // Check if assignTo is valid
        await UserService.getUserById(assignTo);

        const updated = issue.$query().patchAndFetch({ assignTo, updatedBy });

        // send notification to assignee
        await NotificationService.create({
            title: "Yêu cầu được giao cho bạn",
            content: `Bạn đã được giao yêu cầu ${issue.title}. Vui lòng kiểm tra và xử lý`,
            type: NotificationType.SYSTEM,
            data: { issueId: id },
            recipients: [assignTo],
            createdBy: updatedBy,
        });

        return updated;
    }
}

export default IssueService;
