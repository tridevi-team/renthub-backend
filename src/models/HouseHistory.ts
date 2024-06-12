import { Model } from "objection";

import { Houses, Users } from ".";

class HouseHistory extends Model {
    static get tableName() {
        return "house_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["house_id", "name", "address", "number_of_floors", "number_of_rooms", "status", "type", "created_by"],
            properties: {
                id: { type: "integer" },
                house_id: { type: "integer" },
                name: { type: "string" },
                address: { type: "string" },
                number_of_floors: { type: "integer" },
                number_of_rooms: { type: "integer" },
                status: { type: "string" },
                type: { type: "string" },
                description: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            houses: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "house_history.house_id",
                    to: "houses.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "house_history.created_by",
                    to: "users.id",
                },
            },
        };
    }
}

export default HouseHistory;
