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
const handleErrors = require("../middlewares/handleErrors");

usersRouter.get("/getAllUsers", userController.getAllUsers);
usersRouter.get("/getInfoByToken", userController.getInfoByToken);
usersRouter.post("/login", loginValidator, handleErrors, userController.login);
usersRouter.post("/signup", registerValidator, handleErrors, userController.signup);
usersRouter.post("/verifyAccount", verifyAccountValidator, handleErrors, userController.verifyAccount);
usersRouter.post("/forgotPassword", forgotPasswordValidator, handleErrors, userController.forgotPassword);
usersRouter.post("/resetPassword", resetPasswordValidator, handleErrors, userController.resetPassword);
usersRouter.post("/updatePassword", updatePasswordValidator, handleErrors, userController.updatePassword);
usersRouter.post("/updateProfile", updateProfileValidator, handleErrors, userController.updateProfile);
usersRouter.post("/resendCode", forgotPasswordValidator, handleErrors, userController.resendCode);

module.exports = usersRouter;
