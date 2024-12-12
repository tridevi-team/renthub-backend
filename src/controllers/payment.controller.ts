"use strict";

import PayOS from "@payos/node";
import "dotenv/config";
import { BillStatus, messageResponse } from "../enums";
import { Bills } from "../models";
import { BillService, HouseService, PaymentService } from "../services";
import { ApiException, apiResponse, Exception, isValidData, RedisUtils, removeVietnameseTones } from "../utils";

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
        const { paymentId } = req.params;
        const cacheKey = RedisUtils.generateCacheKeyWithId(prefix, paymentId, "details");
        try {
            const isExistsCache = await RedisUtils.isExists(cacheKey);
            if (isExistsCache) {
                const data = await RedisUtils.getSetMembers(cacheKey);
                return res.json(
                    apiResponse(messageResponse.GET_PAYMENT_METHOD_DETAILS_SUCCESS, true, JSON.parse(data[0]))
                );
            }

            const paymentMethod = await PaymentService.getById(paymentId);

            // set cache
            await RedisUtils.setAddMember(cacheKey, JSON.stringify(paymentMethod));

            return res.json(apiResponse(messageResponse.GET_PAYMENT_METHOD_DETAILS_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updatePaymentMethod(req, res) {
        const { paymentId } = req.params;
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
            const paymentMethod = await PaymentService.updatePaymentMethod(paymentId, {
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
        const { paymentId } = req.params;
        const user = req.user;
        const cacheKey = `${prefix}:*`;
        try {
            await PaymentService.deletePaymentMethod(user.id, paymentId);

            // delete cache
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.DELETE_PAYMENT_METHOD_SUCCESS, true));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateStatus(req, res) {
        const { paymentId } = req.params;
        const { status } = req.body;
        const user = req.user;
        const cacheKey = `${prefix}:*`;

        try {
            const paymentMethod = await PaymentService.updateStatus(user.id, paymentId, status);

            // delete cache
            await RedisUtils.deletePattern(cacheKey);

            return res.json(apiResponse(messageResponse.UPDATE_PAYMENT_METHOD_SUCCESS, true, paymentMethod));
        } catch (err) {
            Exception.handle(err, req, res);
        }
    }

    static async updateDefault(req, res) {
        const { paymentId } = req.params;
        const { isDefault } = req.body;
        const user = req.user;
        const cacheKey = `${prefix}:*`;

        try {
            const paymentMethod = await PaymentService.updateDefault(user.id, paymentId, isDefault);

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

            // delete cache
            const cacheKey = `${prefix}:*`;
            await RedisUtils.deletePattern(cacheKey);
            await RedisUtils.deletePattern("bills:*");

            return res.json({ message: "success" });
        } catch (err) {
            await trx.rollback();
            Exception.handle(err, req, res);
        }
    }

    static async createPaymentLink(req, res) {
        const { billId } = req.body;

        try {
            const result = await Bills.query().findById(String(billId)).withGraphJoined("[details, payment, room]");
            if (!result) {
                throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);
            }

            const houseDetails = await HouseService.getHouseByRoomId(result.room.id);
            if (result && result.payment.payosClientId) {
                const payos = new PayOS(
                    result.payment.payosClientId,
                    result.payment.payosApiKey,
                    result.payment.payosChecksum
                );
                let request: {
                    order_code: string;
                    amount: number;
                    description: string;
                    items: {
                        name: string;
                        quantity: number;
                        price: number;
                    }[];
                    cancelUrl: string;
                    returnUrl: string;
                } = {
                    order_code: "",
                    amount: 0,
                    description: "",
                    items: [
                        {
                            name: "",
                            quantity: 0,
                            price: 0,
                        },
                    ],
                    cancelUrl: "",
                    returnUrl: "",
                };

                if (result.payosRequest) {
                    request =
                        typeof result.payosRequest === "string" ? JSON.parse(result.payosRequest) : result.payosRequest;
                } else {
                    const orderCode = (new Date().getTime() + Math.floor(Math.random() * 1000)).toString();

                    const services = result.details.map((service) => {
                        return {
                            name: service.name,
                            amount: service.amount,
                            price: service.totalPrice,
                        };
                    });

                    // create description less than 25 characters
                    const subDescription = removeVietnameseTones(result.room.name + " " + houseDetails.name)
                        .substring(0, 23)
                        .replace("Phong", "");

                    request = {
                        order_code: orderCode,
                        amount: 5000,
                        description: subDescription,
                        items: services,
                        cancelUrl: CANCEL_URL || "",
                        returnUrl: RETURN_URL || "",
                    };
                }

                try {
                    const payosResponse = await payos.getPaymentLinkInformation(request.order_code);

                    if (payosResponse.status === "CANCELLED")
                        throw new ApiException(messageResponse.PAYMENT_CANCELLED, 409);

                    return res.json(
                        apiResponse(messageResponse.CREATE_PAYMENT_LINK_SUCCESS, true, {
                            paymentUrl: `https://pay.payos.vn/web/${payosResponse.id}`,
                        })
                    );
                } catch (error) {
                    const orderCode = (new Date().getTime() + Math.floor(Math.random() * 1000)).toString();

                    const services = result.details.map((service) => {
                        return {
                            name: service.name,
                            quantity: service.amount,
                            price: service.totalPrice,
                        };
                    });

                    // create description less than 25 characters
                    const subDescription = removeVietnameseTones(result.room.name + " " + houseDetails.name)
                        .substring(0, 23)
                        .replace("Phong", "");

                    request = {
                        order_code: orderCode,
                        amount: 5000,
                        description: subDescription,
                        items: services,
                        cancelUrl: CANCEL_URL || "",
                        returnUrl: RETURN_URL || "",
                    };

                    await BillService.updateInfo(String(billId), {
                        payosRequest: request,
                    });

                    const data = await payos.createPaymentLink({
                        orderCode: Number(request.order_code),
                        amount: request.amount,
                        description: request.description,
                        items: request.items,
                        cancelUrl: request.cancelUrl,
                        returnUrl: request.returnUrl,
                    });

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
