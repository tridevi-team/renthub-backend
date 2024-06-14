"use strict";
import { aesDecrypt } from "../../utils";

const validatePassword = (password) => {
    // Check if the password is cryptographically hashed
    const decryptedPassword = aesDecrypt(password);

    if (!decryptedPassword) {
        throw new Error("Password must be hashed.");
    }
    // validate password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z]).{8,}$/;
    if (!passwordRegex.test(decryptedPassword)) {
        throw new Error("Password must be at least 8 characters long and contain at least one letter and one number.");
    }
};

const comparePassword = (password1, password2) => {
    const decryptPassword1 = aesDecrypt(password1);
    const decryptPassword2 = aesDecrypt(password2);

    if (decryptPassword1 !== decryptPassword2) {
        throw new Error("Passwords do not match.");
    }
};

export { validatePassword, comparePassword };
