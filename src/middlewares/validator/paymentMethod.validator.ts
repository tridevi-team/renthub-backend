import { check } from "express-validator";

const paymentRequest = [
    check("name").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string"),
    check("accountNumber")
        .notEmpty()
        .withMessage("Account number is required")
        .isString()
        .withMessage("Account number must be a string"),
    check("bankName").optional().isString().withMessage("Bank name must be a string"),
    check("status").optional().isBoolean().withMessage("Status must be a boolean"),
    check("isDefault").optional().isBoolean().withMessage("Is default must be a boolean"),
    // check("description").optional().isString().withMessage("Description must be a string"),
    check("payosClientId").optional().isString().withMessage("Payos client id must be a string"),
    check("payosApiKey").optional().isString().withMessage("Payos api key must be a string"),
    check("payosChecksum").optional().isString().withMessage("Payos checksum must be a string"),
];

const paymentId = [
    check("paymentId")
        .notEmpty()
        .withMessage("Payment method id is required")
        .isUUID()
        .withMessage("Payment method id must be a UUID"),
];

const updateStatus = [
    check("status").notEmpty().withMessage("Status is required").isBoolean().withMessage("Status must be a boolean"),
];

const updateDefault = [
    check("isDefault")
        .notEmpty()
        .withMessage("Is default is required")
        .isBoolean()
        .withMessage("Is default must be a boolean"),
];

const paymentMethodValidator = {
    paymentRequest,
    paymentId,
    updateStatus,
    updateDefault,
};

export default paymentMethodValidator;
