const houseRouter = require("express").Router();
const houseController = require("../controllers/HouseController");
const { createHouse, updateHouseDetails, deleteHouse, updateHouseStatus, userPermissions, grantPermissions } = require("../middlewares/validator");

houseRouter.get("/list", houseController.getHouseList);
houseRouter.post("/create", createHouse, houseController.createHouse);
houseRouter.post("/update/:id", updateHouseDetails, houseController.updateHouseDetails);
houseRouter.post("/delete/:id", deleteHouse, houseController.deleteHouse);
houseRouter.post("/updateStatus/:id", updateHouseStatus, houseController.updateHouseStatus);
houseRouter.get("/details/:id", houseController.getHouseDetails);
houseRouter.get("/permissions/:id", userPermissions, houseController.getUserHasAccessToHouse);
houseRouter.post("/grantPermissions/:id", grantPermissions, houseController.grantPermissions);

module.exports = houseRouter;
