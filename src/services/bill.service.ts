import { raw, TransactionOrKnex } from "objection";
import { BillStatus, EPagination, messageResponse } from "../enums";
import { BillDetailRequest, BillInfo, BillUpdate, Filter } from "../interfaces";
import { BillDetails, Bills, Houses } from "../models";
import { ApiException, camelToSnake, currentDateTime, filterHandler, sortingHandler } from "../utils";

class BillService {
    static async getById(id: string) {
        const bill = await Bills.query()
            .findById(id)
            .withGraphJoined("details(basicInfo) as services")
            .joinRelated("room(onlyName)")
            .leftJoinRelated("payment(accountNumber)")
            .select(
                "bills.id",
                "bills.room_id",
                "room.name as roomName",
                "bills.title",
                "bills.amount",
                "bills.date",
                "bills.paymentDate",
                "bills.status",
                "bills.description",
                "payment.name as accountName",
                "payment.accountNumber",
                "payment.bankName"
            );

        if (!bill) throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);

        return bill;
    }

    static async getHouseId(billId: string) {
        const bill = await Bills.query()
            .join("rooms", "bills.room_id", "rooms.id")
            .join("house_floors", "rooms.floor_id", "house_floors.id")
            .select("house_floors.house_id")
            .findById(billId);

        if (!bill) {
            throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);
        }

        return bill.houseId;
    }

    static async getRoomId(billId: string) {
        const bill = await Bills.query().findById(billId).select("room_id");
        if (!bill) {
            throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);
        }
        return bill.roomId;
    }

    static async getServicesInBill(billId: string, trx: TransactionOrKnex | undefined = undefined) {
        const bill = await BillDetails.query(trx)
            .where("bill_id", billId)
            .select("name", "unit_price", "amount", "total_price");
        if (!bill) throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);
        return bill;
    }

    static async getPayOSRequest(billId: string) {
        const bill = await Bills.query()
            .findById(billId)
            .select(raw("JSON_UNQUOTE(JSON_EXTRACT(payos_request, '$')) as payosRequest"));

        if (!bill) throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);

        return bill.payosRequest;
    }

    static async getPayOSKey(billId: string) {
        const bill = await Bills.query()
            .findById(billId)
            .joinRelated("payment")
            .select("payment.payos_client_id", "payment.payos_api_key", "payment.payos_checksum");
        if (!bill) throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);
        return bill;
    }

    static async dataListForUpdate(ids: string[]) {
        const bills = await Bills.query()
            .findByIds(ids)
            .withGraphJoined("details(updateInfo) as services")
            .select(
                "bills.id",
                "bills.room_id",
                "bills.title",
                "bills.payment_method_id",
                "bills.payment_date",
                raw("JSON_UNQUOTE(JSON_EXTRACT(bills.date, '$.from')) as startDate"),
                raw("JSON_UNQUOTE(JSON_EXTRACT(bills.date, '$.to')) as endDate"),
                "bills.status",
                "bills.description"
            );

        if (!bills) throw new ApiException(messageResponse.NO_BILLS_FOUND, 404);

        return bills;
    }

    static async search(houseId: string, filterData?: Filter) {
        const {
            filter = [],
            sort = [],
            pagination: { page = EPagination.DEFAULT_PAGE, pageSize = EPagination.DEFAULT_LIMIT } = {},
        } = filterData || {};

        let query = Houses.query()
            .join("house_floors as floors", "floors.house_id", "houses.id")
            .join("rooms", "floors.id", "rooms.floor_id")
            .join("bills", "rooms.id", "bills.room_id")
            .leftJoin("payment_methods as payment", "bills.payment_method_id", "payment.id")
            .where("houses.id", houseId)
            .select(
                "bills.id",
                "bills.room_id as room_id",
                "rooms.name as room_name",
                "bills.title",
                "bills.amount",
                raw("JSON_UNQUOTE(JSON_EXTRACT(bills.date, '$.from')) as start_date"),
                raw("JSON_UNQUOTE(JSON_EXTRACT(bills.date, '$.to')) as end_date"),
                "bills.status",
                "bills.description",
                "payment.name as account_name",
                "payment.account_number as account_number",
                "payment.bank_name as bank_name",
                "bills.created_at"
            );

        // filter
        query = filterHandler(query, filter);

        // sort
        query = sortingHandler(query, sort);

        const cloneQuery = query.clone();
        const total = await cloneQuery.resultSize();
        const totalPages = Math.ceil(total / pageSize);

        if (page === -1 && pageSize === -1) await query.page(0, total);
        else await query.page(page - 1, pageSize);

        const fetchData = await query;

        if (!total) throw new ApiException(messageResponse.NO_BILLS_FOUND, 404);

        return {
            ...fetchData,
            total,
            page,
            pageCount: totalPages,
            pageSize,
        };
    }

    static async create(data: BillInfo, trx) {
        // check bill exists in range date
        const checkBill = await Bills.query(trx)
            .where("room_id", data.roomId)
            .andWhere((builder) => {
                builder
                    .whereRaw(
                        `JSON_EXTRACT(date, '$.from') >= '${data.date.from}' AND JSON_EXTRACT(date, '$.to') <= '${data.date.to}'`
                    )
                    .orWhereRaw(
                        `JSON_EXTRACT(date, '$.from') <= '${data.date.from}' AND JSON_EXTRACT(date, '$.to') >= '${data.date.to}'`
                    );
            });

        if (checkBill.length) throw new ApiException(messageResponse.BILL_EXISTS, 409);

        // Insert the bill using the transaction
        const bill = await Bills.query(trx).insert(camelToSnake(data));

        return bill;
    }

    static async getBillDetails(billId: string, name: string) {
        const detail = await BillDetails.query().findOne(camelToSnake({ billId, name }));

        if (!detail) {
            throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);
        }

        return detail;
    }

    static async createDetails(billId: string, details: BillDetailRequest, trx) {
        // Fetch the bill within the transaction to ensure it exists
        const bill = await Bills.query(trx).findById(billId);

        if (!bill) {
            throw new ApiException(messageResponse.BILL_NOT_FOUND, 404); // Handle bill not found error
        }

        // Insert details related to the bill
        const detail = await bill.$relatedQuery("details", trx).insert(camelToSnake(details));

        return detail;
    }

    static async updateInfo(id: string, data: BillUpdate, trx: TransactionOrKnex | undefined = undefined) {
        const bill = await this.getById(id);

        const updated = bill.$query(trx).patchAndFetch(camelToSnake(data));

        return updated;
    }

    static async updateStatus(
        id: string,
        status: BillStatus,
        updatedBy: string,
        trx: TransactionOrKnex | undefined = undefined
    ) {
        const bill = await Bills.query().findById(id);
        if (!bill) {
            throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);
        }

        if (bill.status === BillStatus.PAID || bill.status === BillStatus.CANCELLED) {
            throw new ApiException(messageResponse.BILL_STATUS_PAID_OR_CANCELLED, 409);
        }

        const updated = await bill.$query(trx).patch(camelToSnake({ status, updatedBy }));
        return updated;
    }

    static async updatePayOS(orderCode, status, payosResponse, trx: TransactionOrKnex | undefined = undefined) {
        const bill = await Bills.query(trx).findOne(
            raw("JSON_UNQUOTE(JSON_EXTRACT(payos_request, '$.order_code')) = ?", orderCode)
        );

        if (!bill) {
            return null;
        }

        const updateData =
            status === BillStatus.PAID
                ? { status, payosResponse, paymentDate: currentDateTime() }
                : { status, payosResponse };

        console.log("🚀 ~ file: bill.service.ts ~ line 268 ~ BillService ~ updatePayOS ~ updateData", updateData);

        const updated = await bill.$query(trx).patch(camelToSnake(updateData));
        return updated;
    }

    static async updateDetails(data: BillDetailRequest, trx: TransactionOrKnex | undefined = undefined) {
        const details = await BillDetails.query(trx).findOne(
            camelToSnake({ billId: data.billId, serviceId: data.serviceId || null })
        );
        if (!details) {
            throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);
        }
        const updated = await details.$query(trx).patchAndFetch(camelToSnake(data));
        return updated;
    }

    static async deleteService(
        billId: string,
        key: string,
        updatedBy: string,
        trx: TransactionOrKnex | undefined = undefined
    ) {
        const details = await BillDetails.query(trx).findOne(camelToSnake({ billId, id: key }));
        if (!details) {
            throw new ApiException(messageResponse.BILL_NOT_FOUND, 404);
        }
        await details.$query(trx).patch(camelToSnake({ updatedBy }));
        await details.$query(trx).delete();
    }
}

export default BillService;
