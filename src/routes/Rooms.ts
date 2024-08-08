"use strict";
import express from "express";
import { roomController } from "../controllers";
import { roomsValidator } from "../middlewares/validator";
import { access, handleErrors } from "../middlewares";

const roomRouter = express.Router();

roomRouter.get("/list/:houseId", access, roomsValidator.getRoomList, handleErrors, roomController.getRoomList);
roomRouter.get("/details/:houseId/:roomId", access, roomsValidator.roomDetails, handleErrors, roomController.getRoomDetails);
roomRouter.post("/create/:houseId", access, roomsValidator.createRooms, handleErrors, roomController.createRoom);
roomRouter.put("/update/:houseId/:roomId", access, roomsValidator.updateRoom, handleErrors, roomController.updateRoom);
roomRouter.delete("/delete/:houseId/:roomId", access, roomsValidator.deleteRoom, handleErrors, roomController.deleteRoom);

export default roomRouter;
