// format return json

const formatJson = (success, message, data) => {
    return {
        success,
        message,
        data,
    };
};

module.exports = formatJson;
