const formatJson = {
    success(data) {
        return {
            statusCode: 200,
            success: true,
            data,
        };
    },

    error(message) {
        return {
            statusCode: 500,
            success: false,
            message,
        };
    },

    notFound(message) {
        return {
            statusCode: 404,
            success: false,
            message,
        };
    },

    unauthorized(message) {
        return {
            statusCode: 401,
            success: false,
            message,
        };
    },

    forbidden(message) {
        return {
            statusCode: 403,
            success: false,
            message,
        };
    },

    badRequest(message) {
        return {
            statusCode: 400,
            success: false,
            message,
        };
    },

    conflict(message) {
        return {
            statusCode: 409,
            success: false,
            message,
        };
    },

    created(data) {
        return {
            statusCode: 201,
            success: true,
            data,
        };
    },

    noContent() {
        return {
            statusCode: 204,
            success: true,
        };
    },

    accepted(data) {
        return {
            statusCode: 202,
            success: true,
            data,
        };
    },

    notImplemented(message) {
        return {
            statusCode: 501,
            success: false,
            message,
        };
    },

    serviceUnavailable(message) {
        return {
            statusCode: 503,
            success: false,
            message,
        };
    },

    tooManyRequests(message) {
        return {
            statusCode: 429,
            success: false,
            message,
        };
    },

    gone(message) {
        return {
            statusCode: 410,
            success: false,
            message,
        };
    },

    methodNotAllowed(message) {
        return {
            statusCode: 405,
            success: false,
            message,
        };
    },
};

module.exports = formatJson;
