import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";

class BillDetails extends Model {
    id: string;

    static get tableName() {
        return "bill_details";
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
            required: ["bill_id", "service_id", "old_value", "new_value", "amount", "unit_price", "total_price", "description"],
            properties: {
                id: { type: "string", format: "uuid" },
                bill_id: { type: "string", format: "uuid" },
                service_id: { type: "string", format: "uuid" },
                old_value: { type: "integer" },
                new_value: { type: "integer" },
                amount: { type: "integer" },
                unit_price: { type: "integer" },
                total_price: { type: "integer" },
                description: { type: "string" },
            },
        };
    }
}

export default BillDetails;
