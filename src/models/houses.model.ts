import { Model } from "objection";

class Houses extends Model {
    static get tableName() {
        return "houses";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "address", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 50 },
                address: { type: "string", maxLength: 255 },
                contract_default: { type: "integer" },
                description: { type: "string" },
                collection_cycle: { type: "integer" },
                invoice_date: { type: "integer" },
                num_collect_days: { type: "integer" },
                status: { type: "boolean" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default Houses;
