"use strict";
import express from "express";
import { UserController } from "../controllers";
import { userValidator } from "../middlewares/validator";
import { handleErrors } from "../middlewares";

const usersRouter = express.Router();

usersRouter.get("/getAllUsers", UserController.getAllUsers);
usersRouter.get("/getInfoByToken", UserController.getUserInfo);
usersRouter.put("/updatePassword", userValidator.updatePassword, handleErrors, UserController.updatePassword);
usersRouter.put("/updateProfile", userValidator.updateProfile, handleErrors, UserController.updateProfile);
usersRouter.put("/firstLogin", UserController.firstLogin);

export default usersRouter;
