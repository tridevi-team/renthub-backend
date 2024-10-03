"use strict";

class ExceptionHandler {
    /**
     *
     * @param {httpCode, code, message, data} error
     * @param request
     * @param response
     */
    async handle(error, { response }: { request; response }) {
        let success = false,
            code = "UNKNOWN_ERROR",
            message = "",
            data = {},
            httpCode = 200;
        if (typeof error !== "object") {
            error = new Error(error);
        }

        success = error.success || false;
        code = error.code || "UNKNOWN_ERROR";
        message = error.message || "";
        data = error.data || error.stack || {};
        httpCode = error.httpCode || 200;
        console.log("ERROR:", error);

        response.status(httpCode).send({
            success,
            code,
            message,
            data,
        });
    }
}

export default ExceptionHandler;
