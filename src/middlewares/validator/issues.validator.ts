import { check } from "express-validator";
import { IssueStatus } from "../../enums";

const issueId = [check("issueId").isUUID().withMessage("Issue ID must be a valid UUID")];

const issueRequest = [
    check("floorId").optional().isUUID().withMessage("Floor ID must be a valid UUID"),
    check("roomId").optional().isUUID().withMessage("Room ID must be a valid UUID"),
    check("equipmentId").optional().isUUID().withMessage("Equipment ID must be a valid UUID"),
    check("title").isString().withMessage("Title must be a string"),
    check("content").isString().withMessage("Content must be a string"),
    check("status").isString().withMessage("Status must be a string"),
    check("description").isString().withMessage("Description must be a string"),
    check("files").optional().isArray().withMessage("Files must be an array"),
    check("assignTo").optional().isUUID().withMessage("Assignee must be a valid UUID"),
];

const status = [check("status").isString().withMessage("Status must be a string").isIn(Object.values(IssueStatus))];

const assignee = [check("assignee").isUUID().withMessage("Assignee must be a valid UUID")];

const getIssues = [
    check("houseId").optional().isUUID().withMessage("House ID must be a valid UUID"),
    check("roomId").optional().isUUID().withMessage("Room ID must be a valid UUID"),
    check("floorId").optional().isUUID().withMessage("Floor ID must be a valid UUID"),
    check("equipmentId").optional().isUUID().withMessage("Equipment ID must be a valid UUID"),
    check("status").optional().isString().withMessage("Status must be a string"),
    check("assignee").optional().isUUID().withMessage("Assignee must be a valid UUID"),
    check("description").optional().isString().withMessage("Description must be a string"),
    check("title").optional().isString().withMessage("Title must be a string"),
    check("content").optional().isString().withMessage("Content must be a string"),
    check("page").optional().isNumeric().withMessage("Page must be a number"),
    check("limit").optional().isNumeric().withMessage("Limit must be a number"),
];

const issueValidator = {
    issueId,
    issueRequest,
    status,
    assignee,
    getIssues,
};

export default issueValidator;
