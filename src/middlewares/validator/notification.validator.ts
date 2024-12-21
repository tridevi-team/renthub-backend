import { check } from "express-validator";

const create = [
    check("title").notEmpty().withMessage("Title is required").isString().withMessage("Title must be a string"),
    check("content").notEmpty().withMessage("Content is required").isString().withMessage("Content must be a string"),
    check("type").notEmpty().withMessage("Type is required").isString().withMessage("Type must be a string"),
    check("imageUrl").optional().isString().withMessage("Image URL must be a string"),
    check("data").optional().isObject().withMessage("Data must be an object"),
    check("scope")
        .notEmpty()
        .withMessage("Scope is required")
        .isString()
        .withMessage("Scope must be a string")
        .isIn(["all", "house", "room", "user"])
        .withMessage("Scope must be one of all, house, room, user"),
    check("ids").optional().isArray().withMessage("Ids must be an array"),
    check("ids.*").isUUID().withMessage("Ids must be an array of UUID"),
];

const ids = [
    check("ids").isArray().withMessage("Ids must be an array"),
    check("ids.*").isUUID().withMessage("Ids must be an array of UUID"),
];

const status = [
    check("status")
        .notEmpty()
        .withMessage("Status is required")
        .isString()
        .withMessage("Status must be a string")
        .isIn(["read", "unread", "archived"])
        .withMessage("Status must be one of read, unread"),
];

const notificationValidator = {
    create,
    ids,
    status,
};

export default notificationValidator;
