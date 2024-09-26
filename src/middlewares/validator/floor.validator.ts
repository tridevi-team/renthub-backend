import { check } from "express-validator";

const createFloor = [
    check("name").isString().withMessage("Name must be a string"),
    check("houseId").isString().withMessage("House Id must be a string"),
    check("description").optional().isString().withMessage("Description must be a string"),
];

const updateFloor = [check("name").optional().isString().withMessage("Name must be a string"), check("description").optional().isString().withMessage("Description must be a string")];

const floorIdValidator = [check("floorId").isUUID().withMessage("Floor Id must be a UUID")];

export default {
    createFloor,
    updateFloor,
    floorIdValidator,
};
