"use strict";
import { Houses, HousePermissions } from "../models";
import { HousePermissions as EHousePermissions } from "../enum";

const checkPermissions = async (userId: Number, houseId: Number = -1, permission: String = "") => {
    let housePermission = null;

    if (permission === EHousePermissions.HOUSE_OWNER) {
        if (houseId === -1) {
            housePermission = await Houses.query().where({ created_by: userId });
            return !!housePermission;
        }
        housePermission = await HousePermissions.query().findOne({ id: houseId, user_id: userId });
        return !!housePermission;
    } else if (permission !== EHousePermissions.HOUSE_DETAILS) {
        housePermission = await HousePermissions.query().joinRelated("permissions").findOne({ house_id: houseId, user_id: userId, "permissions.key": permission });
    } else {
        housePermission = await HousePermissions.query().findOne({ house_id: houseId, user_id: userId });
        console.log("permission", permission, housePermission);
    }

    let isAuthor = null;
    if (houseId !== -1) {
        isAuthor = await Houses.query().findOne({ id: houseId, created_by: userId });
    } else {
        isAuthor = await Houses.query().findOne({ created_by: userId });
    }

    return !!housePermission || !!isAuthor;
};

export default checkPermissions;
