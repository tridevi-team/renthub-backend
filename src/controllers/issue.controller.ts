import { messageResponse } from "../enums";
import IssueService from "../services/issue.service";
import { apiResponse, Exception, RedisUtils } from "../utils";

const prefix = "issues";

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

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.CREATE_ISSUE_SUCCESS, true, issue));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getIssues(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;
        const cacheKey = RedisUtils.generateCacheKeyWithFilter(prefix + ":search", {
            filter,
            sort,
            pagination,
        });

        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const data = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_ISSUE_LIST_SUCCESS, true, JSON.parse(data[0])));
            }

            const issues = await IssueService.search(houseId, {
                filter,
                sort,
                pagination,
            });

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(issues));

            return res.json(apiResponse(messageResponse.GET_ISSUE_LIST_SUCCESS, true, issues));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getIssue(req, res) {
        const { issueId } = req.params;
        const cacheKey = RedisUtils.generateCacheKeyWithId(prefix, issueId, "details");

        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const data = await RedisUtils.getSetMembers(cacheKey);
                return res.json(apiResponse(messageResponse.GET_ISSUE_DETAILS_SUCCESS, true, JSON.parse(data[0])));
            }

            const issue = await IssueService.getById(issueId);

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(issue));

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

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

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

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.UPDATE_ISSUE_SUCCESS, true, issue));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateAssignee(req, res) {
        const { issueId } = req.params;
        const { assignee } = req.body;
        const { user } = req;
        try {
            const issue = await IssueService.updateAssignee(issueId, assignee, user.id);

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.UPDATE_ISSUE_SUCCESS, true, issue));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deleteIssue(req, res) {
        const { issueId } = req.params;
        try {
            await IssueService.delete(issueId);

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.DELETE_ISSUE_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default IssueController;
