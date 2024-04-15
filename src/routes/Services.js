"use strict";
const serviceRouter = require("express").Router();
const { serviceController } = require("../controllers");
const { createService, getServiceByHouse, getServiceDetails, updateService, deleteService } = require("../middlewares/validator");
const handleErrors = require("../middlewares/handleErrors");

serviceRouter.get("/list/:houseId", getServiceByHouse, handleErrors, serviceController.getServiceByHouse);
serviceRouter.get("/details/:houseId/:serviceId", getServiceDetails, handleErrors, serviceController.getServiceDetails);
serviceRouter.post("/create/:houseId", createService, handleErrors, serviceController.create);
serviceRouter.put("/update/:houseId/:serviceId", updateService, handleErrors, serviceController.update);
serviceRouter.delete("/delete/:houseId/:serviceId", deleteService, handleErrors, serviceController.delete);

module.exports = serviceRouter;
