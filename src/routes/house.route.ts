"use strict";
import express from "express";
import { HouseController } from "../controllers";
import { Action, Module } from "../enums";
import { authentication, authorize, handleErrors } from "../middlewares";
import { houseValidator } from "../middlewares/validator";

const houseRouter = express.Router();

houseRouter.post("/create", authentication, houseValidator.createHouse, handleErrors, HouseController.createHouse);

houseRouter.get("/list", authentication, HouseController.getHouseList);

houseRouter.get("/:houseId/details", houseValidator.houseIdValidator, handleErrors, HouseController.getHouseDetails);

houseRouter.get(
    "/:houseId/rooms",
    (req, res, next) => {
        if (req.isApp) next();
        else authentication(req, res, next);
    },
    houseValidator.houseIdValidator,
    handleErrors,
    HouseController.getHouseWithRooms
);

houseRouter.put(
    "/:houseId/update",
    authentication,
    authorize(Module.HOUSE, Action.UPDATE),
    houseValidator.updateHouseDetails,
    handleErrors,
    HouseController.updateHouseDetails
);

houseRouter.patch(
    "/:houseId/update-status",
    authentication,
    authorize(Module.HOUSE, Action.UPDATE),
    houseValidator.updateHouseStatus,
    handleErrors,
    HouseController.updateHouseStatus
);

// houseRouter.delete(
//     "/:houseId/delete",
//     authentication,
//     authorize(Module.HOUSE, Action.DELETE),
//     HouseController.deleteHouse
// );

// api for renter
houseRouter.get("/search", HouseController.searchHouse);

export default houseRouter;
