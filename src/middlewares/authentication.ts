import messageResponse from "../enums/message.enum";
import { AccessTokenPayload, AccessTokenRenterPayload, FirebaseToken } from "../interfaces";
import { FirebaseService, RenterService, UserService } from "../services";
import { ApiException, Exception, jwtToken } from "../utils";

const authentication = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            throw new ApiException(messageResponse.ACCESS_TOKEN_REQUIRED, 401);
        }

        let data: AccessTokenPayload | AccessTokenRenterPayload | FirebaseToken;

        // Verify the token from JWT or Firebase
        try {
            data = jwtToken.verifyAccessToken(authorization) as AccessTokenPayload | AccessTokenRenterPayload;
        } catch (error) {
            try {
                data = (await FirebaseService.verifyToken(authorization)) as FirebaseToken;
            } catch (firebaseError) {
                throw new ApiException(messageResponse.TOKEN_INVALID, 401);
            }
        }

        // Check if it's a Firebase token (has "iss" and "aud")
        if ("iss" in data && "aud" in data) {
            const { email, phone_number: phoneNumber, uid } = data as FirebaseToken;

            const key = email || phoneNumber || uid;

            // Search for renter by phone number or email
            const renter = await RenterService.findOne(key);

            req.user = renter ? renter : data;
            return next();
        }

        // Handle standard JWT token (AccessTokenPayload)
        if (data.role === "renter") {
            const renter = await RenterService.getById((data as AccessTokenRenterPayload).id);
            if (renter) {
                req.user = renter;
                return next();
            }
        }

        const user = await UserService.getUserById((data as AccessTokenPayload).id);
        if (user) {
            req.user = user;
            return next();
        }

        // If no user/renter was found, return unauthorized
        throw new ApiException(messageResponse.UNAUTHORIZED, 401);
    } catch (err) {
        Exception.handle(err, req, res);
    }
};

export default authentication;
