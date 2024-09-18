import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";

class HouseHistory extends Model {
    id: string;

    static get tableName() {
        return "house_history";
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
                house_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 50 },
                address: { type: "string", maxLength: 255 },
                contract_default: { type: "integer" },
                description: { type: "string" },
                collection_cycle: { type: "integer" },
                invoice_date: { type: "integer" },
                num_collect_days: { type: "integer" },
                status: { type: "boolean" },
                action: { type: "string", maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default HouseHistory;