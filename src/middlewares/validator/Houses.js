const { check } = require("express-validator");

const { houseStatus, housePermissions } = require("../../enum/Houses");

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
    check("status", "Please provide a valid status").isIn([houseStatus.AVAILABLE, houseStatus.RENTED, houseStatus.PENDING, houseStatus.DEPOSIT]),
];

const deleteHouse = [check("id", "Please provide a valid house id").isInt()];

const updateHouseStatus = [
    check("id", "Please provide a valid house id").isInt(),
    check("status", "Please provide a valid status").isIn([houseStatus.AVAILABLE, houseStatus.RENTED, houseStatus.PENDING, houseStatus.DEPOSIT]),
];

const userPermissions = [check("id", "Please provide a valid house id").isInt()];

const grantPermissions = [
    check("id", "Please provide a valid house id").isInt(),
    check("userId", "Please provide a valid user id").isInt(),
    check("permissions", "Permissions must be an array").isArray({ min: 1, max: 20 }),
    check("permissions.*", "The value in permissions must be in the defined list").isString().isIn(housePermissions),
];

module.exports = {
    createHouse,
    updateHouseDetails,
    deleteHouse,
    updateHouseStatus,
    userPermissions,
    grantPermissions,
};
