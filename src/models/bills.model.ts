import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { BillDetails, PaymentMethods, Rooms } from "./";
import { currentDateTime } from "@utils/currentTime";

class Bills extends Model {
    id: string;
    room_id: string;
    payment_method_id: string;
    title: string;
    amount: number;
    payment_date: string;
    date: {
        from: string;
        to: string;
    };
    payos_request: any;
    payos_response: any;
    status: string;
    description: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    room: Rooms;
    services: any;
    roomId: string;
    paymentMethodId: string;
    payosRequest: any;
    payosResponse: any;
    payment: PaymentMethods;
    houseId: string;
    payosClientId: string;
    payosApiKey: string;
    payosChecksum: string;

    static get tableName() {
        return "bills";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(_queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    $beforeUpdate(_opt: ModelOptions, _queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }

    $beforeDelete(_queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "title", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                payment_method_id: { type: "string", format: "uuid" },
                title: { type: "string", maxLength: 255 },
                amount: { type: "integer" },
                payment_date: { type: "string", format: "date-time" },
                date: { type: "object" },
                payos_request: { type: "object" },
                payos_response: { type: "object" },
                status: { type: "string", maxLength: 10 },
                description: { type: "string" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            room: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "bills.room_id",
                    to: "rooms.id",
                },
            },
            details: {
                relation: Model.HasManyRelation,
                modelClass: BillDetails,
                join: {
                    from: "bills.id",
                    to: "bill_details.bill_id",
                },
            },
            payment: {
                relation: Model.BelongsToOneRelation,
                modelClass: PaymentMethods,
                join: {
                    from: "bills.payment_method_id",
                    to: "payment_methods.id",
                },
            },
        };
    }

    static get modifiers() {
        return {
            billInfo(builder) {
                builder.select("id", "room_id", "title", "amount", "date", "paymentDate", "status", "description");
            },
        };
    }
}

export default Bills;
