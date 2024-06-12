"use strict";
import ExceptionHandler from "./ExceptionHandler";

class Exception {
    code: number;
    message: string;
    data: any;
    httpCode: number;
    static request: any;
    static response: any;

    constructor(code: number, message: string, data: any, httpCode: number) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.httpCode = httpCode;
    }

    static handle(error: any, request: any, response: any) {
        this.request = request;
        this.response = response;
        if (typeof error === "string") {
            error = {
                code: 500,
                message: error,
            };
        }
        error.code = error.code || 500;
        error.message = error.message || "";
        error.httpCode = error.httpCode || 500;
        error.data = error.data || error.stack || {};

        let exceptionHandler = new ExceptionHandler();
        exceptionHandler.handle(error, { request, response });
    }
}

export default Exception;
