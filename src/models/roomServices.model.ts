import { Model } from "objection";

class RoomServices extends Model {
    static get tableName() {
        return "room_services";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "service_id", "quantity", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                service_id: { type: "string", format: "uuid" },
                quantity: { type: "integer" },
                start_index: { type: "integer" },
                description: { type: "string" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default RoomServices;
