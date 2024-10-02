"use strict";
import messageResponse from "../../enums/message.enum";
import ExceptionHandler from "./ExceptionHandler";

class Exception {
    code: string;
    message: string;
    data: any;
    httpCode: number;
    static request: any;
    static response: any;

    constructor(message: string, data: any, httpCode: number) {
        this.code = Exception.getKeyByValue(message) || "UNKNOWN_ERROR";
        this.message = message;
        this.data = data;
        this.httpCode = httpCode;
    }

    static getKeyByValue(value: string): string | undefined {
        return Object.keys(messageResponse).find((key) => messageResponse[key as keyof typeof messageResponse] === value);
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

        error.code = this.getKeyByValue(error.message) || "UNKNOWN_ERROR";
        error.success = false;
        error.message = error.message || "";
        error.httpCode = error.httpCode || 500;
        error.data = error.data || error.stack || {};

        const exceptionHandler = new ExceptionHandler();
        exceptionHandler.handle(error, { request, response });
    }
}

export default Exception;
