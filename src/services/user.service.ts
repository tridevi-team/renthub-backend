import "dotenv/config";
import redisConfig from "../config/redis.config";
import { EPagination, messageResponse, NotificationType } from "../enums";
import type { AccessTokenPayload, Filter, RefreshTokenPayload, UserCreate, UserUpdate } from "../interfaces";
import { UserRoles, Users } from "../models";
import { ApiException, bcrypt, camelToSnake, filterHandler, jwtToken, sortingHandler } from "../utils";
import { HouseService, NotificationService } from "./";

class UserService {
    static async getAllUsers() {
        const users = await Users.query();
        if (users.length === 0) {
            throw new ApiException(messageResponse.NO_USERS_FOUND, 404);
        }
        return users;
    }

    static async search(q: string) {
        const users = await Users.query()
            .where("email", "=", q)
            .orWhere("phone_number", "=", q)
            .select("id", "full_name");
        if (users.length === 0) {
            throw new ApiException(messageResponse.NO_USERS_FOUND, 404);
        }
        return users;
    }

    static async getUserInHouse(houseId: string, filterData: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_LIMIT } = {},
        } = filterData || {};

        let query = UserRoles.query()
            .where("roles.house_id", houseId)
            .join("users", "user_roles.userId", "users.id")
            .join("roles", "user_roles.roleId", "roles.id")
            .select(
                "users.id",
                "users.full_name",
                "users.gender",
                "users.email",
                "users.phone_number",
                "users.address",
                "users.birthday",
                "users.verify",
                "roles.id as roleId",
                "roles.name as role"
            );

        query = filterHandler(query, filter);

        query = sortingHandler(query, sort);

        const cloneQuery = query.clone();
        const total = await cloneQuery.resultSize();
        const totalPages = Math.ceil(total / pageSize);

        if (total === 0) throw new ApiException(messageResponse.NO_USERS_FOUND, 404);

        if (page === -1 && pageSize === -1) await query.page(0, total);
        else await query.page(page - 1, pageSize);

        const fetchData = await query;

        return {
            ...fetchData,
            total,
            page,
            pageCount: totalPages,
            pageSize,
        };
    }

    static async getUserById(id: string) {
        const user = await Users.query().findById(id);
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 404);
        }
        return user;
    }

    static async checkUserExist(filter: object = {}) {
        const user = await Users.query().findOne(filter);
        return user ? true : false;
    }

    static async getUsers(filter: object = {}) {
        const users = await Users.query().where(filter);
        if (users.length === 0) {
            throw new ApiException(messageResponse.NO_USERS_FOUND, 404);
        }
        return users;
    }

    static async login(username: string, password: string) {
        const user = await Users.query().findOne({ email: username }).orWhere({ phone_number: username });

        if (!user) {
            throw new ApiException(messageResponse.INVALID_USER, 400);
        } else if (!user.verify) {
            throw new ApiException(messageResponse.VERIFY_ACCOUNT_FIRST, 403);
        } else if (!user.status) {
            throw new ApiException(messageResponse.ACCOUNT_DISABLED, 403);
        } else {
            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                throw new ApiException(messageResponse.INVALID_USER, 400);
            }
        }

        const housePermissions = await HouseService.getHouseByUser(user.id);
        const { accessToken, refreshToken } = await this.generateToken({
            id: user.id,
            email: user.email,
            fullName: user.full_name,
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

    static async generateToken(user: AccessTokenPayload) {
        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);
        return { accessToken, refreshToken };
    }

    static async generateAccessToken(user: AccessTokenPayload) {
        return jwtToken.signAccessToken(user);
    }

    static async generateRefreshToken(user: RefreshTokenPayload) {
        return jwtToken.signRefreshToken(user);
    }

    static async createUser(data: UserCreate) {
        const isExists = await this.checkUserExist({ email: data.email });
        if (isExists) throw new ApiException(messageResponse.USER_ALREADY_EXISTS, 409);

        const user = await Users.query()
            .insertAndFetch(camelToSnake(data))
            .select("id", "email", "full_name", "phone_number", "birthday");

        // create notification for new user
        await NotificationService.create({
            title: "Chào mừng bạn đến với RentHub",
            content: `Chào mừng ${user.full_name} đến với RentHub, hãy cùng khám phá các dịch vụ mà chúng tôi cung cấp.`,
            type: NotificationType.SYSTEM,
            data: {
                path: "/",
            },
            recipients: [user.id],
        });

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
            throw new ApiException(messageResponse.INVALID_VERIFICATION_CODE, 400);
        }
        await redis.del(`verify-account:${data.email}`);
        await user.$query().patch({ verify: true });

        // send notification
        await NotificationService.create({
            title: "Xác thực tài khoản thành công",
            content: `Tài khoản ${data.email} đã được xác thực thành công.`,
            type: NotificationType.SYSTEM,
            data: {
                path: "/",
            },
            recipients: [user.id],
        });
        return user;
    }

    static async getUserByEmail(email: string) {
        const user = await Users.query().findOne({ email });
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 404);
        }
        return user;
    }

    static async resetPassword(data: { code: string; email: string; password: string }) {
        const redis = await redisConfig;
        const code = await redis.get(`reset-password:${data.email}`);
        if (String(code) !== data.code) {
            throw new ApiException(messageResponse.INVALID_VERIFICATION_CODE, 401);
        }
        this.changePassword(data.email, data.password);

        // send notification
        await NotificationService.create({
            title: "Thay đổi mật khẩu thành công",
            content: `Mật khẩu của tài khoản ${data.email} đã được thay đổi thành công.`,
            type: NotificationType.WARNING,
            data: {
                path: "/",
            },
            recipients: [data.email],
        });
        return true;
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

    static async getSystemUser() {
        const user = await Users.query().findOne({ role: "system" });
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 404);
        }
        return user;
    }
}

export default UserService;
