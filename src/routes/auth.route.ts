import express from "express";
import { UserController } from "../controllers";
import { authentication, handleErrors } from "../middlewares";
import { userValidator } from "../middlewares/validator";

const authRoute = express.Router();

authRoute.post("/refresh-token", userValidator.refreshToken, handleErrors, UserController.refreshToken);
authRoute.put("/logout", authentication, userValidator.refreshToken, handleErrors, UserController.logout);
authRoute.post("/login", userValidator.login, handleErrors, UserController.login);
authRoute.post("/signup", userValidator.register, handleErrors, UserController.signup);
authRoute.put("/verify-account", userValidator.verifyAccount, handleErrors, UserController.verifyAccount);
authRoute.put("/resend-code", userValidator.email, handleErrors, UserController.resendCode);
authRoute.post("/forgot-password", userValidator.email, handleErrors, UserController.forgotPassword);
authRoute.put("/reset-password", userValidator.resetPassword, handleErrors, UserController.resetPassword);

export default authRoute;
