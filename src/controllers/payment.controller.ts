"use strict";

import { PaymentMethods } from "../models";
import { ApiException, Exception, formatJson } from "../utils";

const paymentMethodController = {
    // async createNewPaymentMethod(req, res) {
    //     try {
    //         const { houseId, fullName, accountNumber, status, description, apiKey, clientId, checksum } = req.body;
    //         const user = req.user;

    //         // check account number
    //         const accountNumberExist = await PaymentMethods.query().findOne({ account_number: accountNumber, house_id: houseId });
    //         if (accountNumberExist) {
    //             return res.json(formatJson.success(1001, "Account number already exist", null));
    //         }

    //         // create new payment method
    //         const newPaymentMethod = await PaymentMethods.query().insert({
    //             house_id: houseId,
    //             name: fullName,
    //             account_number: accountNumber,
    //             status,
    //             description,
    //             api_key: apiKey,
    //             client_id: clientId,
    //             checksum,
    //             created_by: user.id,
    //         });

    //         if (!newPaymentMethod) {
    //             throw new ApiException(1002, "Failed to create new payment method");
    //         }

    //         return res.json(formatJson.success(1003, "Create new payment method successful.", newPaymentMethod));
    //     } catch (err) {
    //         Exception.handle(err, req, res);
    //     }
    // },

    // async getPaymentMethods(req, res) {
    //     try {
    //         const { houseId } = req.params;
    //         const paymentMethods = await PaymentMethods.query().where({ house_id: houseId });
    //         return res.json(formatJson.success(1004, "Get payment methods successful.", paymentMethods));
    //     } catch (err) {
    //         Exception.handle(err, req, res);
    //     }
    // },

    // async getPaymentMethodDetail(req, res) {
    //     try {
    //         const { paymentMethodId } = req.params;
    //         const paymentMethod = await PaymentMethods.query().findById(paymentMethodId);
    //         if (!paymentMethod) {
    //             return res.json(formatJson.success(1005, "Payment method not found.", null));
    //         }

    //         return res.json(formatJson.success(1006, "Get payment method detail successful.", paymentMethod));
    //     } catch (err) {
    //         Exception.handle(err, req, res);
    //     }
    // },

    // async updatePaymentMethod(req, res) {
    //     try {
    //         const { paymentMethodId } = req.params;
    //         const { houseId, fullName, accountNumber, status, description, apiKey, clientId, checksum } = req.body;
    //         const user = req.user;

    //         // check account number
    //         const accountNumberExist = await PaymentMethods.query().findOne({ account_number: accountNumber, house_id: houseId });
    //         if (accountNumberExist && accountNumberExist.id !== parseInt(paymentMethodId)) {
    //             return res.json(formatJson.success(1001, "Account number already exist", null));
    //         }

    //         // update payment method
    //         const updatedPaymentMethod = await PaymentMethods.query().patchAndFetchById(paymentMethodId, {
    //             house_id: houseId,
    //             name: fullName,
    //             account_number: accountNumber,
    //             status,
    //             description,
    //             api_key: apiKey,
    //             client_id: clientId,
    //             checksum,
    //         });

    //         if (!updatedPaymentMethod) {
    //             throw new ApiException(1007, "Failed to update payment method");
    //         }

    //         return res.json(formatJson.success(1008, "Update payment method successful.", updatedPaymentMethod));
    //     } catch (err) {
    //         Exception.handle(err, req, res);
    //     }
    // },

    // async deletePaymentMethod(req, res) {
    //     try {
    //         const { paymentMethodId } = req.params;
    //         const deletedPaymentMethod = await PaymentMethods.query().deleteById(paymentMethodId);
    //         if (!deletedPaymentMethod) {
    //             return res.json(formatJson.success(1009, "Failed to delete payment method", null));
    //         }

    //         return res.json(formatJson.success(1010, "Delete payment method successful.", null));
    //     } catch (err) {
    //         Exception.handle(err, req, res);
    //     }
    // },
};

export default paymentMethodController;
