"use strict";
const { check } = require("express-validator");
const { jwtToken } = require("../../utils");
require("dotenv").config();

// email, fullName, password: min 8 characters, least one number, one lowercase, confirmPassword
const registerValidator = [
    check("email", "Please provide a valid email address.").isEmail(),
    check("fullName", "Please provide your full name.").isLength({ min: 1, max: 50 }),
    check("password", "Password must be at least 8 characters long and contain at least one letter and one number.")
        .isLength({ min: 8 })
        .custom((value) => {
            // Check if the password is cryptographically hashed
            const decryptPassword = jwtToken.verify(value).password;
            if (!decryptPassword) {
                throw new Error("Password must be hashed.");
            }

            // validate password
            const passwordRegex = /^(?=.*\d)(?=.*[a-z]).{8,}$/;
            if (!passwordRegex.test(decryptPassword)) {
                throw new Error("Password must be at least 8 characters long and contain at least one letter and one number.");
            }

            return true;
        }),
    check("confirmPassword", "Please confirm your password.").custom((value, { req }) => {
        const decryptPassword = jwtToken.verify(req.body.password).password;
        const decryptConfirmPassword = jwtToken.verify(value).password;

        if (decryptPassword !== decryptConfirmPassword) {
            throw new Error("Passwords do not match.");
        }
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
            const decryptPassword = jwtToken.verify(value).password;
            if (!decryptPassword) {
                throw new Error("Password must be hashed.");
            }

            // validate password
            const passwordRegex = /^(?=.*\d)(?=.*[a-z]).{8,}$/;
            if (!passwordRegex.test(decryptPassword)) {
                throw new Error("Password must be at least 8 characters long and contain at least one letter and one number.");
            }
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
            const decryptPassword = jwtToken.verify(value).password;
            if (!decryptPassword) {
                throw new Error("Password must be hashed.");
            }

            // validate password
            const passwordRegex = /^(?=.*\d)(?=.*[a-z]).{8,}$/;
            if (!passwordRegex.test(decryptPassword)) {
                throw new Error("Password must be at least 8 characters long and contain at least one letter and one number.");
            }

            return true;
        }),
];

const updatePasswordValidator = [
    check("oldPassword", "Old password is missing or the length is less than 8.")
        .isLength({ min: 8 })
        .custom((value) => {
            // Check if the password is cryptographically hashed
            const decryptPassword = jwtToken.verify(value).password;
            if (!decryptPassword) {
                throw new Error("Password must be hashed.");
            }

            return true;
        }),
    check("newPassword", "Password must be at least 8 characters long and contain at least one letter and one number.")
        .isLength({ min: 8 })
        .custom((value) => {
            // Check if the password is cryptographically hashed
            const decryptPassword = jwtToken.verify(value).password;
            if (!decryptPassword) {
                throw new Error("Password must be hashed.");
            }

            // validate password
            const passwordRegex = /^(?=.*\d)(?=.*[a-z]).{8,}$/;
            if (!passwordRegex.test(decryptPassword)) {
                throw new Error("Password must be at least 8 characters long and contain at least one letter and one number.");
            }

            return true;
        }),
    check("confirmPassword", "Please confirm your password.")
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            const decryptPassword = jwtToken.verify(req.body.newPassword).password;
            const decryptConfirmPassword = jwtToken.verify(value).password;

            if (decryptPassword !== decryptConfirmPassword) {
                throw new Error("Passwords do not match.");
            }

            return true;
        }),
];

const updateProfileValidator = [
    check("fullName", "Please provide your full name.").isLength({ min: 1, max: 50 }),
    check("phoneNumber", "Please provide a valid phone number.").isMobilePhone(),
    check("birthday", "Please provide a valid date of birth.").isDate(),
];

module.exports = {
    registerValidator,
    loginValidator,
    verifyAccountValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    updatePasswordValidator,
    updateProfileValidator,
};
