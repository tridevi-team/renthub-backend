"use strict";
import { validationResult } from "express-validator";
import { ApiException, Exception } from "../utils";

const handleErrors = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiException(500, "Validation error", errors.array());
        }
        next();
    } catch (err) {
        Exception.handle(err, req, res);
    }
};

export default handleErrors;
