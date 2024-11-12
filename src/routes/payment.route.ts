import express from "express";
import { PaymentController } from "../controllers";
import { Action, Module } from "../enums";
import { authentication, authorize, handleErrors } from "../middlewares";
import { houseValidator, paymentMethodValidator } from "../middlewares/validator";

const paymentMethodRouter = express.Router();

paymentMethodRouter.post(
    "/:houseId/create",
    authentication,
    authorize(Module.PAYMENT, Action.CREATE),
    houseValidator.houseIdValidator,
    handleErrors,
    paymentMethodValidator.paymentRequest,
    handleErrors,
    PaymentController.createNewPaymentMethod
);

paymentMethodRouter.get(
    "/:houseId/search",
    authentication,
    authorize(Module.PAYMENT, Action.READ),
    houseValidator.houseIdValidator,
    handleErrors,
    PaymentController.getPaymentMethods
);

paymentMethodRouter.get(
    "/:paymentMethodId/details",
    authentication,
    authorize(Module.PAYMENT, Action.READ),
    paymentMethodValidator.paymentId,
    handleErrors,
    PaymentController.getPaymentMethodDetails
);

paymentMethodRouter.put(
    "/:paymentMethodId/update",
    authentication,
    authorize(Module.PAYMENT, Action.UPDATE),
    paymentMethodValidator.paymentId,
    handleErrors,
    paymentMethodValidator.paymentRequest,
    handleErrors,
    PaymentController.updatePaymentMethod
);

paymentMethodRouter.patch(
    "/:paymentMethodId/update-status",
    authentication,
    authorize(Module.PAYMENT, Action.UPDATE),
    paymentMethodValidator.paymentId,
    handleErrors,
    paymentMethodValidator.updateStatus,
    handleErrors,
    PaymentController.updateStatus
);

paymentMethodRouter.patch(
    "/:paymentMethodId/change-default",
    authentication,
    authorize(Module.PAYMENT, Action.UPDATE),
    paymentMethodValidator.paymentId,
    handleErrors,
    paymentMethodValidator.updateDefault,
    handleErrors,
    PaymentController.updateDefault
);

paymentMethodRouter.delete(
    "/:paymentMethodId/delete",
    authentication,
    authorize(Module.PAYMENT, Action.DELETE),
    paymentMethodValidator.paymentId,
    handleErrors,
    PaymentController.deletePaymentMethod
);

paymentMethodRouter.post(
    "/create-payment-link",
    // authentication,
    // authorize(Module.PAYMENT, Action.CREATE),
    // paymentMethodValidator.paymentLinkRequest,
    // handleErrors,
    PaymentController.createPaymentLink
);

paymentMethodRouter.post("/hook", PaymentController.payOSWebhook);

export default paymentMethodRouter;
