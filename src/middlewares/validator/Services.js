"use strict";
const { check } = require("express-validator");
const serviceTypes = require("../../enum/Services");

const createService = [
    check("name", "Please enter a valid service name (3-50 characters).").isString().isLength({ min: 3, max: 50 }),
    check("unitPrice", "Please enter a valid unit price.").isNumeric(),
    check("type", "Please enter a valid service type.").isIn(serviceTypes),
];

const getServiceByHouse = [check("houseId", "Please enter a valid house id.").isNumeric()];

const getServiceDetails = [check("serviceId", "Please enter a valid service id.").isNumeric()];

const updateService = [
    check("serviceId", "Please enter a valid service id.").isNumeric(),
    check("name", "Please enter a valid service name (3-50 characters).").isString().isLength({ min: 3, max: 50 }),
    check("unitPrice", "Please enter a valid unit price.").isNumeric(),
    check("type", "Please enter a valid service type.").isIn(serviceTypes),
];

const deleteService = [check("serviceId", "Please enter a valid service id.").isNumeric()];

module.exports = {
    createService,
    getServiceByHouse,
    getServiceDetails,
    updateService,
    deleteService,
};
