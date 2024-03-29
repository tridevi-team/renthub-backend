"use strict";
const { Model } = require("objection");

class Equipment extends Model {
    static get tableName() {
        return "equipment";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "name", "exp_date", "created_by"],
            properties: {
                id: { type: "integer" },
                room_id: { type: "integer" },
                name: { type: "string", minLength: 1, maxLength: 50 },
                status: { type: "string", maxLength: 50 },
                exp_date: { type: "date" },
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
                    from: "equipment.created_by",
                    to: "users.id",
                },
            },

            rooms: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "equipment.room_id",
                    to: "rooms.id",
                },
            },
        };
    }
}

module.exports = Equipment;