"use strict";
import { check } from "express-validator";
import { validatePassword, comparePassword } from "./password";
import "dotenv/config";

// email, fullName, password: min 8 characters, least one number, one lowercase, confirmPassword
const registerValidator = [
    check("email", "Please provide a valid email address.").isEmail(),
    check("fullName", "Please provide your full name.").isLength({ min: 1, max: 50 }),
    check("password", "Password must be at least 8 characters long and contain at least one letter and one number.")
        .isLength({ min: 8 })
        .custom((value) => {
            // Check if the password is cryptographically hashed
            validatePassword(value);

            return true;
        }),
    check("confirmPassword", "Please confirm your password.").custom((value, { req }) => {
        comparePassword(req.body.password, value);
        return true;
    }),
];

// username is email/ phone number, password
const loginValidator = [
    check("username", "Please provide a valid email address or phone number.").not(),
    check("password", "Password must be at least 8 characters long and contain at least one letter and one number.")
        .isLength({ min: 8 })
        .custom((value) => {
            // Check if the password is cryptographically hashed
            validatePassword(value);
            return true;
        }),
];

const verifyAccountValidator = [check("email", "Please provide a valid email address.").isEmail(), check("verifyCode", "Please provide the verification code.").isNumeric()];

const forgotPasswordValidator = [check("email", "Please provide a valid email address.").isEmail()];

const resetPasswordValidator = [
    check("email", "Please provide a valid email address.").isEmail(),
    check("code", "Please provide the verification code.").isNumeric(),
    check("password", "Password must be at least 8 characters long and contain at least one letter and one number.")
        .isLength({ min: 8 })
        .custom((value) => {
            // Check if the password is cryptographically hashed
            validatePassword(value);

            return true;
        }),
];

const updatePasswordValidator = [
    check("oldPassword", "Old password is missing or the length is less than 8.")
        .isLength({ min: 8 })
        .custom((value) => {
            // Check if the password is cryptographically hashed
            validatePassword(value);

            return true;
        }),
    check("newPassword", "Password must be at least 8 characters long and contain at least one letter and one number.")
        .isLength({ min: 8 })
        .custom((value) => {
            // Check if the password is cryptographically hashed
            validatePassword(value);

            return true;
        }),
    check("confirmPassword", "Please confirm your password.")
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            comparePassword(req.body.newPassword, value);

            return true;
        }),
];

const updateProfileValidator = [
    check("fullName", "Please provide your full name.").isLength({ min: 1, max: 50 }),
    check("phoneNumber", "Please provide a valid phone number.").isMobilePhone("vi-VN"),
    check("birthday", "Please provide a valid date of birth.").isDate(),
];

const userValidator = {
    registerValidator,
    loginValidator,
    verifyAccountValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    updatePasswordValidator,
    updateProfileValidator,
};

export default userValidator;
