"use strict";
import { validationResult } from "express-validator";
import { ApiException, Exception } from "../utils";
import messageResponse from "../enums/message.enum";

const handleErrors = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiException(messageResponse.VALIDATION_ERROR, 400, errors.array());
        }
        next();
    } catch (err) {
        Exception.handle(err, req, res);
    }
};

export default handleErrors;
