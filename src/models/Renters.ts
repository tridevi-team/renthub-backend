"use strict";
import { Model } from "objection";
import { Users, Rooms } from ".";

class Renters extends Model {
    static get tableName() {
        return "renters";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "citizen_id", "created_by"],
            properties: {
                id: { type: "integer" },
                name: { type: "string", minLength: 1, maxLength: 50 },
                citizen_id: { type: "string", minLength: 12, maxLength: 12 },
                license_plates: { type: "string", minLength: 1, maxLength: 10 },
                room_id: { type: "integer" },
                temporary_registration: { type: "boolean" },
                move_in_date: { type: "datetime" },
                represent: { type: "boolean" },
                created_by: { type: "integer" },
                created_date: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "renters.created_by",
                    to: "users.id",
                },
            },

            rooms: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "renters.room_id",
                    to: "rooms.id",
                },
            },
        };
    }
}

export default Renters;
