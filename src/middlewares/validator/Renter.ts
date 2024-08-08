import { check } from "express-validator";

const renterInfo = [
    check("name").isString().withMessage("Name must be a string"),
    check("citizenId").isString().withMessage("Citizen ID must be a string"),
    // check("phoneNumber").isString().withMessage("Phone number must be a string").isLength({ min: 10, max: 11 }).withMessage("Phone number must be 10 characters"),
    // check("email").isEmail().withMessage("Email must be a valid email"),
    // check("licensePlates").isString().withMessage("License plates must be a string"),
    check("temporaryRegistration").isBoolean().withMessage("Temporary registration must be a boolean"),
    check("moveInDate").isString().withMessage("Move in date must be a string"),
    check("represent").isBoolean().withMessage("Represent must be a boolean"),
];

const renterValidator = {
    renterInfo,
};

export default renterValidator;
