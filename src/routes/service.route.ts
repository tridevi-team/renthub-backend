"use strict";
import express from "express";
import { ServiceController } from "../controllers";
import { authentication, handleErrors } from "../middlewares";
import { houseValidator, roomsValidator, serviceValidator } from "../middlewares/validator";

const serviceRouter = express.Router();

serviceRouter.get(
    "/:houseId/search",
    authentication,
    houseValidator.houseIdValidator,
    handleErrors,
    ServiceController.getServicesByHouse
);
serviceRouter.get(
    "/:serviceId/details",
    authentication,
    serviceValidator.serviceIdValidator,
    handleErrors,
    ServiceController.getServiceDetails
);
serviceRouter.post(
    "/:houseId/create",
    authentication,
    serviceValidator.createService,
    handleErrors,
    ServiceController.createServiceForHouse
);
serviceRouter.put(
    "/:serviceId/update",
    authentication,
    serviceValidator.serviceIdValidator,
    serviceValidator.updateService,
    handleErrors,
    ServiceController.updateService
);
serviceRouter.delete(
    "/:serviceId/delete",
    authentication,
    serviceValidator.serviceIdValidator,
    handleErrors,
    ServiceController.deleteService
);
serviceRouter.post(
    "/:roomId/add",
    authentication,
    roomsValidator.roomId,
    handleErrors,
    ServiceController.addServiceToRoom
);
serviceRouter.delete(
    "/:roomId/deleteRoomService",
    authentication,
    roomsValidator.roomId,
    handleErrors,
    ServiceController.removeServiceFromRoom
);

export default serviceRouter;
