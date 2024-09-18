import express from "express";
import RoleController from "../controllers/role.controller";

const roleRoute = express.Router();

roleRoute.post("/:houseId/create/role", RoleController.createRole);
roleRoute.get("/:houseId/list", RoleController.getRolesListByHouse);
roleRoute.get(":roleId", RoleController.getRoleDetails);
roleRoute.put("/update/:roleId", RoleController.updateRole);
roleRoute.put("/update-status/:roleId", RoleController.updateStatus);
roleRoute.post("/:houseId/assign-role", RoleController.assignRole);
roleRoute.delete("/delete/:roleId");

export default roleRoute;
