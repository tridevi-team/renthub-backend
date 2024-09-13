"use strict";
import express from "express";
import { UserController } from "../controllers";
import { userValidator } from "../middlewares/validator";
import { handleErrors } from "../middlewares";

const usersRouter = express.Router();

usersRouter.get("/getAllUsers", UserController.getAllUsers);
usersRouter.get("/getInfoByToken", UserController.getUserInfo);
usersRouter.post("/login", userValidator.login, handleErrors, UserController.login);
usersRouter.post("/signup", userValidator.register, handleErrors, UserController.signup);
usersRouter.put("/verifyAccount", userValidator.verifyAccount, handleErrors, UserController.verifyAccount);
usersRouter.put("/resendCode", userValidator.email, handleErrors, UserController.resendCode);
usersRouter.post("/forgotPassword", userValidator.email, handleErrors, UserController.forgotPassword);
usersRouter.post("/resetPassword", userValidator.resetPassword, handleErrors, UserController.resetPassword);
usersRouter.put("/updatePassword", userValidator.updatePassword, handleErrors, UserController.updatePassword);
usersRouter.put("/updateProfile", userValidator.updateProfile, handleErrors, UserController.updateProfile);
usersRouter.put("/firstLogin", UserController.firstLogin);

export default usersRouter;
