import PayOS from "@payos/node";
import { raw } from "objection";
import { EPagination, messageResponse } from "../enums";
import { Filter, PaymentRequest } from "../interfaces";
import { PaymentMethods } from "../models";
import { ApiException, camelToSnake, filterHandler, sortingHandler } from "../utils";

class PaymentService {
    static async getById(id: string) {
        const details = await PaymentMethods.query().findById(id);
        if (!details) throw new ApiException(messageResponse.PAYMENT_METHOD_NOT_FOUND, 404);
        return details;
    }

    static async getDefaultPaymentMethod(houseId: string) {
        const payment = await PaymentMethods.query().where("house_id", houseId).orderBy("is_default", "desc").first();

        return payment;
    }

    static async getByHouse(houseId: string, filterData?: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_PAGE } = {},
        } = filterData || {};

        let query = PaymentMethods.query().where("house_id", houseId);

        // filter
        query = filterHandler(query, filter);

        // sort
        query = sortingHandler(query, sort);

        // clone
        const clone = query.clone();
        const total = await clone.resultSize();

        if (total === 0) throw new ApiException(messageResponse.PAYMENT_METHOD_NOT_FOUND, 404);

        const totalPages = Math.ceil(total / pageSize);

        // pagination
        if (page === -1 && pageSize === -1) await query.page(0, total);
        else await query.page(page - 1, pageSize);

        const fetchData = await query;
        return {
            ...fetchData,
            total,
            page,
            pageCount: totalPages,
            pageSize,
        };
    }

    static async createPaymentMethod(data: PaymentRequest) {
        // check name and account number in house
        const checkPaymentMethod = await PaymentMethods.query()
            .where("house_id", data.houseId)
            .where("name", data.name)
            .where("account_number", data.accountNumber)
            .where((builder) => {
                if (data.bankName) builder.where("bank_name", data.bankName);
            })
            .first();
        if (checkPaymentMethod) throw new ApiException(messageResponse.PAYMENT_METHOD_ALREADY_EXISTS, 409);

        // if isDefault is true, set all other payment methods to false
        if (data.isDefault) await PaymentMethods.query().where("house_id", data.houseId).patch({ is_default: false });

        const paymentMethod = await PaymentMethods.query().insert(camelToSnake(data));

        return paymentMethod;
    }

    static async updatePaymentMethod(id: string, data: PaymentRequest) {
        const paymentMethod = await PaymentMethods.query().findById(id);
        if (!paymentMethod) throw new ApiException(messageResponse.PAYMENT_METHOD_NOT_FOUND, 404);

        // check name and account number in house
        const checkPaymentMethod = await PaymentMethods.query()
            .where("house_id", paymentMethod.houseId)
            .where("name", data.name)
            .where("account_number", data.accountNumber)
            .where("id", "<>", id)
            .first();
        if (checkPaymentMethod) throw new ApiException(messageResponse.PAYMENT_METHOD_ALREADY_EXISTS, 400);

        await paymentMethod.$query().patch(camelToSnake(data));

        if (data.isDefault)
            await PaymentMethods.query()
                .where("house_id", paymentMethod.houseId)
                .andWhere("id", "<>", id)
                .patch({ is_default: false });

        return paymentMethod;
    }

    static async updateStatus(actionBy: string, id: string, status: boolean) {
        const paymentMethod = await PaymentMethods.query().findById(id);
        if (!paymentMethod) throw new ApiException(messageResponse.PAYMENT_METHOD_NOT_FOUND, 404);

        if (paymentMethod.status && paymentMethod.isDefault && !status)
            throw new ApiException(messageResponse.PAYMENT_METHOD_DEFAULT_STATUS, 409);

        await paymentMethod.$query().patch(camelToSnake({ status, updatedBy: actionBy }));
        return paymentMethod;
    }

    static async updateDefault(actionBy: string, id: string, isDefault: boolean) {
        const paymentMethod = await PaymentMethods.query().findById(id);
        if (!paymentMethod) throw new ApiException(messageResponse.PAYMENT_METHOD_NOT_FOUND, 404);

        await PaymentMethods.query().where("house_id", paymentMethod.houseId).patch({ is_default: false });
        await paymentMethod.$query().patch(camelToSnake({ isDefault, status: true, updatedBy: actionBy }));
        return paymentMethod;
    }

    static async deletePaymentMethod(actionBy: string, id: string) {
        const paymentMethod = await PaymentMethods.query().findById(id);
        if (!paymentMethod) throw new ApiException(messageResponse.PAYMENT_METHOD_NOT_FOUND, 404);

        if (paymentMethod.isDefault) throw new ApiException(messageResponse.PAYMENT_METHOD_DEFAULT_STATUS, 409);
        await paymentMethod.$query().patch(camelToSnake({ updatedBy: actionBy }));
        await paymentMethod.$query().deleteById(id);
        return paymentMethod;
    }

    static async createPaymentLink(paymentId: string, request) {
        const details = await this.getById(paymentId);
        if (details.payosApiKey === null || details.payosClientId === null || details.payosChecksum === null)
            return null;

        const clientId = details.payosClientId;
        const apiKey = details.payosApiKey;
        const checksum = details.payosChecksum;

        const payOs = new PayOS(clientId, apiKey, checksum);
        const paymentLink = await payOs.createPaymentLink(request);
        return paymentLink.checkoutUrl;
    }

    static async getPayOSKey(orderCode: string) {
        const info = await PaymentMethods.query()
            .joinRelated("bills")
            .findOne(raw("JSON_UNQUOTE(JSON_EXTRACT(payos_request, '$.order_code')) = ?", orderCode));
        if (!info) throw new ApiException(messageResponse.PAYMENT_METHOD_NOT_FOUND, 404);

        return {
            clientId: info.payosClientId,
            apiKey: info.payosApiKey,
            checksum: info.payosChecksum,
        };
    }
}

export default PaymentService;
