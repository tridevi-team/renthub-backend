const roomRouter = require("express").Router();
const { roomController } = require("../controllers");
const { createRooms, deleteRoom, updateRoom, getRoomList, roomDetails } = require("../middlewares/validator");
const handleErrors = require("../middlewares/handleErrors");

roomRouter.get("/list/:houseId", getRoomList, roomController.getRoomList);
roomRouter.get("/details/:houseId/:roomId", roomDetails, roomController.roomDetails);
roomRouter.post("/create/:houseId", createRooms, roomController.create);
roomRouter.put("/update/:houseId/:roomId", updateRoom, roomController.update);
roomRouter.delete("/delete/:houseId/:roomId", deleteRoom, roomController.delete);

module.exports = roomRouter;
