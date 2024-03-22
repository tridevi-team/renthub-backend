"use strict";
const houseRouter = require("express").Router();
const { houseController } = require("../controllers");
const { createHouse, updateHouseDetails, deleteHouse, updateHouseStatus, userPermissions, grantPermissions, houseDetails } = require("../middlewares/validator");
const handleErrors = require("../middlewares/handleErrors");

houseRouter.get("/list", houseController.getHouseList);
houseRouter.post("/create", createHouse, handleErrors, houseController.createHouse);
houseRouter.post("/update/:id", updateHouseDetails, handleErrors, houseController.updateHouseDetails);
houseRouter.post("/delete/:id", deleteHouse, handleErrors, houseController.deleteHouse);
houseRouter.post("/updateStatus/:id", updateHouseStatus, handleErrors, houseController.updateHouseStatus);
houseRouter.get("/details/:id", houseDetails, handleErrors, houseController.getHouseDetails);
houseRouter.get("/permissions/:id", userPermissions, handleErrors, houseController.getUserHasAccessToHouse);
houseRouter.post("/grantPermissions/:id", grantPermissions, handleErrors, houseController.grantPermissions);

module.exports = houseRouter;
