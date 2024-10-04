"use strict";

import messageResponse from "../enums/message.enum";
import { HouseService, PaymentService } from "../services";
import { apiResponse, Exception } from "../utils";

class PaymentController {
    static async createNewPaymentMethod(req, res) {
        const { houseId } = req.params;
        const {
            name,
            accountNumber,
            bankName,
            status,
            description,
            isDefault,
            payosClientId,
            payosApiKey,
            payosChecksum,
        } = req.body;
        const user = req.user;
        try {
            await HouseService.getHouseById(houseId);
            const paymentMethod = await PaymentService.createPaymentMethod({
                houseId,
                name,
                accountNumber,
                bankName,
                status: status,
                description: description,
                isDefault: isDefault,
                payosClientId: payosClientId,
                payosApiKey: payosApiKey,
                payosChecksum: payosChecksum,
                createdBy: user.id,
                updatedBy: user.id,
            });

            return res.json(apiResponse(messageResponse.CREATE_PAYMENT_METHOD_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getPaymentMethods(req, res) {
        const { houseId } = req.params;
        try {
            await HouseService.getHouseById(houseId);
            const paymentMethods = await PaymentService.getByHouse(houseId);
            return res.json(apiResponse(messageResponse.GET_PAYMENT_METHOD_LIST_SUCCESS, true, paymentMethods));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getPaymentMethodDetails(req, res) {
        const { paymentMethodId } = req.params;
        try {
            const paymentMethod = await PaymentService.getById(paymentMethodId);
            return res.json(apiResponse(messageResponse.GET_PAYMENT_METHOD_DETAILS_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updatePaymentMethod(req, res) {
        const { paymentMethodId } = req.params;
        const {
            houseId,
            name,
            accountNumber,
            bankName,
            status,
            description,
            isDefault,
            payosClientId,
            payosApiKey,
            payosChecksum,
        } = req.body;
        try {
            const paymentMethod = await PaymentService.updatePaymentMethod(paymentMethodId, {
                houseId,
                name,
                accountNumber,
                bankName,
                status: status,
                description: description,
                isDefault: isDefault,
                payosClientId: payosClientId,
                payosApiKey: payosApiKey,
                payosChecksum: payosChecksum,
                updatedBy: req.user.id,
            });

            return res.json(apiResponse(messageResponse.UPDATE_PAYMENT_METHOD_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deletePaymentMethod(req, res) {
        const { paymentMethodId } = req.params;
        const user = req.user;
        try {
            await PaymentService.deletePaymentMethod(user.id, paymentMethodId);
            return res.json(apiResponse(messageResponse.DELETE_PAYMENT_METHOD_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateStatus(req, res) {
        const { paymentMethodId } = req.params;
        const { status } = req.body;
        const user = req.user;
        try {
            const paymentMethod = await PaymentService.updateStatus(user.id, paymentMethodId, status);
            return res.json(apiResponse(messageResponse.UPDATE_PAYMENT_METHOD_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateDefault(req, res) {
        const { paymentMethodId } = req.params;
        const { isDefault } = req.body;
        const user = req.user;
        try {
            const paymentMethod = await PaymentService.updateDefault(user.id, paymentMethodId, isDefault);
            return res.json(apiResponse(messageResponse.UPDATE_PAYMENT_METHOD_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default PaymentController;
