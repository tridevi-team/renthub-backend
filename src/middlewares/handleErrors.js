const { validationResult } = require("express-validator");
const ApiException = require("../utils/Exceptions/ApiException");
const Exception = require("../utils/Exceptions/Exception");

const handleErrors = (req, res, next) => {
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

module.exports = handleErrors;
