"use strict";
import { check } from "express-validator";
import { ServiceTypes } from "../../enums";

const createService = [
    check("name", "Please enter a valid service name (3-50 characters).").isString().isLength({ min: 3, max: 50 }),
    check("unitPrice", "Please enter a valid unit price.").isNumeric(),
    check("type", "Please enter a valid service type.").isIn(Object.values(ServiceTypes)),
];

const addServiceToRooms = [
    check("ids", "Please enter a valid room id list.").isArray().isLength({ min: 1 }),
    check("ids.*", "Please enter a valid room id.").isUUID(),
    check("services", "Please enter a valid service list.").isArray().isLength({ min: 1 }),
    check("services.*", "Please enter a valid service id.").isUUID(),
];

const servicesListValidator = [check("services", "Please enter a valid service list.").isArray().isLength({ min: 1 })];

const serviceIdValidator = [check("serviceId", "Please enter a valid service id.").isUUID()];

const updateService = [
    check("name", "Please enter a valid service name (3-50 characters).").isString().isLength({ min: 3, max: 50 }),
    check("unitPrice", "Please enter a valid unit price.").isNumeric(),
    check("type", "Please enter a valid service type.").isIn(Object.values(ServiceTypes)),
];

const serviceValidator = {
    createService,
    addServiceToRooms,
    servicesListValidator,
    serviceIdValidator,
    updateService,
};

export default serviceValidator;
