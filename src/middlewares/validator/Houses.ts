"use strict";
import { check } from "express-validator";

import { HouseStatus, HousePermissions } from "../../enum";

const createHouse = [
    check("name", "Please provide a valid name").isString().isLength({ min: 1, max: 50 }),
    check("address", "Please provide a valid address").isString().isLength({ min: 1, max: 200 }),
    check("numberOfFloors", "Please provide a valid number of floors").isInt(),
];

const updateHouseDetails = [
    check("id", "Please provide a valid house id").isInt(),
    check("name", "Please provide a valid name").isString().isLength({ min: 1, max: 50 }),
    check("address", "Please provide a valid address").isString().isLength({ min: 1, max: 200 }),
    check("numberOfFloors", "Please provide a valid number of floors").isInt(),
    check("status", "Please provide a valid status").isIn([HouseStatus.AVAILABLE, HouseStatus.RENTED, HouseStatus.PENDING, HouseStatus.DEPOSIT]),
];

const deleteHouse = [check("id", "Please provide a valid house id").isInt()];

const housePermissionsArray = Object.values(HousePermissions);

const updateHouseStatus = [check("id", "Please provide a valid house id").isInt(), check("status", "Please provide a valid status").isIn(housePermissionsArray)];

const userPermissions = [check("id", "Please provide a valid house id").isInt()];

const grantPermissions = [
    check("id", "Please provide a valid house id").isInt(),
    check("userId", "Please provide a valid user id").isInt(),
    check("permissions", "Permissions must be an array").isArray({ min: 1, max: 20 }),
    check("permissions.*", "The value in permissions must be in the defined list").isString().isIn(housePermissionsArray),
];

const houseDetails = [check("id", "Please provide a valid house id").isInt()];

const houseValidator = {
    createHouse,
    updateHouseDetails,
    deleteHouse,
    updateHouseStatus,
    userPermissions,
    grantPermissions,
    houseDetails,
};

export default houseValidator;
