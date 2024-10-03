import type { QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";

class RoomServiceHistory extends Model {
    id: string;

    static get tableName() {
        return "room_service_history";
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
            required: [],
            properties: {
                id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                service_id: { type: "string", format: "uuid" },
                quantity: { type: "integer" },
                description: { type: "string" },
                start_index: { type: "integer" },
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

export default RoomServiceHistory;
