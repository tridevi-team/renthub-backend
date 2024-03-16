const ExceptionHandlerInstance = require("./ExceptionHandler");
const { Response } = require("express");

class Exception {
    constructor(code, message, data, httpCode) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.httpCode = httpCode;
    }

    static handle(error, request, response) {
        this.request = request;
        this.response = response;
        if (typeof error == "string") {
            error = {
                code: 500,
                message: error,
            };
        }
        error.code = error.code || 500;
        error.message = error.message || "";
        error.httpCode = error.httpCode || 500;
        error.data = error.data || error.stack || {};
        let ExceptionHandler = new ExceptionHandlerInstance();
        ExceptionHandler.handle(error, { request, response });
    }
}

module.exports = Exception;
