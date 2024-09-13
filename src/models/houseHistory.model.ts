import { Model } from "objection";

class HouseHistory extends Model {
    static get tableName() {
        return "house_history";
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
