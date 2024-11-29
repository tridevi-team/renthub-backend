import { check } from "express-validator";
import { IssueStatus } from "../../enums";

const issueId = [check("issueId").isUUID().withMessage("Issue ID must be a valid UUID")];

const issueRequest = [
    check("floorId").optional().isUUID().withMessage("Floor ID must be a valid UUID"),
    check("roomId").optional().isUUID().withMessage("Room ID must be a valid UUID"),
    check("equipmentId").optional().isUUID().withMessage("Equipment ID must be a valid UUID"),
    check("title").isString().withMessage("Title must be a string"),
    check("content").isString().withMessage("Content must be a string"),
    check("status").optional().isString().withMessage("Status must be a string").isIn(Object.values(IssueStatus)),
    check("description").optional().isString().withMessage("Description must be a string"),
    check("files").optional().isObject().withMessage("Files must be an array"),
    check("files.image").optional().isArray().withMessage("Images must be an array"),
    check("files.video").optional().isArray().withMessage("Videos must be an array"),
    check("files.file").optional().isArray().withMessage("Files must be an array"),
    check("assignTo").optional().isUUID().withMessage("Assignee must be a valid UUID"),
];

const status = [check("status").isString().withMessage("Status must be a string").isIn(Object.values(IssueStatus))];

const assignee = [check("assignee").isUUID().withMessage("Assignee must be a valid UUID")];

const issueValidator = {
    issueId,
    issueRequest,
    status,
    assignee,
};

export default issueValidator;
