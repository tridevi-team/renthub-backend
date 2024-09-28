import messageResponse from "../enums/message.enum";
import { RenterService } from "../services";
import UserService from "../services/user.service";
import { ApiException, Exception, jwtToken } from "../utils";

const authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization) throw new ApiException(messageResponse.ACCESS_TOKEN_REQUIRED, 401);

        const data = await jwtToken.verifyAccessToken(authorization);

        // check type user or renter
        let user = null;
        if (data.type === "renter") {
            user = await RenterService.get(data.id);
        } else {
            user = await UserService.getUserById(data.id);
        }
        req.user = user;

        return next();
    } catch (error) {
        Exception.handle(error, req, res);
    }
};

export default authentication;
