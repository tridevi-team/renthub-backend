"use strict";
import { check } from "express-validator";
import { EquipmentStatus, EquipmentType } from "../../enums";

const parentId = [
    check("houseId").optional().isUUID().withMessage("House ID must be a valid UUID"),
    check("floorId").optional().isUUID().withMessage("Floor ID must be a valid UUID"),
    check("roomId").optional().isUUID().withMessage("Room ID must be a valid UUID"),
];

const equipmentRequest = [
    check("code").isString().withMessage("Code must be a string"),
    check("name").isString().withMessage("Name must be a string"),
    check("status").isString().withMessage("Status must be a string").isIn(Object.values(EquipmentStatus)),
    check("sharedType").isString().withMessage("Shared type must be a string").isIn(Object.values(EquipmentType)),
    check("description").optional().isString().withMessage("Description must be a string"),
];

const equipmentStatus = [
    check("status").isString().withMessage("Status must be a string").isIn(Object.values(EquipmentStatus)),
    check("sharedType")
        .optional()
        .isString()
        .withMessage("Shared type must be a string")
        .isIn(Object.values(EquipmentType)),
];

const searchEquipment = [
    check("code").optional().isString().withMessage("Code must be a string"),
    check("name").optional().isString().withMessage("Name must be a string"),
    check("status").optional().isString().withMessage("Status must be a string").isIn(Object.values(EquipmentStatus)),
    check("sharedType")
        .optional()
        .isString()
        .withMessage("Shared type must be a string")
        .isIn(Object.values(EquipmentType)),
    check("page").optional().isInt().withMessage("Page must be an integer"),
    check("limit").optional().isInt().withMessage("Limit must be an integer"),
];

const equipmentId = check("equipmentId").isUUID().withMessage("Equipment ID must be a valid UUID");

const equipmentValidator = {
    equipmentRequest,
    parentId,
    equipmentId,
    searchEquipment,
    equipmentStatus,
};

export default equipmentValidator;
