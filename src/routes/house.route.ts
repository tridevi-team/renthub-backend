"use strict";
import express from "express";
import { HouseController } from "../controllers";
import { houseValidator } from "../middlewares/validator";
import { access, handleErrors } from "../middlewares";

const houseRouter = express.Router();

houseRouter.get("/list", access, HouseController.getHouseList);
houseRouter.post("/create", access, houseValidator.createHouse, handleErrors, HouseController.createHouse);
// houseRouter.put("/update/:id", access, houseValidator.updateHouseDetails, handleErrors, houseController.updateHouseDetails);
// houseRouter.delete("/delete/:id", access, houseValidator.deleteHouse, handleErrors, houseController.deleteHouse);
// houseRouter.put("/updateStatus/:id", access, houseValidator.updateHouseStatus, handleErrors, houseController.updateHouseStatus);
// houseRouter.get("/details/:id", access, houseValidator.houseDetails, handleErrors, houseController.getHouseDetails);
// houseRouter.get("/permissions/:id", access, houseValidator.userPermissions, handleErrors, houseController.getUserHasAccessToHouse);
// houseRouter.get("/permissionsByUser/:id", access, houseValidator.userPermissions, handleErrors, houseController.getPermissionsByToken);
// houseRouter.put("/grantPermissions/:id", access, houseValidator.grantPermissions, handleErrors, houseController.grantPermissions);

export default houseRouter;
