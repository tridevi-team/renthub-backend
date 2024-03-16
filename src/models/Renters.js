"use strict";
const { Model } = require("objection");

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
                room_id: { type: "integer" },
                created_by: { type: "integer" },
                created_date: { type: "datetime" },
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

module.exports = Renters;
