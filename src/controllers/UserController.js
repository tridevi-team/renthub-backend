const { validationResult } = require("express-validator");
const { Users } = require("../models");
const { formatJson, jwtToken, sendMail, Exception, ApiException } = require("../utils");

const userController = {
    async getAllUsers(req, res) {
        try {
            const { authorization } = req.headers;

            if (jwtToken.verify(authorization)) {
                throw new ApiException(500, "Invalid token");
            }

            const users = await Users.query();

            if (users.length > 0 && users) {
                res.status(200).json(formatJson.success(1001, "Users found", users));
            } else {
                throw new ApiException(1002, "No users found"); // Throw ApiException if no users are found
            }
        } catch (err) {
            Exception.handle(err, req, res); // Call Exception.handle to handle the error
        }
    },

    async getInfoByToken(req, res) {
        try {
            const { authorization } = req.headers;

            if (!authorization) {
                throw new ApiException(500, "Invalid token");
            }

            const user = jwtToken.verify(authorization);

            console.log(user);

            if (user) {
                res.json(formatJson.success(1001, "User found", user));
            } else {
                throw new ApiException(1002, "No user found"); // Throw ApiException if no user is found
            }
        } catch (err) {
            Exception.handle(err, req, res); // Call Exception.handle to handle the error
        }
    },

    async login(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array()); // Throw ApiException if there are validation errors
            }

            const { username, password } = req.body;
            // username can be email or phone number
            const user = await Users.query().findOne({ email: username, password }).orWhere("phone_number", username).andWhere("password", password);

            if (user) {
                if (user.verify === false) {
                    throw new ApiException(1018, "Please verify your account first.");
                }

                if (user.status === false) {
                    throw new ApiException(1019, "Your account has been disabled. Please contact the administrator.");
                }

                const token = jwtToken.sign({ user });
                res.json(
                    formatJson.success(1003, "Logged in successfully", {
                        token,
                        user: {
                            id: user.id,
                            email: user.email,
                            phone_number: user.phone_number,
                            full_name: user.full_name,
                            birthday: user.birthday,
                            role: user.role,
                            type: user.type,
                            status: user.status,
                        },
                    })
                );
            } else {
                throw new ApiException(1004, "Invalid username or password"); // Throw ApiException if user is not found
            }
        } catch (err) {
            Exception.handle(err, req, res); // Call Exception.handle to handle the error
        }
    },

    async signup(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return new ApiException(1005, "Invalid input", errors.array()); // Throw ApiException if there are validation errors
            }

            const { email, password, fullName } = req.body;

            const checkUserExists = await Users.query().findOne({ email });

            if (checkUserExists) {
                throw new ApiException(1006, "User already exists");
            }

            const newUser = await Users.query().insert({
                email: email.toLowerCase().trim(),
                full_name: fullName.trim(),
                password,
            });

            if (newUser) {
                const verifyCode = Math.floor(1000 + Math.random() * 9000);

                await Users.query().findById(newUser.id).patch({ code: verifyCode });

                const mail = await sendMail(email, "Verify your account", `Your verification code is: ${verifyCode}`);
                if (mail) {
                    res.json(formatJson.success(1007, "Please check your email to verify your account."));
                } else {
                    throw new ApiException(1009, "Failed to send email verification code. Please try again.");
                }
            } else {
                throw new ApiException(1008, "Failed to create user.");
            }
        } catch (err) {
            Exception.handle(err, req, res); // Call Exception.handle to handle the error
        }
    },

    async verifyAccount(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array()); // Throw ApiException if there are validation errors
            }

            const { verifyCode, email } = req.body;

            let parseCode = typeof verifyCode === "string" ? parseInt(verifyCode) : verifyCode;

            const user = await Users.query().findOne({
                email: email.toLowerCase().trim(),
                code: parseCode,
            });

            if (user) {
                await Users.query().findById(user.id).patch({ verify: true, code: -1 });
                res.json(formatJson.success(1010, "Account verified successfully."));
            } else {
                throw new ApiException(1011, "Invalid verification code");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async forgotPassword(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array()); // Throw ApiException if there are validation errors
            }

            const { email } = req.body;

            const user = await Users.query().findOne({ email });

            if (user) {
                const verifyCode = Math.floor(1000 + Math.random() * 9000);

                await Users.query().findById(user.id).patch({ code: verifyCode });

                const mail = await sendMail(email, "Reset your password", `Your verification code is: ${verifyCode}`);
                if (mail) {
                    res.json(formatJson.success(1012, "Please check your email to reset your password."));
                } else {
                    throw new ApiException(1009, "Failed to send email verification code. Please try again.");
                }
            } else {
                throw new ApiException(1002, "User not found");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async resetPassword(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array()); // Throw ApiException if there are validation errors
            }

            const { code, email, password } = req.body;

            const user = await Users.query().findOne({
                email,
                code,
            });

            if (user) {
                await Users.query().findById(user.id).patch({ password, code: -1 });
                res.json(formatJson.success(1013, "Password reset successfully."));
            } else {
                throw new ApiException(1011, "Invalid verification code");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async updatePassword(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array()); // Throw ApiException if there are validation errors
            }

            const { authorization } = req.headers;

            if (!authorization) {
                throw new ApiException(500, "Invalid token");
            }

            const { oldPassword, newPassword, email } = req.body;

            const user = await Users.query().findOne({ email, password: oldPassword });

            if (user) {
                await Users.query().findById(user.id).patch({ password: newPassword });
                res.json(formatJson.success(1014, "Password updated successfully."));
            } else {
                throw new ApiException(1015, "Invalid old password");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },

    async updateProfile(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new ApiException(1005, "Invalid input", errors.array()); // Throw ApiException if there are validation errors
            }

            const { authorization } = req.headers;

            if (!authorization) {
                throw new ApiException(500, "Invalid token");
            }

            const { fullName, phoneNumber, birthday } = req.body;

            const user = jwtToken.verify(authorization);

            if (user) {
                await Users.query().findById(user.id).patch({ full_name: fullName, phone_number: phoneNumber, birthday });

                const newToken = jwtToken.sign(user);
                res.json(formatJson.success(1016, "Profile updated successfully.", { token: newToken }));
            } else {
                throw new ApiException(1017, "Invalid user");
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    },
};

module.exports = userController;
