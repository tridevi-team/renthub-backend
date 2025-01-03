"use strict";
import "dotenv/config";
import { check } from "express-validator";
import { comparePassword, validatePassword } from "./password.validator";

const refreshTokenValidator = [
    check("refreshToken", "Refresh token is required.").notEmpty().isJWT().withMessage("Invalid refresh token."),
];

const registerValidator = [
    check("email", "Please provide a valid email address.").isEmail(),
    check("fullName", "Please provide your full name.").isLength({
        min: 1,
        max: 50,
    }),
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
    check("gender", "Please provide gender.")
        .notEmpty()
        .withMessage("Gender must be required.")
        .isIn(["male", "female", "other"])
        .withMessage("Please select only a gender from the list."),
];

// username is email/ phone number, password
const loginValidator = [
    check("username", "Please provide a valid email address or phone number.").notEmpty(),
    check("password", "Password is required.").notEmpty(),
];

const verifyAccountValidator = [
    check("email", "Please provide a valid email address.").isEmail(),
    check("verifyCode", "Please provide the verification code.").isNumeric(),
];

const emailValidator = [check("email", "Please provide a valid email address.").isEmail()];

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
    check("confirmPassword", "Please confirm your password.").custom((value, { req }) => {
        comparePassword(req.body.password, value);
        return true;
    }),
];

const updatePasswordValidator = [
    check("oldPassword", "Old password is required.").notEmpty(),
    check("newPassword", "Password must be at least 8 characters long and contain at least one letter and one number.")
        .isLength({ min: 8 })
        .custom((value) => {
            // Check if the password is cryptographically hashed
            validatePassword(value);
            return true;
        }),
    check("confirmPassword", "Please confirm your password.")
        .notEmpty()
        .custom((value, { req }) => {
            comparePassword(req.body.newPassword, value);
            return true;
        }),
];

const updateProfileValidator = [
    check("fullName", "Please provide your full name.").isLength({
        min: 1,
        max: 50,
    }),
    check("phoneNumber", "Please provide a valid phone number.").isMobilePhone("vi-VN"),
    check("birthday", "Please provide a valid date of birth.").isDate(),
    check("gender", "Please provide a valid gender.").optional().isIn(["male", "female", "other"]),
    check("address", "Please provide your address.")
        .optional()
        .isObject()
        .withMessage("Address must be an object.")
        .custom((value) => {
            const keys = ["city", "district", "street", "ward"];
            for (const key of keys) {
                if (!Object.prototype.hasOwnProperty.call(value, key)) {
                    throw new Error(`address must have a ${key} property`);
                }
            }
            return true;
        }),
];

const userValidator = {
    refreshToken: refreshTokenValidator,
    register: registerValidator,
    login: loginValidator,
    verifyAccount: verifyAccountValidator,
    email: emailValidator,
    resetPassword: resetPasswordValidator,
    updatePassword: updatePasswordValidator,
    updateProfile: updateProfileValidator,
};

export default userValidator;
