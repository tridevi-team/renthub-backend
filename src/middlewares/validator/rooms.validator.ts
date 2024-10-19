"use strict";
import { check } from "express-validator";

const createRoom = [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("maxRenters").not().isEmpty().withMessage("Max renters is required"),
    check("floor").isUUID().withMessage("Floor ID is required"),
    check("price").not().isEmpty().withMessage("Price is required"),
    check("services")
        .isArray()
        .withMessage("Services must be an array")
        .custom((value) => {
            for (const service of value) {
                // check quantity, start_index, description
                const acceptedKeys = ["serviceId", "quantity", "startIndex", "description"];
                if (typeof service !== "object") {
                    throw new Error("Service must be an object");
                }
                for (const key of Object.keys(service)) {
                    if (!acceptedKeys.includes(key)) {
                        throw new Error(`Invalid key in service: ${key}`);
                    }
                }
            }
            return true;
        }),
    check("images")
        .isArray()
        .withMessage("Images must be an array")
        .custom((value) => {
            for (const image of value) {
                if (typeof image !== "string") {
                    throw new Error("Image must be a string");
                }
            }
            return true;
        }),
    check("description").optional().isString().withMessage("Description must be a string"),
    check("status").optional().isString().withMessage("Status must be a string"),
];

const roomId = [
    check("roomId").notEmpty().withMessage("Room ID is required").isUUID().withMessage("Room ID must be a UUID"),
];

const updateRoom = [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("maxRenters").not().isEmpty().withMessage("Max renters is required"),
    check("floor").not().isEmpty().withMessage("Floor is required"),
    check("price").not().isEmpty().withMessage("Price is required"),
    check("services")
        .isArray()
        .withMessage("Services must be an array")
        .custom((value) => {
            for (const service of value) {
                // check quantity, start_index, description
                const acceptedKeys = ["serviceId", "quantity", "startIndex", "description"];
                if (typeof service !== "object") {
                    throw new Error("Service must be an object");
                }
                for (const key of Object.keys(service)) {
                    if (!acceptedKeys.includes(key)) {
                        throw new Error(`Invalid key in service: ${key}`);
                    }
                }
            }
            return true;
        }),
    check("images")
        .isArray()
        .withMessage("Images must be an array")
        .custom((value) => {
            for (const image of value) {
                if (typeof image !== "string") {
                    throw new Error("Image must be a string");
                }
            }
            return true;
        }),
    check("description").optional().isString().withMessage("Description must be a string"),
    check("status").optional().isString().withMessage("Status must be a string"),
];

const roomsValidator = {
    createRoom,
    roomId,
    updateRoom,
};

export default roomsValidator;
