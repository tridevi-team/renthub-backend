"use strict";
import "dotenv/config";
import messageResponse from "../../enums/message.enum";
import ApiException from "./ApiException";
import ExceptionHandler from "./ExceptionHandler";

const NODE_ENV = process.env.NODE_ENV || "development";

class Exception {
    code: string;
    message: string;
    data: unknown;
    httpCode: number;
    static request: Request;
    static response: Response;

    constructor(message: string, data: unknown, httpCode: number) {
        this.code = Exception.getKeyByValue(message) || "UNKNOWN_ERROR";
        this.message = message;
        this.data = data;
        this.httpCode = httpCode;
    }

    static getKeyByValue(value: string): string | undefined {
        return Object.keys(messageResponse).find(
            (key) => messageResponse[key as keyof typeof messageResponse] === value
        );
    }

    static handle(error: any, request: Request, response: Response) {
        this.request = request;
        this.response = response;
        if (typeof error === "string") {
            error = {
                code: this.getKeyByValue(error) || "UNKNOWN_ERROR",
                message: error,
            };
        }

        error.code = this.getKeyByValue(error.message) || "UNKNOWN_ERROR";
        error.success = false;
        error.message = error.message || "";
        error.httpCode = error.httpCode || 500;
        error.data = error.data || error.stack || {};

        if (!(error instanceof ApiException) && NODE_ENV === "production") {
            error.data = {};
        }

        const exceptionHandler = new ExceptionHandler();
        exceptionHandler.handle(error, { request, response });
    }
}

export default Exception;
