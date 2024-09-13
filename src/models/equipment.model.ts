import { Model } from "objection";

class Equipment extends Model {
    static get tableName() {
        return "equipment";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["house_id", "room_id", "code", "name", "status", "shared_type", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                code: { type: "string", maxLength: 255 },
                name: { type: "string", maxLength: 255 },
                status: { type: "string", maxLength: 255 },
                shared_type: { type: "string", maxLength: 255 },
                description: { type: "string" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default Equipment;
