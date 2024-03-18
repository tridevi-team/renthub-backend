// check permissions
const { Houses, HousePermissions } = require("../models");

const checkHousePermissions = async (userId, houseId, permission) => {
    const housePermission = await HousePermissions.query().joinRelated("permissions").findOne({ house_id: houseId, user_id: userId, "permissions.name": permission });
    const isAuthor = await Houses.query().findOne({ id: houseId, created_by: userId });
    if (!housePermission && !isAuthor) {
        return false;
    }
    return true;
};

module.exports = checkHousePermissions;
