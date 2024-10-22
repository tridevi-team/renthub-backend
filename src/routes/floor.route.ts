import express from "express";
import { FloorController } from "../controllers";
import { Action, Module } from "../enums";
import { authentication, authorize, handleErrors } from "../middlewares";
import { houseValidator } from "../middlewares/validator";
import floorValidator from "../middlewares/validator/floor.validator";

const floorRouter = express.Router();

floorRouter.post(
    "/:houseId/create",
    authentication,
    authorize(Module.FLOOR, Action.CREATE),
    houseValidator.houseIdValidator,
    floorValidator.createFloor,
    handleErrors,
    FloorController.createFloor
);

floorRouter.get(
    "/:houseId/list",
    authentication,
    houseValidator.houseIdValidator,
    handleErrors,
    FloorController.getFloorsByHouse
);

floorRouter.get(
    "/:floorId/details",
    authentication,
    houseValidator.houseIdValidator,
    floorValidator.floorIdValidator,
    handleErrors,
    FloorController.getFloorDetails
);

floorRouter.put(
    "/:floorId/update",
    authentication,
    houseValidator.houseIdValidator,
    floorValidator.floorIdValidator,
    floorValidator.updateFloor,
    handleErrors,
    FloorController.updateFloor
);

floorRouter.delete(
    "/:floorId/delete",
    authentication,
    houseValidator.houseIdValidator,
    floorValidator.floorIdValidator,
    handleErrors,
    FloorController.deleteFloor
);

export default floorRouter;
