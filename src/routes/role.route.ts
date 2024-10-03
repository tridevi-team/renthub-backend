import express from "express";
import RoleController from "../controllers/role.controller";
import { Action, Module } from "../enums";
import { authentication, authorize, handleErrors } from "../middlewares";
import { houseValidator, roleValidator } from "../middlewares/validator";

const roleRoute = express.Router();

roleRoute.post(
    "/:houseId/create/role",
    authentication,
    authorize(Module.ROLE, Action.CREATE),
    roleValidator.createRoleValidator,
    handleErrors,
    RoleController.createRole
);
roleRoute.get(
    "/:houseId/list",
    authentication,
    authorize(Module.ROLE, Action.READ),
    houseValidator.houseIdValidator,
    handleErrors,
    RoleController.getRolesListByHouse
);
roleRoute.get(
    "/:roleId/details",
    authentication,
    authorize(Module.ROLE, Action.READ),
    roleValidator.roleIdValidator,
    handleErrors,
    RoleController.getRoleDetails
);
roleRoute.put(
    "/:roleId/update",
    authentication,
    authorize(Module.ROLE, Action.UPDATE),
    roleValidator.updateRoleValidator,
    handleErrors,
    RoleController.updateRole
);
roleRoute.patch(
    "/:roleId/update-status",
    authentication,
    authorize(Module.ROLE, Action.UPDATE),
    roleValidator.updateStatusValidator,
    handleErrors,
    RoleController.updateStatus
);
roleRoute.post(
    "/:houseId/assign-role",
    authentication,
    authorize(Module.ROLE, Action.UPDATE),
    roleValidator.assignRoleValidator,
    handleErrors,
    RoleController.assignRole
);
roleRoute.delete(
    "/:roleId/delete",
    authentication,
    authorize(Module.ROLE, Action.DELETE),
    roleValidator.roleIdValidator,
    handleErrors,
    RoleController.deleteRole
);

export default roleRoute;
