"use strict";
import express from "express";
import { UserController } from "../controllers";
import { handleErrors } from "../middlewares";
import { userValidator } from "../middlewares/validator";

const usersRouter = express.Router();

usersRouter.get("/get-all-users", UserController.getAllUsers);
usersRouter.get("/get-info", UserController.getUserInfo);
usersRouter.put("/update-password", userValidator.updatePassword, handleErrors, UserController.updatePassword);
usersRouter.put("/update-info", userValidator.updateProfile, handleErrors, UserController.updateProfile);
usersRouter.patch("/first-login", UserController.firstLogin);

export default usersRouter;
