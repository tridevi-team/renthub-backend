import messageResponse from "../enum/message.enum";
import { UserRoles, Users } from "../models";
import { ApiException, bcrypt, jwtToken, sendMail } from "../utils";

class UserService {
    static async getUserById(id: string) {
        const user = await Users.query().findById(id);
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 200);
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
            throw new ApiException(messageResponse.NO_USERS_FOUND, 200);
        }
        return users;
    }

    static async login(username: string, password: string) {
        const user = await Users.query().findOne({ email: username }).orWhere({ phone_number: username });

        if (!user) {
            throw new ApiException(messageResponse.INVALID_USER, 200);
        } else if (!user.verify) {
            throw new ApiException(messageResponse.VERIFY_ACCOUNT_FIRST, 200);
        } else if (!user.status) {
            throw new ApiException(messageResponse.ACCOUNT_DISABLED, 200);
        } else {
            const checkPassword = await this.verifyPassword(user.email, password);
            if (!checkPassword) {
                throw new ApiException(messageResponse.INVALID_USER, 200);
            }
        }

        const housePermissions = await UserRoles.query().leftJoin("roles", "roles.id", "user_roles.role_id").where("user_id", user.id).select("houses.id", "roles.permissions");

        const token = await this.generateToken({
            id: user.id,
            email: user.email,
            phoneNumber: user.phone_number,
            role: user.role,
            status: user.status,
        });

        return {
            user,
            token,
            houses: housePermissions,
        };
    }

    static async verifyPassword(email: string, password: string) {
        const user = await Users.query().findOne({ email });
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 200);
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            throw new ApiException(messageResponse.INCORRECT_OLD_PASSWORD, 200);
        }
        return true;
    }

    static async generateToken(user: { id: string; email: string; phoneNumber: string; role: string; status: boolean }) {
        return jwtToken.sign(user);
    }

    static async createUser(data: { email: string; full_name: string; password: string; phone_number: string; birthday: string; gender: string; address: string }) {
        const isExists = await this.checkUserExist({ email: data.email });
        if (isExists) throw new ApiException(messageResponse.USER_ALREADY_EXISTS, 200);
        const userTest = await Users.query().insertAndFetch(data).select("id", "email", "full_name", "phone_number", "birthday");

        const user = await Users.query().findOne({ email: data.email });
        if (user) {
            let verifyCode = Math.floor(1000 + Math.random() * 9000);
            while (verifyCode.toString().length !== 4) {
                verifyCode = Math.floor(1000 + Math.random() * 9000);
            }

            await user.$query().patch({ code: String(verifyCode) });
            const mail = await sendMail(data.email, "Verify your account", `Your verification code is: ${verifyCode}`);
            if (mail) {
                return user;
            } else {
                throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 200);
            }
        } else {
            throw new ApiException(messageResponse.FAILED_CREATE_USER, 200);
        }
    }

    static async verifyAccount(data: { email: string; verifyCode: string }) {
        const user = await Users.query().findOne({ email: data.email });
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 200);
        } else if (user.verify) {
            throw new ApiException(messageResponse.ACCOUNT_PREVIOUSLY_VERIFIED, 200);
        } else if (user.code !== data.verifyCode) {
            throw new ApiException(messageResponse.INVALID_VERIFICATION_CODE, 200);
        }
        await user.$query().patch({ verify: true, code: "" });
        return user;
    }

    static async resendCode(email: string) {
        const user = await Users.query().findOne({ email });
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 200);
        } else if (user.verify) {
            throw new ApiException(messageResponse.ACCOUNT_PREVIOUSLY_VERIFIED, 200);
        }
        const newCode = Math.floor(1000 + Math.random() * 9000);
        const mail = await sendMail(email, "Verify your account", `Your verification code is: ${newCode}`);
        if (!mail) {
            throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 200);
        }
        await user.$query().patch({ code: String(newCode) });
    }

    static async forgotPassword(email: string) {
        const user = await Users.query().findOne({ email });
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 200);
        }
        const verifyCode = Math.floor(1000 + Math.random() * 9000);
        const mail = await sendMail(email, "Reset your password", `Your verification code is: ${verifyCode}`);
        if (!mail) {
            throw new ApiException(messageResponse.FAILED_EMAIL_VERIFICATION, 200);
        }
        await user.$query().patch({ code: String(verifyCode) });
    }

    static async resetPassword(data: { code: string; email: string; password: string }) {
        const user = await Users.query().findOne({ email: data.email });
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 200);
        } else if (user.code !== data.code) {
            throw new ApiException(messageResponse.INVALID_VERIFICATION_CODE, 200);
        }
        await user.$query().patch({ code: "" });
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

    static async updateProfile(id: string, data: { email: string; full_name: string; phone_number: string; birthday: string }) {
        const user = await Users.query().findById(id);
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 200);
        }
        await user.$query().patch(data);
        return user;
    }

    static async updateFirstLoginStatus(id: string) {
        const user = await Users.query().findById(id);
        if (!user) {
            throw new ApiException(messageResponse.GET_USER_NOT_FOUND, 200);
        }
        await user.$query().patch({ first_login: false });
        return user;
    }
}

export default UserService;
