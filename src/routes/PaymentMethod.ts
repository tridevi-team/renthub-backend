import express from "express";
import { access, handleErrors } from "../middlewares";
import { paymentMethodValidator } from "../middlewares/validator";
import paymentMethodController from "../controllers/PaymentMethod";

const paymentMethodRouter = express.Router();

paymentMethodRouter.post("/create", access, paymentMethodValidator.createPaymentMethod, handleErrors, paymentMethodController.createNewPaymentMethod);
paymentMethodRouter.get("/list/:houseId", access, paymentMethodController.getPaymentMethods);
paymentMethodRouter.get("/details/:houseId/:paymentMethodId", access, paymentMethodController.getPaymentMethodDetail);
paymentMethodRouter.put("/update/:paymentMethodId", access, paymentMethodValidator.updatePaymentMethod, handleErrors, paymentMethodController.updatePaymentMethod);
paymentMethodRouter.delete("/delete/:paymentMethodId", access, paymentMethodController.deletePaymentMethod);

export default paymentMethodRouter;
