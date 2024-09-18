"use strict";
import { check } from "express-validator";

// import { HouseStatus, HousePermissions } from "../../enums";

const createHouse = [
    check("name", "Please provide a valid name").isString().isLength({ min: 1, max: 50 }),
    check("address", "Please provide a valid address").isString().isLength({ min: 1, max: 200 }),
    check("numOfFloors", "Please provide a valid number of floors").isInt(),
    check("numOfRoomsPerFloor", "Please provide a valid number of rooms per floor").isInt(),
    check("maxRenters", "Please provide a valid number of max renters").isInt(),
    check("roomArea", "Please provide a valid room area").isInt(),
    check("roomPrice", "Please provide a valid room price").isInt(),
    check("description", "Please provide a valid description").isString().isLength({ min: 1, max: 200 }),
    check("collectionCycle", "Please provide a valid collection cycle").optional().isInt(),
    check("invoiceDate", "Please provide a valid invoice date").optional().isInt(),
    check("numCollectDays", "Please provide a valid number of collection days").optional().isInt(),
];

const updateHouseDetails = [
    check("id", "Please provide a valid house id").isInt(),
    check("name", "Please provide a valid name").isString().isLength({ min: 1, max: 50 }),
    check("address", "Please provide a valid address").isString().isLength({ min: 1, max: 200 }),
    check("numberOfFloors", "Please provide a valid number of floors").isInt(),
    // check("status", "Please provide a valid status").isIn([HouseStatus.AVAILABLE, HouseStatus.RENTED, HouseStatus.PENDING, HouseStatus.DEPOSIT]),
];

const deleteHouse = [check("id", "Please provide a valid house id").isInt()];

// const housePermissionsArray = Object.values(HousePermissions);

// const updateHouseStatus = [check("id", "Please provide a valid house id").isInt(), check("status", "Please provide a valid status").isIn(housePermissionsArray)];

const userPermissions = [check("id", "Please provide a valid house id").isInt()];

const grantPermissions = [
    check("id", "Please provide a valid house id").isInt(),
    check("userId", "Please provide a valid user id").isInt(),
    check("permissions", "Permissions must be an array").isArray({ min: 1, max: 20 }),
    // check("permissions.*", "The value in permissions must be in the defined list").isString().isIn(housePermissionsArray),
];

const houseDetails = [check("id", "Please provide a valid house id").isInt()];

const houseValidator = {
    createHouse,
    updateHouseDetails,
    deleteHouse,
    // updateHouseStatus,
    userPermissions,
    grantPermissions,
    houseDetails,
};

export default houseValidator;
