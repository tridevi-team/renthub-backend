import { Model } from "objection";

class ServiceHistory extends Model {
    static get tableName() {
        return "service_history";
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
                service_id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                unit_price: { type: "integer" },
                type: { type: "string", maxLength: 10 },
                has_index: { type: "boolean" },
                description: { type: "string" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default ServiceHistory;
