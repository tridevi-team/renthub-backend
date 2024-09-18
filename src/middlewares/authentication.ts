import messageResponse from "../enums/message.enum";
import UserService from "../services/user.service";
import { ApiException, Exception, jwtToken } from "../utils";

const authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization) throw new ApiException(messageResponse.ACCESS_TOKEN_REQUIRED, 500);

        const data = await jwtToken.verifyAccessToken(authorization);
        const user = await UserService.getUserById(data.id);
        req.user = user;
        return next();
    } catch (error) {
        Exception.handle(error, req, res);
    }
};

export default authentication;
