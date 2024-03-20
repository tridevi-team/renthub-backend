"use strict";
const serviceRouter = require("express").Router();
const { serviceController } = require("../controllers");
const { createService, getServiceByHouse, getServiceDetails, updateService, deleteService } = require("../middlewares/validator");

serviceRouter.get("/list/:houseId", getServiceByHouse, serviceController.getServiceByHouse);
serviceRouter.get("/details/:houseId/:serviceId", getServiceDetails, serviceController.getServiceDetails);
serviceRouter.post("/create/:houseId", createService, serviceController.create);
serviceRouter.post("/update/:houseId/:serviceId", updateService, serviceController.update);
serviceRouter.post("/delete/:houseId/:serviceId", deleteService, serviceController.delete);

module.exports = serviceRouter;
