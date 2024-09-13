import { Model } from "objection";

class Issues extends Model {
    static get tableName() {
        return "issues";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["title", "content", "status", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                equipment_id: { type: "string", format: "uuid" },
                title: { type: "string", maxLength: 255 },
                content: { type: "string" },
                status: { type: "string", maxLength: 10 },
                description: { type: "string" },
                files: { type: "json" },
                assign_to: { type: "string", format: "uuid" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default Issues;
