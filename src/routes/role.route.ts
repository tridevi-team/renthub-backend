import express from "express";
import RoleController from "../controllers/role.controller";
import { handleErrors } from "../middlewares";
import { houseValidator, roleValidator } from "../middlewares/validator";

const roleRoute = express.Router();

roleRoute.post("/:houseId/create/role", roleValidator.createRoleValidator, handleErrors, RoleController.createRole);
roleRoute.get("/:houseId/list", houseValidator.houseIdValidator, handleErrors, RoleController.getRolesListByHouse);
roleRoute.get(":roleId", roleValidator.roleIdValidator, handleErrors, RoleController.getRoleDetails);
roleRoute.put("/update/:roleId", roleValidator.updateRoleValidator, handleErrors, RoleController.updateRole);
roleRoute.put("/update-status/:roleId", roleValidator.updateStatusValidator, handleErrors, RoleController.updateStatus);
roleRoute.post("/:houseId/assign-role", roleValidator.assignRoleValidator, handleErrors, RoleController.assignRole);
roleRoute.post("/:houseId/assign-role", houseValidator.houseIdValidator, handleErrors, RoleController.assignRole);
roleRoute.delete("/delete/:roleId", roleValidator.roleIdValidator, handleErrors, RoleController.deleteRole);

export default roleRoute;
