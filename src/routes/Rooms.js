const roomRouter = require("express").Router();
const { roomController } = require("../controllers");
const { createRooms, deleteRoom, updateRoom, getRoomList, roomDetails } = require("../middlewares/validator");
const handleErrors = require("../middlewares/handleErrors");

roomRouter.get("/list/:houseId", getRoomList, handleErrors, roomController.getRoomList);
roomRouter.get("/details/:houseId/:roomId", roomDetails, handleErrors, roomController.getRoomDetails);
roomRouter.post("/create/:houseId", createRooms, handleErrors, roomController.createRoom);
roomRouter.put("/update/:houseId/:roomId", updateRoom, handleErrors, roomController.updateRoom);
roomRouter.delete("/delete/:houseId/:roomId", deleteRoom, handleErrors, roomController.deleteRoom);

module.exports = roomRouter;
