"use strict";
const serviceRouter = require("express").Router();
const { serviceController } = require("../controllers");
const { createService, getServiceByHouse, getServiceDetails, updateService, deleteService } = require("../middlewares/validator");

serviceRouter.get("/list/:houseId", getServiceByHouse, serviceController.getServiceByHouse);
serviceRouter.get("/serviceDetails/:houseId/:serviceId", getServiceDetails, serviceController.getServiceDetails);
serviceRouter.post("/create", createService, serviceController.create);
serviceRouter.get("/details/:serviceId", getServiceDetails, serviceController.getServiceDetails);
serviceRouter.post("/update/:serviceId", updateService, serviceController.update);
serviceRouter.post("/delete/:serviceId", deleteService, serviceController.delete);

module.exports = serviceRouter;
