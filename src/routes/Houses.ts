"use strict";
import express from "express";
import { houseController } from "../controllers";
import { Houses } from "../models";
import { houseValidator } from "../middlewares/validator";

import handleErrors from "../middlewares/handleErrors";

const houseRouter = express.Router();

houseRouter.get("/list", houseController.getHouseList);
houseRouter.post("/create", houseValidator.createHouse, handleErrors, houseController.createHouse);
houseRouter.put("/update/:id", houseValidator.updateHouseDetails, handleErrors, houseController.updateHouseDetails);
houseRouter.delete("/delete/:id", houseValidator.deleteHouse, handleErrors, houseController.deleteHouse);
houseRouter.put("/updateStatus/:id", houseValidator.updateHouseStatus, handleErrors, houseController.updateHouseStatus);
houseRouter.get("/details/:id", houseValidator.houseDetails, handleErrors, houseController.getHouseDetails);
houseRouter.get("/permissions/:id", houseValidator.userPermissions, handleErrors, houseController.getUserHasAccessToHouse);
houseRouter.put("/grantPermissions/:id", houseValidator.grantPermissions, handleErrors, houseController.grantPermissions);

export default Houses;
