import { jwtToken } from "../utils";

const ignoreAuth = async (req: any, res: any, next: Function) => {
    const urls = ["/users/login", "/users/signup", "/users/resendCode", "/users/forgotPassword", "/users/resetPassword", "/users/verifyAccount"];

    if (urls.includes(req.originalUrl)) {
        return next();
    } else {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const token = authorization.split(" ")[1];

        try {
            const user = await jwtToken.verify(token);

            console.log("user", user);

            return next();
        } catch (error) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
    }
};

export default ignoreAuth;
