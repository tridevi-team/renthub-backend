import express from "express";
import EquipmentController from "../controllers/equipment.controller";
import { Action, Module } from "../enums";
import { authentication, authorize, handleErrors } from "../middlewares";
import { equipmentValidator } from "../middlewares/validator";

const equipmentRouter = express.Router();

equipmentRouter.get(
    "/:houseId/search",
    // authentication,
    // authorize(Module.EQUIPMENT, Action.READ),
    EquipmentController.searchEquipment
);

equipmentRouter.get(
    "/:equipmentId/details",
    authentication,
    authorize(Module.EQUIPMENT, Action.READ),
    equipmentValidator.equipmentId,
    handleErrors,
    EquipmentController.getEquipmentDetails
);

equipmentRouter.post(
    "/:houseId/add",
    authentication,
    authorize(Module.EQUIPMENT, Action.CREATE),
    equipmentValidator.parentId,
    handleErrors,
    equipmentValidator.equipmentRequest,
    handleErrors,
    EquipmentController.addEquipment
);

equipmentRouter.put(
    "/:equipmentId/update",
    authentication,
    authorize(Module.EQUIPMENT, Action.UPDATE),
    equipmentValidator.equipmentId,
    handleErrors,
    equipmentValidator.parentId,
    handleErrors,
    equipmentValidator.equipmentRequest,
    handleErrors,
    EquipmentController.updateEquipment
);

equipmentRouter.patch(
    "/:equipmentId/update-status",
    authentication,
    authorize(Module.EQUIPMENT, Action.UPDATE),
    equipmentValidator.equipmentId,
    handleErrors,
    equipmentValidator.equipmentStatus,
    handleErrors,
    EquipmentController.updateEquipmentStatus
);

equipmentRouter.delete(
    "/:equipmentId/delete",
    authentication,
    authorize(Module.EQUIPMENT, Action.DELETE),
    equipmentValidator.equipmentId,
    handleErrors,
    EquipmentController.deleteEquipment
);

export default equipmentRouter;
