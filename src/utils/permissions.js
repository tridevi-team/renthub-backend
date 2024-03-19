// check permissions
const { Houses, HousePermissions } = require("../models");
const { housePermissions } = require("../enum/Houses");

const checkHousePermissions = async (userId, houseId, permission = "") => {
    let housePermission;

    if (permission !== housePermissions.HOUSE_DETAILS) {
        housePermission = await HousePermissions.query().joinRelated("permissions").findOne({ house_id: houseId, user_id: userId, "permissions.name": permission });
    } else {
        housePermission = await HousePermissions.query().findOne({ house_id: houseId, user_id: userId });
    }

    const isAuthor = await Houses.query().findOne({ id: houseId, created_by: userId });
    if (!housePermission && !isAuthor) {
        return false;
    }
    return true;
};

module.exports = checkHousePermissions;
