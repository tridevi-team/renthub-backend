"use strict";
import { Houses, HousePermissions } from "../models";
import { housePermissions } from "../enum/Houses";

const checkPermissions = async (userId: Number, houseId: Number, permission: String = "") => {
    let housePermission = null;
    if (permission === housePermissions.HOUSE_OWNER) {
        return await Houses.query().findOne({ house_id: houseId, user_id: userId });
    } else if (permission !== housePermissions.HOUSE_DETAILS) {
        housePermission = await HousePermissions.query().joinRelated("permissions").findOne({ house_id: houseId, user_id: userId, "permissions.name": permission });
    } else {
        housePermission = await HousePermissions.query().findOne({ house_id: houseId, user_id: userId });
    }
    const isAuthor = await Houses.query().findOne({ id: houseId, created_by: userId });
    return !!housePermission || !!isAuthor;
};

export default checkPermissions;
