import { Model } from "objection";
import { Issues } from ".";

class IssueHistory extends Model {
    static get tableName() {
        return "issue_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["issue_id", "room_id", "title", "content", "status"],
            properties: {
                id: { type: "integer" },
                issue_id: { type: "integer" },
                room_id: { type: "integer" },
                title: { type: "string", maxLength: 100 },
                content: { type: "string" },
                status: { type: "string", maxLength: 10 },
                description: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static get relationMappings() {
        return {
            issues: {
                relation: Model.BelongsToOneRelation,
                modelClass: Issues,
                join: {
                    from: "issue_history.issue_id",
                    to: "issues.id",
                },
            },
        };
    }
}

export default IssueHistory;
