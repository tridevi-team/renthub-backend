import { Model } from "objection";

import { Rooms, Services, Users } from ".";

class RoomServiceHistory extends Model {
    static get tableName() {
        return "room_service_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_service_id", "room_id", "service_id", "type", "created_by"],
            properties: {
                id: { type: "integer" },
                room_service_id: { type: "integer" },
                room_id: { type: "integer" },
                service_id: { type: "integer" },
                start_index: { type: "integer" },
                type: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            rooms: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "room_service_history.room_id",
                    to: "rooms.id",
                },
            },

            services: {
                relation: Model.BelongsToOneRelation,
                modelClass: Services,
                join: {
                    from: "room_service_history.service_id",
                    to: "services.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "room_service_history.created_by",
                    to: "users.id",
                },
            },
        };
    }
}

export default RoomServiceHistory;
