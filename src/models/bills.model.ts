import type { QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";

class Bills extends Model {
    id: string;

    static get tableName() {
        return "bills";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(_queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "payment_method_id", "title", "amount", "payment_date", "status", "description", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                payment_method_id: { type: "string", format: "uuid" },
                title: { type: "string", maxLength: 255 },
                amount: { type: "integer" },
                payment_date: { type: "string", format: "date-time" },
                status: { type: "string", maxLength: 10 },
                description: { type: "string" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default Bills;
