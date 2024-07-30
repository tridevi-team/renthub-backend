import { check } from "express-validator";

const createPaymentMethod = [
    check("houseId").isNumeric().withMessage("House ID must be a number"),
    check("fullName").isString().withMessage("Full name must be a string"),
    check("accountNumber").isString().withMessage("Account number must be a string"),
    // check("status").isEmpty().isBoolean().withMessage("Status must be a boolean"),
    // check("description").isEmpty().isString().withMessage("Description must be a string"),
    // check("apiKey").isString().withMessage("API key must be a string"),
    // check("clientId").isString().withMessage("Client ID must be a string"),
    // check("checksum").isEmpty().isString().withMessage("Checksum must be a string"),
];

const updatePaymentMethod = [
    check("houseId").isNumeric().withMessage("House ID must be a number"),
    check("fullName").isString().withMessage("Full name must be a string"),
    check("accountNumber").isString().withMessage("Account number must be a string"),
    // check("status").isString().withMessage("Status must be a string"),
    // check("description").isString().withMessage("Description must be a string"),
    // check("apiKey").isString().withMessage("API key must be a string"),
    // check("clientId").isString().withMessage("Client ID must be a string"),
    // check("checksum").isString().withMessage("Checksum must be a string"),
];

const paymentMethodValidator = {
    createPaymentMethod,
    updatePaymentMethod,
};

export default paymentMethodValidator;
