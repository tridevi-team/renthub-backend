const { Exception, ApiException } = require("../utils");

const checkAuthorization = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!jwtToken.verify(authorization)) {
            throw new ApiException(500, "Invalid token");
        }
        next();
    } catch (err) {
        Exception.handle(err, req, res);
    }
};

module.exports = checkAuthorization;
