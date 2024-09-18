"use strict";
import express from "express";
import { HouseController } from "../controllers";
import { access, handleErrors } from "../middlewares";
import { houseValidator } from "../middlewares/validator";

const houseRouter = express.Router();

houseRouter.post("/create", access, houseValidator.createHouse, handleErrors, HouseController.createHouse);

houseRouter.get("/list", access, HouseController.getHouseList);
houseRouter.get("/details/:id", access, houseValidator.houseDetails, handleErrors, HouseController.getHouseDetails);
houseRouter.put("/update/:id", access, houseValidator.updateHouseDetails, handleErrors, HouseController.updateHouseDetails);
houseRouter.put("/updateStatus/:id", access, houseValidator.updateHouseStatus, handleErrors, HouseController.updateHouseStatus);
houseRouter.delete("/delete/:id", access, houseValidator.deleteHouse, handleErrors, HouseController.deleteHouse);

export default houseRouter;
