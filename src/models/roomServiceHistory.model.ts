import { Model } from "objection";

class RoomServiceHistory extends Model {
    static get tableName() {
        return "room_service_history";
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
                room_id: { type: "string", format: "uuid" },
                service_id: { type: "string", format: "uuid" },
                quantity: { type: "integer" },
                description: { type: "string" },
                start_index: { type: "integer" },
                action: { type: "string", maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default RoomServiceHistory;
