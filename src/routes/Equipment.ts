import express from "express";
import { access, handleErrors } from "../middlewares";
import equipmentController from "../controllers/EquipmentController";
import { equipmentValidator } from "../middlewares/validator";

const equipmentRouter = express.Router();

equipmentRouter.get("/list/:houseId", access, equipmentController.getEquipmentListInHouse);
equipmentRouter.get("/list/:houseId/:roomId", access, equipmentController.getEquipmentListInRoom);
equipmentRouter.post("/create/:houseId", access, equipmentValidator.addEquipment, handleErrors, equipmentController.addEquipment);
equipmentRouter.post("/addToRoom/:houseId/:roomId", access, equipmentValidator.addEquipmentToRoom, handleErrors, equipmentController.addEquipmentToRoom);
equipmentRouter.put("/update/:houseId/:equipmentId", access, equipmentValidator.updateEquipment, handleErrors, equipmentController.updateEquipment);
equipmentRouter.delete("/delete/:houseId/:equipmentId", access, equipmentController.deleteEquipment);

export default equipmentRouter;
