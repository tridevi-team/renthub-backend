import { messageResponse } from "../enums";
import IssueService from "../services/issue.service";
import { apiResponse, Exception } from "../utils";

class IssueController {
    static async createIssue(req, res) {
        const { houseId } = req.params;
        const { floorId, roomId, equipmentId, title, content, status, description, files, assignTo } = req.body;
        const user = req.user;
        try {
            const issue = await IssueService.create({
                houseId,
                floorId,
                roomId,
                equipmentId,
                title,
                content,
                status,
                description,
                files,
                assignTo,
                createdBy: user.id,
            });
            return res.json(apiResponse(messageResponse.CREATE_ISSUE_SUCCESS, true, issue));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getIssues(req, res) {
        const { houseId } = req.params;
        const { floorId, roomId, equipmentId, title, content, status, description, assignee, page, limit } = req.query;
        try {
            const issues = await IssueService.search(
                {
                    houseId,
                    floorId,
                    roomId,
                    equipmentId,
                    title,
                    content,
                    status,
                    description,
                    assignTo: assignee,
                },
                { page: page || -1, pageSize: limit || -1 }
            );
            return res.json(apiResponse(messageResponse.GET_ISSUE_LIST_SUCCESS, true, issues));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getIssue(req, res) {
        const { issueId } = req.params;
        try {
            const issue = await IssueService.getById(issueId);
            return res.json(apiResponse(messageResponse.GET_ISSUE_DETAILS_SUCCESS, true, issue));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateIssue(req, res) {
        const { issueId } = req.params;
        const { houseId, floorId, roomId, equipmentId, title, content, status, description, files, assignTo } =
            req.body;
        try {
            const issue = await IssueService.update(issueId, {
                houseId,
                floorId,
                roomId,
                equipmentId,
                title,
                content,
                status,
                description,
                files,
                assignTo,
            });
            return res.json(apiResponse(messageResponse.UPDATE_ISSUE_SUCCESS, true, issue));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateIssueStatus(req, res) {
        const { issueId } = req.params;
        const { status } = req.body;
        try {
            const issue = await IssueService.updateStatus(issueId, status);
            return res.json(apiResponse(messageResponse.UPDATE_ISSUE_SUCCESS, true, issue));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateAssignee(req, res) {
        const { issueId } = req.params;
        const { assignee } = req.body;
        try {
            const issue = await IssueService.updateAssignee(issueId, assignee);
            return res.json(apiResponse(messageResponse.UPDATE_ISSUE_SUCCESS, true, issue));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteIssue(req, res) {
        const { issueId } = req.params;
        try {
            await IssueService.delete(issueId);
            return res.json(apiResponse(messageResponse.DELETE_ISSUE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default IssueController;
