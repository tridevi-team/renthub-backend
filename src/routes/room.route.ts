"use strict";
import express from "express";
import { RoomController } from "../controllers";
import { Action, Module } from "../enums";
import { authentication, authorize, handleErrors } from "../middlewares";
import { houseValidator, roomsValidator } from "../middlewares/validator";

const roomRouter = express.Router();

roomRouter.post(
    "/:houseId/create",
    authentication,
    authorize(Module.ROOM, Action.CREATE),
    houseValidator.houseIdValidator,
    roomsValidator.createRoom,
    handleErrors,
    RoomController.createRoom
);
// roomRouter.get(
//     "/:houseId/list",
//     authentication,
//     houseValidator.houseIdValidator,
//     handleErrors,
//     RoomController.getRoomsByHouse
// );
roomRouter.get("/:roomId/details", roomsValidator.roomId, handleErrors, RoomController.getRoomDetails);

roomRouter.put(
    "/:roomId/update",
    authentication,
    authorize(Module.ROOM, Action.UPDATE),
    roomsValidator.updateRoom,
    handleErrors,
    RoomController.updateRoom
);
roomRouter.delete(
    "/:roomId/delete",
    authentication,
    authorize(Module.ROOM, Action.DELETE),
    roomsValidator.roomId,
    handleErrors,
    RoomController.deleteRoom
);

export default roomRouter;
