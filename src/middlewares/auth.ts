import { ApiException, Exception, jwtToken } from "../utils";

const ignoreAuth = async (req: any, res: any, next: Function) => {
    const urls = ["/users/login", "/users/signup", "/users/resendCode", "/users/forgotPassword", "/users/resetPassword", "/users/verifyAccount"];

    if (urls.includes(req.originalUrl)) {
        return next();
    } else {
        const { authorization } = req.headers;

        try {
            if (!authorization) {
                throw new ApiException(500, "Access token is required.", null);
            }
            const user = await jwtToken.verify(authorization);
            req.user = user;
            return next();
        } catch (error) {
            Exception.handle(error, req, res);
        }
    }
};

export default ignoreAuth;
