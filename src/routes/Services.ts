"use strict";
import express from "express";
import { serviceController } from "../controllers";
import { serviceValidator } from "../middlewares/validator";
import handleErrors from "../middlewares/handleErrors";

const serviceRouter = express.Router();

serviceRouter.get("/list/:houseId", serviceValidator.getServiceByHouse, handleErrors, serviceController.getServiceByHouse);
serviceRouter.get("/details/:houseId/:serviceId", serviceValidator.getServiceDetails, handleErrors, serviceController.getServiceDetails);
serviceRouter.post("/create/:houseId", serviceValidator.createService, handleErrors, serviceController.create);
serviceRouter.put("/update/:houseId/:serviceId", serviceValidator.updateService, handleErrors, serviceController.update);
serviceRouter.delete("/delete/:houseId/:serviceId", serviceValidator.deleteService, handleErrors, serviceController.delete);

export default serviceRouter;
