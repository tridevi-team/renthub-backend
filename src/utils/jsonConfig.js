const formatJson = {
    success(message, data = null) {
        return {
            statusCode: 200,
            success: true,
            message,
            data,
        };
    },

    error(message, data = null) {
        return {
            statusCode: 400,
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
