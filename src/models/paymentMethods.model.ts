import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";

class PaymentMethods extends Model {
    id: string;

    static get tableName() {
        return "payment_methods";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["house_id", "name", "account_number", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                account_number: { type: "string", maxLength: 255 },
                status: { type: "boolean" },
                description: { type: "string", maxLength: 255 },
                payos_client_id: { type: "string", maxLength: 255 },
                payos_api_key: { type: "string", maxLength: 255 },
                payos_checksum: { type: "string", maxLength: 255 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default PaymentMethods;
