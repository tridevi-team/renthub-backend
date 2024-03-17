"use strict";
const usersRouter = require("express").Router();
const { userController } = require("../controllers");
const {
    registerValidator,
    loginValidator,
    verifyAccountValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    updatePasswordValidator,
    updateProfileValidator,
} = require("../middlewares/validator");

usersRouter.get("/getAllUsers", userController.getAllUsers);
usersRouter.get("/getInfoByToken", userController.getInfoByToken);
usersRouter.post("/login", loginValidator, userController.login);
usersRouter.post("/signup", registerValidator, userController.signup);
usersRouter.post("/verifyAccount", verifyAccountValidator, userController.verifyAccount);
usersRouter.post("/forgotPassword", forgotPasswordValidator, userController.forgotPassword);
usersRouter.post("/resetPassword", resetPasswordValidator, userController.resetPassword);
usersRouter.post("/updatePassword", updatePasswordValidator, userController.updatePassword);
usersRouter.post("/updateProfile", updateProfileValidator, userController.updateProfile);

module.exports = usersRouter;
