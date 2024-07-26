import { housePermissions } from "../enum/Houses";
import { ApiException, checkPermissions, Exception } from "../utils";

const houseAccess = async (req, res, next) => {
    try {
        const url = req.originalUrl;
        // Early return for non-house URLs
        if (!url.includes("houses")) return next();

        const { id } = req.params;
        const user = req.user;

        // Determine permission based on URL
        let permission = housePermissions.HOUSE_OWNER; // Default permission
        if (url.includes("create")) return next(); // No permission check needed
        else if (url.includes("details") || url.includes("list")) permission = housePermissions.HOUSE_DETAILS;
        else if (url.includes("update")) permission = housePermissions.UPDATE_HOUSE;
        else if (url.includes("delete")) permission = housePermissions.DELETE_HOUSE;

        const isAccess = await checkPermissions(user.id, id, permission);

        // Properly handle access denial
        if (!isAccess) return next(new ApiException(500, "You don't have this permission."));

        next();
    } catch (err) {
        Exception.handle(err, req, res);
    }
};

export default houseAccess;
