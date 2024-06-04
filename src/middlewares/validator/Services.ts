"use strict";
import { check } from "express-validator";
import serviceTypes from "../../enum/Services";

const createService = [
    check("name", "Please enter a valid service name (3-50 characters).").isString().isLength({ min: 3, max: 50 }),
    check("unitPrice", "Please enter a valid unit price.").isNumeric(),
    check("type", "Please enter a valid service type.").isIn(Object.values(serviceTypes)),
];

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

const serviceValidator = {
    createService,
    getServiceByHouse,
    getServiceDetails,
    updateService,
    deleteService,
};

export default serviceValidator;