"use strict";
import { Houses, HousePermissions } from "../models";
import { HousePermissions as EHousePermissions } from "../enum";

const checkPermissions = async (userId: Number, houseId: Number = -1, permission: String = "") => {
    let housePermission = null;

    if (permission === EHousePermissions.HOUSE_OWNER) {
        housePermission = houseId === -1 ? await Houses.query().findOne({ created_by: userId }) : await Houses.query().findOne({ id: houseId, created_by: userId });
    } else {
        const authorCondition = houseId !== -1 ? { id: houseId, created_by: userId } : { created_by: userId };

        const isAuthor = await Houses.query().findOne(authorCondition);
        if (isAuthor) return true;

        if (permission !== EHousePermissions.HOUSE_DETAILS) {
            housePermission = await HousePermissions.query().joinRelated("permissions").findOne({ house_id: houseId, user_id: userId, "permissions.key": permission });
        } else {
            housePermission = await HousePermissions.query().findOne({ house_id: houseId, user_id: userId });
            console.log("permission", permission, housePermission);
        }
    }

    if (housePermission) return true;
    return false;
};

export default checkPermissions;
