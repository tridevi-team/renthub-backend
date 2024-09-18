import express from "express";
import { access, handleErrors } from "../middlewares";
import equipmentController from "../controllers/equipment.controller";
import { equipmentValidator } from "../middlewares/validator";

const equipmentRouter = express.Router();

// equipmentRouter.get("/list/:houseId", access, equipmentController.getEquipmentListInHouse);
// equipmentRouter.get("/list/:houseId/:roomId", access, equipmentController.getEquipmentListInRoom);
// equipmentRouter.post("/create/:houseId", access, equipmentValidator.addEquipment, handleErrors, equipmentController.addEquipment);
// equipmentRouter.post("/addToRoom/:roomId", access, equipmentValidator.addEquipmentToRoom, handleErrors, equipmentController.addEquipmentToRoom);
// equipmentRouter.put("/update/:equipmentId", access, equipmentValidator.updateEquipment, handleErrors, equipmentController.updateEquipment);
// equipmentRouter.delete("/delete/:equipmentId", access, equipmentController.deleteEquipment);

export default equipmentRouter;
