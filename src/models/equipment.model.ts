import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";

class Equipment extends Model {
    id: string;

    static get tableName() {
        return "equipment";
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
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default Equipment;
