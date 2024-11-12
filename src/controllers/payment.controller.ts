"use strict";

import PayOS from "@payos/node";
import "dotenv/config";
import { BillStatus, messageResponse } from "../enums";
import { Bills } from "../models";
import { BillService, HouseService, PaymentService } from "../services";
import { ApiException, apiResponse, Exception, isValidData, RedisUtils } from "../utils";

const HOOK_URL = process.env.WEBHOOK_URL || "";
const { RETURN_URL, CANCEL_URL } = process.env;
const prefix = "paymentMethods";
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

            if (payosApiKey && payosClientId && payosChecksum) {
                const payos = new PayOS(payosClientId, payosApiKey, payosChecksum);
                await payos.confirmWebhook(HOOK_URL);
            }

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.CREATE_PAYMENT_METHOD_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getPaymentMethods(req, res) {
        const { houseId } = req.params;
        const { filter = [], sort = [], pagination } = req.query;
        const cacheKey = RedisUtils.generateCacheKeyWithFilter(prefix + ":search", {
            filter,
            sort,
            pagination,
        });
        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const data = await RedisUtils.getSetMembers(cacheKey);
                return res.json(
                    apiResponse(messageResponse.GET_PAYMENT_METHOD_LIST_SUCCESS, true, JSON.parse(data[0]))
                );
            }

            await HouseService.getHouseById(houseId);
            const paymentMethods = await PaymentService.getByHouse(houseId, {
                filter,
                sort,
                pagination,
            });

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(paymentMethods));

            return res.json(apiResponse(messageResponse.GET_PAYMENT_METHOD_LIST_SUCCESS, true, paymentMethods));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async getPaymentMethodDetails(req, res) {
        const { paymentMethodId } = req.params;
        const cacheKey = RedisUtils.generateCacheKeyWithId(prefix, paymentMethodId, "details");
        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const data = await RedisUtils.getSetMembers(cacheKey);
                return res.json(
                    apiResponse(messageResponse.GET_PAYMENT_METHOD_DETAILS_SUCCESS, true, JSON.parse(data[0]))
                );
            }

            const paymentMethod = await PaymentService.getById(paymentMethodId);

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(paymentMethod));

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

            if (payosApiKey && payosClientId && payosChecksum) {
                const payos = new PayOS(payosClientId, payosApiKey, payosChecksum);

                await payos.confirmWebhook(HOOK_URL);
            }

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.UPDATE_PAYMENT_METHOD_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async deletePaymentMethod(req, res) {
        const { paymentMethodId } = req.params;
        const user = req.user;
        const cacheKey = `${prefix}:*`;
        try {
            await PaymentService.deletePaymentMethod(user.id, paymentMethodId);

            // delete cache
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.DELETE_PAYMENT_METHOD_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateStatus(req, res) {
        const { paymentMethodId } = req.params;
        const { status } = req.body;
        const user = req.user;
        const cacheKey = `${prefix}:*`;

        try {
            const paymentMethod = await PaymentService.updateStatus(user.id, paymentMethodId, status);

            // delete cache
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.UPDATE_PAYMENT_METHOD_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateDefault(req, res) {
        const { paymentMethodId } = req.params;
        const { isDefault } = req.body;
        const user = req.user;
        const cacheKey = `${prefix}:*`;

        try {
            const paymentMethod = await PaymentService.updateDefault(user.id, paymentMethodId, isDefault);

            // delete cache
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.UPDATE_PAYMENT_METHOD_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async payOSWebhook(req, res) {
        const webhookData = req.body;

        const { orderCode, description, accountNumber, code, desc } = req.body.data;

        if (orderCode === 123 && description === "VQRIO123" && accountNumber === "12345678") {
            return res.json({ message: "success" });
        }

        const trx = await Bills.startTransaction();

        try {
            const payosKeys = await PaymentService.getPayOSKey(webhookData.data.orderCode);

            const checksumKey = payosKeys?.checksum || "";

            const isValid = isValidData(webhookData.data, webhookData.signature, checksumKey);
            if (!isValid) {
                await BillService.updatePayOS(webhookData.data.orderCode, BillStatus.UNPAID, webhookData, trx);
            } else if (code === "00" && desc === "success") {
                await BillService.updatePayOS(webhookData.data.orderCode, BillStatus.PAID, webhookData, trx);
            } else {
                await BillService.updatePayOS(webhookData.data.orderCode, BillStatus.UNPAID, webhookData, trx);
            }
            await trx.commit();
            return res.json({ message: "success" });
        } catch (err) {
            await trx.rollback();
            Exception.handle(err, req, res);
        }
    }

    static async createPaymentLink(req, res) {
        const { billId } = req.body;

        try {
            const result = await Bills.query().findById(String(billId)).withGraphJoined("[details, payment]");

            if (result && result.payment.payosClientId) {
                const payos = new PayOS(
                    result.payment.payosClientId,
                    result.payment.payosApiKey,
                    result.payment.payosChecksum
                );
                const parsedRequest = JSON.parse(result.payosRequest);

                try {
                    const payosResponse = await payos.getPaymentLinkInformation(parsedRequest.order_code);

                    if (payosResponse.status === "CANCELLED")
                        throw new ApiException(messageResponse.PAYMENT_CANCELLED, 409);

                    return res.json(
                        apiResponse(messageResponse.CREATE_PAYMENT_LINK_SUCCESS, true, {
                            paymentUrl: `https://pay.payos.vn/web/${payosResponse.id}`,
                        })
                    );
                } catch (error) {
                    const orderCode = Math.floor(Math.random() * 1000000000);
                    await BillService.updateInfo(String(billId), {
                        payosRequest: {
                            ...parsedRequest,
                            order_code: orderCode,
                        },
                    });

                    const checkoutRequest = {
                        orderCode: orderCode,
                        amount: 5000,
                        description: parsedRequest?.description || "Thanh toán hóa đơn",
                        cancelUrl: parsedRequest.cancel_url || CANCEL_URL,
                        returnUrl: parsedRequest.return_url || RETURN_URL,
                    };

                    const data = await payos.createPaymentLink(checkoutRequest);

                    return res.json(
                        apiResponse(messageResponse.GET_PAYMENT_LINK_SUCCESS, true, {
                            paymentUrl: data.checkoutUrl,
                        })
                    );
                }
            }
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }
}

export default PaymentController;
