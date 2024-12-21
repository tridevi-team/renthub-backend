"use strict";
import express from "express";
import { UserController } from "../controllers";
import { authentication, handleErrors } from "../middlewares";
import { userValidator } from "../middlewares/validator";

const usersRouter = express.Router();

usersRouter.get("/get-all-users", authentication, UserController.getAllUsers);

usersRouter.get("/search", authentication, UserController.search);

usersRouter.get("/get-users-by-house/:houseId", UserController.getUserByHouseId);

usersRouter.get("/get-info", UserController.getUserInfo);

usersRouter.patch("/change-password", userValidator.updatePassword, handleErrors, UserController.updatePassword);

usersRouter.put("/update-info", userValidator.updateProfile, handleErrors, UserController.updateProfile);

usersRouter.patch("/first-login", UserController.firstLogin);

export default usersRouter;
