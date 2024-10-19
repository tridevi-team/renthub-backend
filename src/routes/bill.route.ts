import express from "express";
import { BillController } from "../controllers";
import { Action, Module } from "../enums";
import { authentication, authorize, handleErrors } from "../middlewares";
import { billValidator, houseValidator } from "../middlewares/validator";

const billRouter = express.Router();

billRouter.get("/:billId/details", billValidator.billId, handleErrors, BillController.getBillDetails);

billRouter.get(
    "/:houseId/list",
    authentication,
    // authorize(Module.BILL, Action.READ),
    houseValidator.houseIdValidator,
    handleErrors,
    BillController.getBills
);

billRouter.post(
    "/list-by-ids",
    authentication,
    authorize(Module.BILL, Action.READ),
    billValidator.idsList,
    handleErrors,
    BillController.getDataForUpdate
);

billRouter.post(
    "/:houseId/create",
    authentication,
    authorize(Module.BILL, Action.CREATE),
    houseValidator.houseIdValidator,
    handleErrors,
    billValidator.createBill,
    handleErrors,
    BillController.createBill
);

billRouter.put(
    "/update",
    authentication,
    authorize(Module.BILL, Action.UPDATE),
    billValidator.updateBill,
    handleErrors,
    BillController.updateBills
);

billRouter.patch(
    "/update-status",
    authorize(Module.BILL, Action.UPDATE),
    authentication,
    billValidator.billUpdateStatus,
    handleErrors,
    BillController.updateStatus
);

billRouter.delete(
    "/delete-service",
    authentication,
    authorize(Module.BILL, Action.DELETE),
    BillController.deleteServiceInBill
);

export default billRouter;
