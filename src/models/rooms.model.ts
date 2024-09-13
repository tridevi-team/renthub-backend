import { Model } from "objection";

class Rooms extends Model {
    static get tableName() {
        return "rooms";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["floor_id", "name", "max_renters", "room_area", "price", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                floor_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                max_renters: { type: "integer" },
                room_area: { type: "integer" },
                price: { type: "integer" },
                description: { type: "string" },
                status: { type: "string", maxLength: 255 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default Rooms;
