"use strict";
import { Model } from "objection";
import { Rooms, Services, RoomServiceHistory } from ".";

class RoomServices extends Model {
    static get tableName() {
        return "room_services";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "service_id"],
            properties: {
                id: { type: "integer" },
                room_id: { type: "integer" },
                service_id: { type: "integer" },
            },
        };
    }

    static relationMappings() {
        return {
            rooms: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "room_services.room_id",
                    to: "rooms.id",
                },
            },

            services: {
                relation: Model.BelongsToOneRelation,
                modelClass: Services,
                join: {
                    from: "room_services.service_id",
                    to: "services.id",
                },
            },

            room_service_history: {
                relation: Model.HasManyRelation,
                modelClass: RoomServiceHistory,
                join: {
                    from: "room_services.id",
                    to: "room_service_history.room_service_id",
                },
            },
        };
    }
}

export default RoomServices;
