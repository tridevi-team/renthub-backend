import { ApprovalStatus, ContractStatus, DepositStatus, EquipmentStatus } from "@enums";
import { check } from "express-validator";

const informationCheck = (info: string) => {
    return check(info)
        .isObject()
        .withMessage(`${info} is required`)
        .custom((data) => {
            const validKeys = [
                "fullName",
                "citizenId",
                "address",
                "phoneNumber",
                "email",
                "birthday",
                "dateOfIssue",
                "placeOfIssue",
                "gender",
            ];

            const dataKeys = Object.keys(data);

            const addressKeys = Object.keys(data.address);

            const validAddressKeys = ["city", "district", "ward", "street"];

            validAddressKeys.forEach((key) => {
                if (!addressKeys.includes(key)) {
                    throw new Error(`Missing key: ${key} in address object`);
                }
            });

            validKeys.forEach((key) => {
                if (!dataKeys.includes(key) && key !== "email") {
                    throw new Error(`Missing key: ${key} in ${info} object`);
                }
            });

            return true;
        });
};

const createContractTemplate = [
    check("name").isString().withMessage("Name is required"),
    check("content").isString().withMessage("Content is required"),
    informationCheck("landlord"),
    check("isActive").isBoolean().withMessage("Is Active is required"),
];

const updateContractTemplate = [
    check("name").optional().isString().withMessage("Name must be a string"),
    check("content").optional().isString().withMessage("Content must be a string"),
    informationCheck("landlord"),
    check("isActive").optional().isBoolean().withMessage("Is Active must be a boolean"),
];

const createRoomContract = [
    check("contractId").isString().withMessage("Contract ID is required"),
    informationCheck("landlord"),
    informationCheck("renter"),
    check("depositAmount").isNumeric().withMessage("Deposit Amount is required"),
    check("depositStatus")
        .isString()
        .withMessage("Deposit Status is required")
        .isIn(Object.values(DepositStatus))
        .withMessage("Deposit Status is invalid"),
    check("depositDate").optional().isDate().withMessage("Deposit Date is required"),
    check("depositRefund").optional().isNumeric().withMessage("Deposit Refund is required"),
    check("depositRefundDate").optional().isDate().withMessage("Deposit Refund Date is required"),
    check("rentalStartDate").isDate().withMessage("Rental Start Date is required"),
    check("rentalEndDate")
        .isDate()
        .withMessage("Rental End Date is required")
        .custom((endDate, { req }) => {
            if (endDate < req.body.rentalStartDate) {
                throw new Error("Rental End Date must be greater than Rental Start Date");
            }

            return true;
        }),
    check("room")
        .notEmpty({
            ignore_whitespace: true,
        })
        .withMessage("Room is required")
        .isObject()
        .withMessage("Room must be an object")
        .custom((room) => {
            const validKeys = ["id", "name", "area", "price", "maxRenters"];

            const roomKeys = Object.keys(room);

            validKeys.forEach((key) => {
                if (!roomKeys.includes(key)) {
                    throw new Error(`Missing key: ${key} in room object`);
                }
            });

            return true;
        }),
    check("services")
        .notEmpty({
            ignore_whitespace: true,
        })
        .withMessage("Services is required")
        .isArray()
        .withMessage("Services must be an array")
        .custom((services) => {
            const validKeys = ["id", "name", "quantity", "startIndex", "type", "unitPrice"];

            services.forEach((service) => {
                const serviceKeys = Object.keys(service);

                validKeys.forEach((key) => {
                    if (!serviceKeys.includes(key) && key !== "startIndex") {
                        throw new Error(`Missing key: ${key} in service object`);
                    }
                });
            });

            return true;
        }),
    check("equipment")
        .notEmpty({
            ignore_whitespace: true,
        })
        .withMessage("Equipment is required")
        .isArray()
        .withMessage("Equipment must be an array")
        .custom((equipment) => {
            const validKeys = ["id", "houseId", "floorId", "roomId", "code", "name", "status", "sharedType"];

            equipment.forEach((equip) => {
                const equipKeys = Object.keys(equip);

                validKeys.forEach((key) => {
                    if (!equipKeys.includes(key)) {
                        throw new Error(`Missing key: ${key} in equipment object`);
                    }
                });
            });

            return true;
        }),
    check("equipment.*.status")
        .isString()
        .withMessage("Equipment Status is required in equipment object")
        .isIn(Object.values(EquipmentStatus)),
    check("status").optional().isString().withMessage("Status is required"),
];

const updateRoomContract = [
    informationCheck("landlord"),
    informationCheck("renter"),
    check("depositAmount").optional().isNumeric().withMessage("Deposit Amount is required"),
    check("depositStatus")
        .optional()
        .isString()
        .withMessage("Deposit Status is required")
        .isIn(Object.values(DepositStatus))
        .withMessage("Deposit Status is invalid"),
    check("depositDate").optional().isDate().withMessage("Deposit Date is required"),
    check("depositRefund").optional().isNumeric().withMessage("Deposit Refund is required"),
    check("depositRefundDate").optional().isDate().withMessage("Deposit Refund Date is required"),
    check("rentalStartDate").optional().isDate().withMessage("Rental Start Date is required"),
    check("rentalEndDate")
        .optional()
        .isDate()
        .withMessage("Rental End Date is required")
        .custom((endDate, { req }) => {
            if (endDate < req.body.rentalStartDate) {
                throw new Error("Rental End Date must be greater than Rental Start Date");
            }

            return true;
        }),
    check("room")
        .optional()
        .isObject()
        .withMessage("Room must be an object")
        .custom((room) => {
            const validKeys = ["id", "name", "area", "price", "maxRenters"];

            const roomKeys = Object.keys(room);

            validKeys.forEach((key) => {
                if (!roomKeys.includes(key)) {
                    throw new Error(`Missing key: ${key} in room object`);
                }
            });

            return true;
        }),
    check("services")
        .optional()
        .isArray()
        .withMessage("Services must be an array")
        .custom((services) => {
            const validKeys = ["id", "name", "quantity", "startIndex", "type", "unitPrice"];

            services.forEach((service) => {
                const serviceKeys = Object.keys(service);

                validKeys.forEach((key) => {
                    if (!serviceKeys.includes(key) && key !== "startIndex") {
                        throw new Error(`Missing key: ${key} in service object`);
                    }
                });
            });

            return true;
        }),
    check("equipment")
        .optional()
        .isArray()
        .withMessage("Equipment must be an array")
        .custom((equipment) => {
            const validKeys = ["id", "houseId", "floorId", "roomId", "code", "name", "status", "sharedType"];

            equipment.forEach((equip) => {
                const equipKeys = Object.keys(equip);

                validKeys.forEach((key) => {
                    if (!equipKeys.includes(key)) {
                        throw new Error(`Missing key: ${key} in equipment object`);
                    }
                });
            });

            return true;
        }),
    check("status").optional().isString().withMessage("Status is required"),
];

const updateContractStatus = [
    check("status")
        .optional()
        .isString()
        .withMessage("Status must be a string")
        .isIn([...Object.values(ApprovalStatus), ...Object.values(ContractStatus)])
        .withMessage("Status is invalid"),
    check("depositStatus")
        .optional()
        .isString()
        .withMessage("Deposit Status must be a string")
        .isIn(Object.values(DepositStatus)),
    check("note").optional().isString().withMessage("Note must be a string"),
];

const extendContract = [
    check("landlord").optional().isObject().withMessage("Landlord is required"),
    check("renter").optional().isObject().withMessage("Renter is required"),
    check("rentalStartDate").isDate().withMessage("Rental Start Date is required"),
    check("rentalEndDate").isDate().withMessage("Rental End Date is required"),
    check("room").optional().isObject().withMessage("Room is required"),
    check("services").optional().isArray().withMessage("Services must be an array"),
    check("equipment").optional().isArray().withMessage("Equipment must be an array"),
];

const contractId = [check("contractId").isString().withMessage("Contract ID is required")];

const templateId = [check("templateId").isString().withMessage("Template ID is required")];

const contractValidator = {
    createContractTemplate,
    updateContractTemplate,
    createRoomContract,
    updateRoomContract,
    updateContractStatus,
    extendContract,
    contractId,
    templateId,
};

export default contractValidator;
