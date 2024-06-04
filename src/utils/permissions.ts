"use strict";
import { Houses, HousePermissions } from "../models";
import { housePermissions } from "../enum/Houses";

const checkHousePermissions = async (userId, houseId, permission = "") => {
    let housePermission;

    if (permission !== housePermissions.HOUSE_DETAILS) {
        housePermission = await HousePermissions.query().joinRelated("permissions").findOne({ house_id: houseId, user_id: userId, "permissions.name": permission });
    } else if (!permission.includes("READ")) {
        const getTypeName = permission.split("_")[1];
        housePermission = await HousePermissions.query().joinRelated("permissions").whereLike("permissions.name", `%${getTypeName}%`).findOne({ house_id: houseId, user_id: userId });
    } else {
        housePermission = await HousePermissions.query().findOne({ house_id: houseId, user_id: userId });
    }

    const isAuthor = await Houses.query().findOne({ id: houseId, created_by: userId });
    if (!housePermission && !isAuthor) {
        return false;
    }
    return true;
};

export default checkHousePermissions;
