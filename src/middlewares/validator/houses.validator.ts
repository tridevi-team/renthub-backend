"use strict";
import { check } from "express-validator";

const createHouse = [
    check("name", "Please provide a valid name").isString().isLength({ min: 1, max: 50 }),
    check("address", "Please provide a valid address")
        .isObject()
        .custom((value) => {
            const keys = ["city", "district", "street", "ward"];
            for (const key of keys) {
                if (!Object.prototype.hasOwnProperty.call(value, key)) {
                    throw new Error(`address must have a ${key} property`);
                }
            }
            return true;
        }),
    check("numOfFloors", "Please provide a valid number of floors").isInt(),
    check("numOfRoomsPerFloor", "Please provide a valid number of rooms per floor").isInt(),
    check("maxRenters", "Please provide a valid number of max renters").isInt(),
    check("roomArea", "Please provide a valid room area").isInt(),
    check("roomPrice", "Please provide a valid room price").isInt(),
    check("description", "Please provide a valid description").optional().isString(),
    check("collectionCycle", "Please provide a valid collection cycle").optional().isInt(),
    check("invoiceDate", "Please provide a valid invoice date").optional().isInt(),
    check("numCollectDays", "Please provide a valid number of collection days").optional().isInt(),
];
//
const updateHouseDetails = [
    check("name", "Please provide a valid name").isString().isLength({ min: 1, max: 50 }),
    check("address", "Please provide a valid address")
        .isObject()
        .custom((value) => {
            const keys = ["city", "district", "street", "ward"];
            for (const key of keys) {
                if (!Object.prototype.hasOwnProperty.call(value, key)) {
                    throw new Error(`address must have a ${key} property`);
                }
            }
            return true;
        }),
    check("description", "Please provide a valid description").optional().isString(),
    check("collectionCycle", "Please provide a valid collection cycle").optional().isInt(),
    check("invoiceDate", "Please provide a valid invoice date").optional().isInt(),
    check("numCollectDays", "Please provide a valid number of collection days").optional().isInt(),
];

const updateHouseStatus = [check("status", "Please provide a valid status").isBoolean()];

const houseIdValidator = [check("houseId").isUUID().withMessage("houseId is not in the correct format")];

const houseValidator = {
    createHouse,
    updateHouseDetails,
    updateHouseStatus,
    houseIdValidator,
};

export default houseValidator;
