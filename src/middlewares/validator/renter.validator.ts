import { check } from "express-validator";

const login = [
    check("email").optional().isEmail().withMessage("Email must be a valid email"),
    check("phoneNumber").optional().isString().withMessage("Phone number must be a string"),
];

const verify = [
    check("email").optional().isEmail().withMessage("Email must be a valid email"),
    check("phoneNumber").optional().isString().withMessage("Phone number must be a string"),
    check("code").isString().withMessage("Code must be a string"),
];

const renterInfo = [
    check("name").isString().withMessage("Name must be a string"),
    check("citizenId").isString().withMessage("Citizen ID must be a string"),
    check("phoneNumber")
        .optional()
        .isString()
        .withMessage("Phone number must be a string")
        .isLength({ min: 10, max: 11 })
        .withMessage("Phone number must be 10 characters"),
    check("email").optional().isEmail().withMessage("Email must be a valid email"),
    check("address")
        .optional()
        .isObject()
        .withMessage("Address must be an object")
        .custom((value) => {
            const keys = ["city", "district", "street", "ward"];
            for (const key of keys) {
                if (!Object.prototype.hasOwnProperty.call(value, key)) {
                    throw new Error(`address must have a ${key} property`);
                }
            }
            return true;
        }),
    check("tempReg").isBoolean().withMessage("Temporary registration must be a boolean"),
    check("moveInDate").optional().isString().withMessage("Move in date must be a string"),
    check("represent").isBoolean().withMessage("Represent must be a boolean"),
    check("note").optional().isString().withMessage("Note must be a string"),
];

const renterId = [check("renterId").isUUID().withMessage("Renter ID must be a UUID")];

const renterValidator = {
    login,
    verify,
    renterInfo,
    renterId,
};

export default renterValidator;
