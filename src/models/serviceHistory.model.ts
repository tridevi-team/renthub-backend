import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";

class ServiceHistory extends Model {
    id: string;

    static get tableName() {
        return "service_history";
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
                service_id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                unit_price: { type: "integer" },
                type: { type: "string", maxLength: 10 },
                has_index: { type: "boolean" },
                description: { type: "string" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
                action: { type: "string", maxLength: 10 },
                action_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default ServiceHistory;
