import { Model } from "objection";

class BillHistory extends Model {
    static get tableName() {
        return "bill_history";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [],
            properties: {
                id: { type: "string", format: "uuid" },
                bill_id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                payment_method_id: { type: "string", format: "uuid" },
                title: { type: "string", maxLength: 255 },
                amount: { type: "integer" },
                payment_date: { type: "string", format: "date-time" },
                status: { type: "string", maxLength: 10 },
                description: { type: "string" },
                action: { type: "string", maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default BillHistory;
