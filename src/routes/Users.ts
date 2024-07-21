"use strict";
import express from "express";
import { userController } from "../controllers";
import { userValidator } from "../middlewares/validator";
import handleErrors from "../middlewares/handleErrors";

const usersRouter = express.Router();

usersRouter.get("/getAllUsers", userController.getAllUsers);
usersRouter.get("/getInfoByToken", userController.getInfoByToken);
usersRouter.post("/login", userValidator.loginValidator, handleErrors, userController.login);
usersRouter.post("/signup", userValidator.registerValidator, handleErrors, userController.signup);
usersRouter.put("/verifyAccount", userValidator.verifyAccountValidator, handleErrors, userController.verifyAccount);
usersRouter.post("/forgotPassword", userValidator.forgotPasswordValidator, handleErrors, userController.forgotPassword);
usersRouter.post("/resetPassword", userValidator.resetPasswordValidator, handleErrors, userController.resetPassword);
usersRouter.put("/updatePassword", userValidator.updatePasswordValidator, handleErrors, userController.updatePassword);
usersRouter.put("/updateProfile", userValidator.updateProfileValidator, handleErrors, userController.updateProfile);
usersRouter.put("/resendCode", userValidator.forgotPasswordValidator, handleErrors, userController.resendCode);
usersRouter.put("/firstLogin", userController.updateFirstLogin);

export default usersRouter;
