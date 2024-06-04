"use strict";
import { Model } from "objection";

class RoomImages extends Model {
    static get tableName() {
        return "room_images";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "image_url", "created_by"],
            properties: {
                id: { type: "integer" },
                room_id: { type: "integer" },
                image_url: { type: "string", maxLength: 50 },
                created_by: { type: "integer" },
                created_date: { type: "string", format: "date-time" },
            },
        };
    }

    static relationMappings() {
        const Users = require("./Users");
        const Rooms = require("./Rooms");

        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "room_images.created_by",
                    to: "users.id",
                },
            },

            rooms: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "room_images.room_id",
                    to: "rooms.id",
                },
            },
        };
    }
}

export default RoomImages;