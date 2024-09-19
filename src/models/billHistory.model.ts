import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";

class BillHistory extends Model {
    id: string;

    static get tableName() {
        return "bill_history";
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
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
                action_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default BillHistory;
