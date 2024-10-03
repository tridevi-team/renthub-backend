import express from "express";
import RenterController from "../controllers/renter.controller";
import { Action, Module } from "../enums";
import { authentication, authorize, handleErrors } from "../middlewares";
import { houseValidator, renterValidator, roomsValidator } from "../middlewares/validator";

const renterRouter = express.Router();

renterRouter.post("/login", renterValidator.login, handleErrors, RenterController.login);
renterRouter.post("/verify", renterValidator.verify, handleErrors, RenterController.verifyLogin);
renterRouter.post("/resend", renterValidator.login, handleErrors, RenterController.resendCode);
renterRouter.post(
    "/:roomId/add",
    authentication,
    authorize(Module.RENTER, Action.CREATE),
    renterValidator.renterInfo,
    handleErrors,
    RenterController.addNewRenter
);
renterRouter.get(
    "/rooms/:roomId/list",
    authentication,
    authorize(Module.RENTER, Action.READ),
    roomsValidator.roomId,
    handleErrors,
    RenterController.getRentersByRoom
);
renterRouter.get(
    "/houses/:houseId/list",
    authentication,
    authorize(Module.RENTER, Action.READ),
    houseValidator.houseIdValidator,
    handleErrors,
    RenterController.getRentersByHouse
);
renterRouter.get(
    "/:renterId/details",
    authentication,
    authorize(Module.RENTER, Action.READ),
    renterValidator.renterId,
    handleErrors,
    RenterController.getRenterDetails
);
renterRouter.put(
    "/:renterId/update",
    authentication,
    authorize(Module.RENTER, Action.UPDATE),
    renterValidator.renterInfo,
    handleErrors,
    RenterController.updateRenterDetails
);
renterRouter.patch(
    "/:renterId/change-represent",
    authentication,
    authorize(Module.RENTER, Action.UPDATE),
    renterValidator.renterId,
    handleErrors,
    RenterController.changeRepresent
);
renterRouter.delete(
    "/delete/:renterId",
    authentication,
    authorize(Module.RENTER, Action.DELETE),
    renterValidator.renterId,
    handleErrors,
    RenterController.deleteRenter
);

export default renterRouter;
