import { Model } from "objection";

import { Users, Rooms, IssueHistory, IssueImages } from ".";

class Issues extends Model {
    static get tableName() {
        return "issues";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "title", "content", "status"],
            properties: {
                id: { type: "integer" },
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
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "issues.created_by",
                    to: "users.id",
                },
            },

            rooms: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "issues.room_id",
                    to: "rooms.id",
                },
            },

            issue_history: {
                relation: Model.HasManyRelation,
                modelClass: IssueHistory,
                join: {
                    from: "issues.id",
                    to: "issue_history.issue_id",
                },
            },

            issue_images: {
                relation: Model.HasManyRelation,
                modelClass: IssueImages,
                join: {
                    from: "issues.id",
                    to: "issue_images.issue_id",
                },
            },
        };
    }
}

export default Issues;
