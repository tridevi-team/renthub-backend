import { Model } from "objection";

class RoomHistory extends Model {
    static get tableName() {
        return "room_history";
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
                floor_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                max_renters: { type: "integer" },
                room_area: { type: "integer" },
                price: { type: "integer" },
                description: { type: "string" },
                status: { type: "string", maxLength: 255 },
                action: { type: "string", maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default RoomHistory;