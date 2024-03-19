"use strict";
const formatJson = {
    success(code, message, data = null) {
        return {
            code,
            httpCode: 200,
            success: true,
            message,
            data,
        };
    },

    error(code, message, data = null) {
        return {
            code,
            httpCode: 400,
            success: false,
            message,
            data,
        };
    },

    notFound(message, data = null) {
        return {
            statusCode: 404,
            success: false,
            message,
            data,
        };
    },

    unauthorized(message, data = null) {
        return {
            statusCode: 401,
            success: false,
            message,
            data,
        };
    },
};

module.exports = formatJson;
