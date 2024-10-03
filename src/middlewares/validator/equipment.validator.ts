"use strict";
import { check } from "express-validator";

const addEquipment = [
    check("name").notEmpty().withMessage("Name is required"),
    check("quantity").isNumeric().notEmpty().withMessage("Quantity is required"),
    check("expDate").notEmpty().withMessage("Expire date is required"),
    check("sharedType").notEmpty().withMessage("Shared type is required"),
    check("houseId").notEmpty().withMessage("House ID is required"),
];

const addEquipmentToRoom = [check("equipment").isArray().withMessage("Equipment is required")];

const updateEquipment = [
    check("name").notEmpty().withMessage("Name is required"),
    check("quantity").isNumeric().notEmpty().withMessage("Quantity is required"),
    check("expDate").notEmpty().withMessage("Expire date is required"),
    check("sharedType").notEmpty().withMessage("Shared type is required"),
    check("equipmentId").notEmpty().withMessage("Equipment ID is required"),
];

const equipmentValidator = {
    addEquipment,
    addEquipmentToRoom,
    updateEquipment,
};

export default equipmentValidator;
