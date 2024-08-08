import { Model } from "objection";

import { Houses, Users } from ".";

class RoomHistory extends Model {
    static get tableName() {
        return "room_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "house_id", "name", "num_of_renters", "max_renters", "floor", "price", "type", "created_by"],
            properties: {
                id: { type: "integer" },
                room_id: { type: "integer" },
                house_id: { type: "integer" },
                name: { type: "string" },
                num_of_renters: { type: "integer" },
                max_renters: { type: "integer" },
                floor: { type: "integer" },
                square_meter: { type: "float" },
                price: { type: "float" },
                description: { type: "string" },
                status: { type: "string", maxLength: 20 },
                type: { type: "string" },
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
                    from: "room_history.house_id",
                    to: "houses.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "room_history.created_by",
                    to: "users.id",
                },
            },
        };
    }
}

export default RoomHistory;
