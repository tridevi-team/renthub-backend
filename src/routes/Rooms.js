const roomRouter = require("express").Router();
const { roomController } = require("../controllers");
const { createRooms, deleteRoom, updateRoom, getRoomList, roomDetails } = require("../middlewares/validator");
const handleErrors = require("../middlewares/handleErrors");

roomRouter.get("/list/:houseId", getRoomList, handleErrors, roomController.getRoomList);
roomRouter.post("/create/:houseId", createRooms, handleErrors, roomController.createRoom);
roomRouter.post("/update/:houseId/:roomId", updateRoom, handleErrors, roomController.updateRoom);
roomRouter.post("/delete/:houseId/:roomId", deleteRoom, handleErrors, roomController.deleteRoom);
roomRouter.get("/details/:houseId/:roomId", roomDetails, handleErrors, roomController.getRoomDetails);

module.exports = roomRouter;
