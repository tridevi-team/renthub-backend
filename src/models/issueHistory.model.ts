import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";

class IssueHistory extends Model {
    id: string;

    static get tableName() {
        return "issue_history";
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
