"use strict";
const ExceptionHandlerInstance = require("./ExceptionHandler");

class Exception {
    code: Number;
    message: any;
    data: any;
    httpCode: any;
    static request: any;
    static response: any;

    constructor(code: Number, message: any, data: any, httpCode: any) {
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

export default Exception;
