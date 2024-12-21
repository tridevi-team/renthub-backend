import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";

class BillDetailsHistory extends Model {
    id: string;
    bill_details_id: string;
    bill_id: string;
    service_id: string;
    name: string;
    old_value: number;
    new_value: number;
    amount: number;
    unit_price: number;
    total_price: number;
    description: string;
    action: string;
    action_at: string;
    updated_at: string;

    static get tableName() {
        return "bill_details_history";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert() {
        this.id = this.id || uuidv4();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["bill_details_id", "bill_id", "amount", "unit_price", "total_price", "action"],

            properties: {
                id: { type: "string", format: "uuid" },
                bill_details_id: { type: "string", format: "uuid" },
                bill_id: { type: "string", format: "uuid" },
                service_id: { type: "string", format: "uuid" },
                name: { type: "string" },
                old_value: { type: "integer" },
                new_value: { type: "integer" },
                amount: { type: "integer" },
                unit_price: { type: "integer" },
                total_price: { type: "integer" },
                description: { type: "string" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string" },
                action: { type: "string" },
                action_at: { type: "string" },
            },
        };
    }
}

export default BillDetailsHistory;
