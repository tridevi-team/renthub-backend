import { Model } from "objection";
import { Issues } from ".";

class IssueImages extends Model {
    static get tableName() {
        return "issue_images";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["issue_id", "url"],
            properties: {
                issue_id: { type: "integer" },
                url: { type: "string" },
            },
        };
    }

    static get relationMappings() {
        return {
            issue: {
                relation: Model.BelongsToOneRelation,
                modelClass: Issues,
                join: {
                    from: "issue_images.issue_id",
                    to: "issues.id",
                },
            },
        };
    }
}

export default IssueImages;
