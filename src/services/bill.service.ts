import { raw, TransactionOrKnex } from "objection";
import { BillStatus, messageResponse, StringOperator } from "../enums";
import { BillDetailRequest, BillFilter, BillInfo, BillUpdate, Pagination } from "../interfaces";
import { BillDetails, Bills, Houses } from "../models";
import { ApiException, camelToSnake } from "../utils";

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

    static async search(
        houseId: string,
        filter: BillFilter,
        sort: Array<string>,
        pagination: Pagination = { page: -1, limit: -1 }
    ) {
        const query = Houses.query()
            .joinRelated("floors.rooms.bills")
            .where("houses.id", houseId)
            .select("floors:rooms.name", "floors:rooms:bills.*")
            .andWhere((builder) => {
                if (filter.roomName) {
                    builder.where("name", "bill");
                }
                for (const key in filter.title) {
                    switch (key) {
                        case StringOperator.In:
                            const inValues = filter.title[key]?.split(",");
                            for (const value of inValues || []) {
                                builder.orWhereLike("title", "%" + value + "%");
                            }
                            break;
                        case StringOperator.Equals:
                            if (filter.title[key]) builder.where("title", filter.title[key]);
                            break;
                        case StringOperator.NotEquals:
                            if (filter.title[key]) builder.where("title", "<>", filter.title[key]);
                            break;
                        case StringOperator.Contains:
                            if (filter.title[key]) builder.where("title", "like", `%${filter.title[key]}%`);
                            break;
                        case StringOperator.DoesNotContain:
                            if (filter.title[key]) builder.where("title", "not like", `%${filter.title[key]}%`);
                            break;
                        case StringOperator.StartsWith:
                            if (filter.title[key]) builder.where("title", "like", `${filter.title[key]}%`);
                            break;
                        case StringOperator.EndsWith:
                            if (filter.title[key]) builder.where("title", "like", `%${filter.title[key]}`);
                            break;
                        case StringOperator.Matches:
                            if (filter.title[key]) builder.where("title", "regexp", filter.title[key]);
                            break;
                        case StringOperator.DoesNotMatch:
                            if (filter.title[key]) builder.where("title", "not regexp", filter.title[key]);
                            break;
                        default:
                            break;
                    }
                }
            });

        let page = 0;
        let limit = await query.resultSize();

        if (pagination.page !== -1) {
            page = pagination.page - 1;
            limit = pagination.limit;
        }

        // sort
        sort.forEach((item) => {
            if (item.startsWith("-")) {
                query.orderBy(`floors:rooms:bills.${item.slice(1)}`, "desc");
            } else {
                query.orderBy(item, "asc");
            }
        });

        const results = await query.page(page, limit).orderBy("floors:rooms:bills.created_at", "asc");
        if (!results) throw new ApiException(messageResponse.NO_BILLS_FOUND, 404);

        return results;
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

        const updated = await bill.$query(trx).patch(camelToSnake({ status, payosResponse }));
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
