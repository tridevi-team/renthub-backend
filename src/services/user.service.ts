import "dotenv/config";
import redisConfig from "../config/redis.config";
import messageResponse from "../enums/message.enum";
import { UserCreate, UserUpdate } from "../interfaces";
import { Users } from "../models";
import { ApiException, bcrypt, jwtToken, sendMail } from "../utils";
import camelToSnake from "../utils/camelToSnake";
import HouseService from "./house.service";

class UserService {
    static async getUserById(id: string) {
        const user = await Users.query().findById(id);
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 404);
        }
        return user;
    }

    static async checkUserExist(filter: any = {}) {
        const user = await Users.query().findOne(filter);
        return user ? true : false;
    }

    static async getUsers(filter: any = {}) {
        const users = await Users.query().where(filter);
        if (users.length === 0) {
            throw new ApiException(messageResponse.NO_USERS_FOUND, 404);
        }
        return users;
    }

    static async login(username: string, password: string) {
        const user = await Users.query().findOne({ email: username }).orWhere({ phone_number: username });

        if (!user) {
            throw new ApiException(messageResponse.INVALID_USER, 401);
        } else if (!user.verify) {
            throw new ApiException(messageResponse.VERIFY_ACCOUNT_FIRST, 403);
        } else if (!user.status) {
            throw new ApiException(messageResponse.ACCOUNT_DISABLED, 403);
        } else {
            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                throw new ApiException(messageResponse.INVALID_USER, 401);
            }
        }

        const housePermissions = await HouseService.getHouseByUser(user.id);
        const { accessToken, refreshToken } = await this.generateToken({
            id: user.id,
            email: user.email,
            password: user.password,
            phoneNumber: user.phone_number,
            role: user.role,
            status: user.status,
        });

        return {
            user,
            token: {
                accessToken,
                refreshToken,
            },
            houses: housePermissions,
        };
    }

    static async verifyPassword(email: string, password: string) {
        const user = await Users.query().findOne({ email });
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 400);
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            throw new ApiException(messageResponse.INCORRECT_OLD_PASSWORD, 422);
        }
        return true;
    }

    static async generateToken(user: { id: string; email: string; password: string; phoneNumber: string; role: string; status: boolean }) {
        const accessToken = jwtToken.signAccessToken(user);
        const refreshToken = jwtToken.signRefreshToken({
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        return { accessToken, refreshToken };
    }

    static async createUser(data: UserCreate) {
        const isExists = await this.checkUserExist({ email: data.email });
        if (isExists) throw new ApiException(messageResponse.USER_ALREADY_EXISTS, 409);

        const user = await Users.query().insertAndFetch(camelToSnake(data)).select("id", "email", "full_name", "phone_number", "birthday");

        return user;
    }

    static async verifyAccount(data: { email: string; verifyCode: string }) {
        const user = await Users.query().findOne({ email: data.email });
        const redis = await redisConfig;

        const code = await redis.get(`verify-account:${data.email}`);

        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 404);
        } else if (user.verify) {
            throw new ApiException(messageResponse.ACCOUNT_PREVIOUSLY_VERIFIED, 409);
        } else if (code !== String(data.verifyCode)) {
            throw new ApiException(messageResponse.INVALID_VERIFICATION_CODE, 401);
        }
        await redis.del(`verify-account:${data.email}`);
        await user.$query().patch({ verify: true });
        return user;
    }

    static async resendCode(email: string) {
        const user = await Users.query().findOne({ email });
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 404);
        } else if (user.verify) {
            throw new ApiException(messageResponse.ACCOUNT_PREVIOUSLY_VERIFIED, 409);
        }

        const newCode = Math.floor(1000 + Math.random() * 9000);
        const mail = await sendMail(email, "Verify your account", `Your verification code is: ${newCode}`);
        if (!mail) {
            throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 500);
        }
        const redis = await redisConfig;
        await redis.set(`verify-account:${email}`, newCode);
        await redis.expire(`verify-account:${email}`, parseInt(process.env.REDIS_EXPIRE_TIME));
    }

    static async forgotPassword(email: string) {
        const user = await Users.query().findOne({ email });
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 200);
        }
        const verifyCode = Math.floor(1000 + Math.random() * 9000);
        const mail = await sendMail(email, "Reset your password", `Your verification code is: ${verifyCode}`);
        if (!mail) {
            throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 500);
        }
        const redis = await redisConfig;
        await redis.set(`reset-password:${email}`, String(verifyCode));
        await redis.expire(`reset-password:${email}`, parseInt(process.env.REDIS_EXPIRE_TIME));
    }

    static async resetPassword(data: { code: string; email: string; password: string }) {
        const user = await Users.query().findOne({ email: data.email });
        const redis = await redisConfig;
        const code = await redis.get(`reset-password:${data.email}`);
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 200);
        } else if (String(code) !== data.code) {
            throw new ApiException(messageResponse.INVALID_VERIFICATION_CODE, 200);
        }
        this.changePassword(data.email, data.password);
        return user;
    }

    static async changePassword(email: string, newPassword: string) {
        // hash new password
        const hashPassword = await bcrypt.hash(newPassword);
        // update password
        await Users.query().findOne({ email }).patch({ password: hashPassword });
        return true;
    }

    static async updateProfile(id: string, data: UserUpdate) {
        const user = await Users.query().findById(id);
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 404);
        }
        await user.$query().patch(camelToSnake(data));
        return user;
    }

    static async updateFirstLoginStatus(id: string) {
        const user = await Users.query().findById(id);
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 404);
        }
        await user.$query().patch({ first_login: false });
        return user;
    }
}

export default UserService;
