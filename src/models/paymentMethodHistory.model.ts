import { Model } from "objection";

class PaymentMethodHistory extends Model {
    static get tableName() {
        return "payment_method_history";
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
                payment_method_id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                account_number: { type: "string", maxLength: 255 },
                status: { type: "boolean" },
                description: { type: "string", maxLength: 255 },
                payos_client_id: { type: "string", maxLength: 255 },
                payos_api_key: { type: "string", maxLength: 255 },
                payos_checksum: { type: "string", maxLength: 255 },
                action: { type: "string", maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default PaymentMethodHistory;
