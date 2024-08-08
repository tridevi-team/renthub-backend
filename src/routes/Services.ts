"use strict";
import express from "express";
import { serviceController } from "../controllers";
import { serviceValidator } from "../middlewares/validator";
import { handleErrors, access } from "../middlewares";

const serviceRouter = express.Router();

serviceRouter.get("/list/:houseId", access, serviceValidator.getServiceByHouse, handleErrors, serviceController.getServiceByHouse);
serviceRouter.get("/details/:houseId/:serviceId", access, serviceValidator.getServiceDetails, handleErrors, serviceController.getServiceDetails);
serviceRouter.post("/create/:houseId", access, serviceValidator.createService, handleErrors, serviceController.create);
serviceRouter.post("/create/:houseId/:roomId", access, serviceValidator.createRoomService, handleErrors, serviceController.createRoomService);
serviceRouter.put("/update/:houseId/:serviceId", access, serviceValidator.updateService, handleErrors, serviceController.update);
serviceRouter.delete("/delete/:houseId/:serviceId", access, serviceValidator.deleteService, handleErrors, serviceController.delete);
serviceRouter.delete("/deleteRoomService/:houseId/:roomId", access, serviceValidator.deleteRoomService, handleErrors, serviceController.deleteRoomService);

export default serviceRouter;
