import { check } from "express-validator";
import { CRUDPermissionType, PermissionType } from "../../interfaces";

const createRoleValidator = [
    check("name").isString().withMessage("name must be a string"),
    check("permissions")
        .isObject()
        .withMessage("permissions must be an object")
        .custom((value: object) => {
            const keys: PermissionType[] = [
                "house",
                "role",
                "room",
                "renter",
                "service",
                "bill",
                "equipment",
                "payment",
                "notification",
                "issue",
                "contract",
            ];
            const permissions = Object.keys(value);

            // throw key missing error
            for (const key of keys) {
                if (!permissions.includes(key)) {
                    throw new Error(`permissions must contain ${key}`);
                }
            }

            // check CRUD
            const crud: CRUDPermissionType[] = ["create", "read", "update", "delete"];
            for (const key of permissions) {
                const permission = Object.keys(value[key]);
                const isValid = crud.every((c) => permission.includes(c));
                if (!isValid) {
                    throw new Error(`permissions.${key} must contain create, read, update, delete`);
                }
            }
            return true;
        }),
    check("description").optional().isString().withMessage("description must be a string"),
    check("status").isBoolean().withMessage("status must be a boolean"),
];

const updateRoleValidator = [
    check("name").isString().withMessage("name must be a string"),
    check("permissions")
        .isObject()
        .withMessage("permissions must be an object")
        .custom((value: object) => {
            const keys = ["house", "role", "room", "renter", "service", "bill", "equipment"];
            const permissions = Object.keys(value);
            const isValid = keys.every((key) => permissions.includes(key));
            if (!isValid) {
                throw new Error("permissions must contain house, role, room, service, bill, equipment");
            }
            // check CRUD
            const crud = ["create", "read", "update", "delete"];
            for (const key of permissions) {
                const permission = Object.keys(value[key]);
                const isValid = crud.every((c) => permission.includes(c));
                if (!isValid) {
                    throw new Error(`permissions.${key} must contain create, read, update, delete`);
                }
            }
            return true;
        }),
    check("description").optional().isString().withMessage("Description must be a string"),
    check("status").isBoolean().withMessage("status must be a boolean"),
];

const updateStatusValidator = [
    check("roleId").isUUID().withMessage("roleId is not in the correct format"),
    check("status").isBoolean().withMessage("status must be a boolean"),
];

const roleIdValidator = [check("roleId").isUUID().withMessage("roleId is not in the correct format")];

const assignRoleValidator = [
    check("houseId").isUUID().withMessage("houseId is not in the correct format"),
    check("userId").isUUID().withMessage("userId is not in the correct format"),
    check("roleId").optional().isUUID().withMessage("roleId is not in the correct format"),
];

const roleValidator = {
    createRoleValidator,
    updateRoleValidator,
    updateStatusValidator,
    roleIdValidator,
    assignRoleValidator,
};

export default roleValidator;
