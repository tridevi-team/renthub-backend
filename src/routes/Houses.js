const houseRouter = require("express").Router();
const houseController = require("../controllers/HouseController");
const { createHouse, updateHouseDetails, deleteHouse, updateHouseStatus } = require("../middlewares/validator");

houseRouter.get("/list", houseController.getHouseList);
houseRouter.post("/create", createHouse, houseController.createHouse);
houseRouter.post("/update/:id", updateHouseDetails, houseController.updateHouseDetails);
houseRouter.post("/delete/:id", deleteHouse, houseController.deleteHouse);
houseRouter.post("/updateStatus/:id", updateHouseStatus, houseController.updateHouseStatus);

module.exports = houseRouter;
