"use strict";
import express from "express";
import { HouseController } from "../controllers";
import { Action, Module } from "../enums";
import { authorize, handleErrors } from "../middlewares";
import { houseValidator } from "../middlewares/validator";

const houseRouter = express.Router();

houseRouter.post("/create", houseValidator.createHouse, handleErrors, HouseController.createHouse);
houseRouter.get("/list", HouseController.getHouseList);
houseRouter.get("/:houseId/details", authorize(Module.HOUSE, Action.READ), houseValidator.houseIdValidator, handleErrors, HouseController.getHouseDetails);
houseRouter.put("/:houseId/update", authorize(Module.HOUSE, Action.UPDATE), houseValidator.updateHouseDetails, handleErrors, HouseController.updateHouseDetails);
houseRouter.put("/:houseId/updateStatus", authorize(Module.HOUSE, Action.UPDATE), houseValidator.updateHouseStatus, handleErrors, HouseController.updateHouseStatus);
houseRouter.delete("/:houseId/delete", authorize(Module.HOUSE, Action.DELETE), houseValidator.deleteHouse, handleErrors, HouseController.deleteHouse);

export default houseRouter;
