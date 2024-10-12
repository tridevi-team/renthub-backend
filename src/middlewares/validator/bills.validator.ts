import { check } from "express-validator";
import { ServiceTypes } from "../../enums";

const billId = check("billId").isUUID().withMessage("Bill ID is invalid");

const createBill = [
    check("data.*.roomId").isUUID().withMessage("Room ID is invalid"),
    check("data.*.paymentMethodId").optional().isUUID().withMessage("Payment method ID is invalid"),
    check("data.*.title").optional().isString().withMessage("Title is invalid"),
    check("data.*.paymentDate").optional().isISO8601().withMessage("Payment date is invalid"),
    check("data.*.startDate").isISO8601().withMessage("Start date is invalid"),
    check("data.*.endDate").isISO8601().withMessage("End date is invalid"),
    check("data.*.services.*.serviceId").isUUID().withMessage("Service ID is invalid"),
    check("data.*.services.*.oldValue").optional().isNumeric().withMessage("Old value is invalid"),
    check("data.*.services.*.newValue").optional().isNumeric().withMessage("New value is invalid"),
];

const updateBill = [
    check("data")
        .isArray()
        .withMessage("Data must be an array")
        .custom((value) => {
            if (value.length === 0) {
                throw new Error("Data must not be empty");
            }
            return true;
        }),
    check("data.*.id").isUUID().withMessage("Bill ID is invalid"),
    check("data.*.roomId").isUUID().withMessage("Room ID is invalid"),
    check("data.*.paymentMethodId").optional().isUUID().withMessage("Payment method ID is invalid"),
    check("data.*.title").optional().isString().withMessage("Title is invalid"),
    check("data.*.paymentDate").optional().isISO8601().withMessage("Payment date is invalid"),
    check("data.*.startDate").isISO8601().withMessage("Start date is invalid"),
    check("data.*.endDate").isISO8601().withMessage("End date is invalid"),
    check("data.*.services").isArray().withMessage("Services must be an array"),
    check("data.*.services.*.serviceId").optional().isUUID().withMessage("Service ID is invalid"),
    check("data.*.services.*.name").optional().isString().withMessage("Name is invalid"),
    check("data.*.services.*.oldValue").optional().isNumeric().withMessage("Old value is invalid"),
    check("data.*.services.*.newValue").optional().isNumeric().withMessage("New value is invalid"),
    check("data.*.services.*.unitPrice").optional().isNumeric().withMessage("Unit price is invalid"),
    check("data.*.services.*.type")
        .optional()
        .isString()
        .withMessage("Type is invalid")
        .isIn(Object.values(ServiceTypes)),
];

const billUpdateStatus = [
    check("data.*.id").isUUID().withMessage("Bill ID is invalid"),
    check("data.*.status").isString().withMessage("Status is invalid"),
];

const idsList = [
    check("ids").isArray().withMessage("IDs must be an array"),
    check("ids.*").isUUID().withMessage("ID is invalid"),
];

const billValidator = {
    billId,
    createBill,
    idsList,
    updateBill,
    billUpdateStatus,
};

export default billValidator;
