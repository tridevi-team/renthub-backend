"use strict";
import { check } from "express-validator";
import serviceTypes from "../../enums/services.enum";

const createService = [
    check("name", "Please enter a valid service name (3-50 characters).").isString().isLength({ min: 3, max: 50 }),
    check("unitPrice", "Please enter a valid unit price.").isNumeric(),
    check("type", "Please enter a valid service type.").isIn(Object.values(serviceTypes)),
];

const createRoomService = [check("services", "Please enter a valid service list.").isArray().isLength({ min: 1 })];

const getServiceByHouse = [check("houseId", "Please enter a valid house id.").isNumeric()];

const getServiceDetails = [check("houseId", "Please enter a valid house id"), check("serviceId", "Please enter a valid service id.").isNumeric()];

const updateService = [
    check("houseId", "Please enter a valid house id.").isNumeric(),
    check("serviceId", "Please enter a valid service id.").isNumeric(),
    check("name", "Please enter a valid service name (3-50 characters).").isString().isLength({ min: 3, max: 50 }),
    check("unitPrice", "Please enter a valid unit price.").isNumeric(),
    check("type", "Please enter a valid service type.").isIn(Object.values(serviceTypes)),
];

const deleteService = [check("houseId", "Please enter a valid house id.").isNumeric(), check("serviceId", "Please enter a valid service id.").isNumeric()];

const deleteRoomService = [
    check("houseId", "Please enter a valid house id.").isNumeric(),
    check("roomId", "Please enter a valid room id.").isNumeric(),
    check("services", "Please enter a valid service list.").isArray().isLength({ min: 1 }),
];

const serviceValidator = {
    createService,
    createRoomService,
    getServiceByHouse,
    getServiceDetails,
    updateService,
    deleteService,
    deleteRoomService,
};

export default serviceValidator;
