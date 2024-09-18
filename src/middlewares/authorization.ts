const authorize = (roles = []) => {
    return async (req, res, next) => {
        next();
    };
};

export default authorize;
