"use strict";
const { check } = require("express-validator");

const createRooms = [
    check("houseId").not().isEmpty().withMessage("House ID is required"),
    check("name").not().isEmpty().withMessage("Name is required"),
    check("maxRenters").not().isEmpty().withMessage("Max renters is required"),
    check("floor").not().isEmpty().withMessage("Floor is required"),
    check("price").not().isEmpty().withMessage("Price is required"),
];

const getRoomList = [check("houseId").not().isEmpty().withMessage("House ID is required")];

const getRoomDetails = [check("houseId").not().isEmpty().withMessage("House ID is required"), check("roomId").not().isEmpty().withMessage("Room ID is required")];

const updateRoom = [
    check("houseId").not().isEmpty().withMessage("House ID is required"),
    check("roomId").not().isEmpty().withMessage("Room ID is required"),
    check("name").not().isEmpty().withMessage("Name is required"),
    check("maxRenters").not().isEmpty().withMessage("Max renters is required"),
    check("floor").not().isEmpty().withMessage("Floor is required"),
    check("price").not().isEmpty().withMessage("Price is required"),
];

const deleteRoom = [check("houseId").not().isEmpty().withMessage("House ID is required"), check("roomId").not().isEmpty().withMessage("Room ID is required")];

const roomDetails = [check("houseId").not().isEmpty().withMessage("House ID is required"), check("roomId").not().isEmpty().withMessage("Room ID is required")];

module.exports = {
    createRooms,
    getRoomList,
    getRoomDetails,
    updateRoom,
    deleteRoom,
    roomDetails,
};
