"use strict";
import express from "express";
import { RoomController } from "../controllers";
import { authentication, handleErrors } from "../middlewares";
import { houseValidator, roomsValidator } from "../middlewares/validator";

const roomRouter = express.Router();

roomRouter.post("/:houseId/create", authentication, houseValidator.houseIdValidator, roomsValidator.createRoom, handleErrors, RoomController.createRoom);
roomRouter.get("/:houseId/list", authentication, houseValidator.houseIdValidator, handleErrors, RoomController.getRoomsByHouse);
roomRouter.get("/:roomId/details", authentication, roomsValidator.roomId, handleErrors, RoomController.getRoomDetails);
roomRouter.put("/:roomId/update", authentication, roomsValidator.updateRoom, handleErrors, RoomController.updateRoom);
roomRouter.delete("/:roomId/delete", authentication, roomsValidator.roomId, handleErrors, RoomController.deleteRoom);

export default roomRouter;
