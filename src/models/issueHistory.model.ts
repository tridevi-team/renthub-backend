import { Model } from "objection";

class IssueHistory extends Model {
    static get tableName() {
        return "issue_history";
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
                issue_id: { type: "string", format: "uuid" },
                equipment_id: { type: "string", format: "uuid" },
                title: { type: "string", maxLength: 255 },
                content: { type: "string" },
                status: { type: "string", maxLength: 10 },
                description: { type: "string" },
                files: { type: "json" },
                assign_to: { type: "string", format: "uuid" },
                action: { type: "string", maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default IssueHistory;
