import PayOS from "@payos/node";
import { Action } from "../enums";
import messageResponse from "../enums/message.enum";
import { PaymentRequest } from "../interfaces";
import { PaymentMethods, Roles } from "../models";
import { ApiException } from "../utils";
import camelToSnake from "../utils/camelToSnake";
import HouseService from "./house.service";

class PaymentService {
    static async getById(id: string) {
        const details = await PaymentMethods.query().findById(id);
        if (!details) throw new ApiException(messageResponse.PAYMENT_METHOD_NOT_FOUND, 404);
        return details;
    }

    static async getByHouse(houseId: string) {
        const paymentsList = await PaymentMethods.query().where("house_id", houseId);
        if (!paymentsList) throw new ApiException(messageResponse.PAYMENT_METHOD_NOT_FOUND, 404);
        return paymentsList;
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

    static async isAccessible(userId: string, paymentMethodId: string, action: string) {
        const paymentMethod = await PaymentMethods.query().findById(paymentMethodId);
        if (!paymentMethod) return false;

        const houseDetails = await HouseService.getHouseById(paymentMethod.houseId);

        if (houseDetails.createdBy === userId) return true;

        const roleDetails = await Roles.query()
            .joinRelated("user")
            .findOne(camelToSnake({ userId, houseId: houseDetails.id }));
        if (!roleDetails) return false;

        if (action === Action.READ)
            return (
                roleDetails.permissions.payment.create ||
                roleDetails.permissions.payment.read ||
                roleDetails.permissions.payment.update ||
                roleDetails.permissions.payment.delete
            );
        else if (action === Action.UPDATE) return roleDetails.permissions.payment.update;
        else if (action === Action.DELETE) return roleDetails.permissions.payment.delete;
        else if (action === Action.CREATE) return roleDetails.permissions.payment.create;

        return false;
    }
}

export default PaymentService;
