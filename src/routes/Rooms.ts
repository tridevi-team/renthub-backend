"use strict";
import express from "express";
import { roomController } from "../controllers";
import { roomsValidator } from "../middlewares/validator";
import { handleErrors } from "../middlewares";

const roomRouter = express.Router();

roomRouter.get("/list/:houseId", roomsValidator.getRoomList, handleErrors, roomController.getRoomList);
roomRouter.get("/details/:houseId/:roomId", roomsValidator.roomDetails, handleErrors, roomController.getRoomDetails);
roomRouter.post("/create/:houseId", roomsValidator.createRooms, handleErrors, roomController.createRoom);
roomRouter.put("/update/:houseId/:roomId", roomsValidator.updateRoom, handleErrors, roomController.updateRoom);
roomRouter.delete("/delete/:houseId/:roomId", roomsValidator.deleteRoom, handleErrors, roomController.deleteRoom);

export default roomRouter;
