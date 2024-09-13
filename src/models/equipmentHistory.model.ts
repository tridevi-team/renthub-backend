import { Model } from "objection";

class EquipmentHistory extends Model {
    static get tableName() {
        return "equipment_history";
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
                equipment_id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                code: { type: "string", maxLength: 255 },
                name: { type: "string", maxLength: 255 },
                status: { type: "string", maxLength: 255 },
                shared_type: { type: "string", maxLength: 255 },
                description: { type: "string" },
                action: { type: "string", maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default EquipmentHistory;