const roomRouter = require("express").Router();
const { roomController } = require("../controllers");
const { createRooms, deleteRoom, updateRoom, getRoomList } = require("../middlewares/validator");

roomRouter.get("/list/:houseId", getRoomList, roomController.getRoomList);
roomRouter.post("/create/:houseId", createRooms, roomController.createRoom);
roomRouter.post("/update/:houseId/:roomId", updateRoom, roomController.updateRoom);
roomRouter.post("/delete/:houseId/:roomId", deleteRoom, roomController.deleteRoom);
roomRouter.get("/details/:houseId/:roomId", roomController.getRoomDetails);

module.exports = roomRouter;
