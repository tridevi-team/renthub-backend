"use strict";
const { Model } = require("objection");

class Houses extends Model {
    static get tableName() {
        return "houses";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "address", "number_of_floors", "number_of_rooms", "status", "created_by"],
            properties: {
                id: { type: "integer" },
                name: { type: "string", minLength: 1, maxLength: 50 },
                address: { type: "string", minLength: 1, maxLength: 50 },
                number_of_floors: { type: "integer" },
                number_of_rooms: { type: "integer" },
                status: { type: "string", minLength: 1, maxLength: 20 },
                created_by: { type: "integer" },
                created_date: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        const HousePermissions = require("./HousePermissions");
        const Users = require("./Users");

        return {
            house_permissions: {
                relation: Model.HasManyRelation,
                modelClass: HousePermissions,
                join: {
                    from: "houses.id",
                    to: "house_permissions.house_id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "houses.created_by",
                    to: "users.id",
                },
            },
        };
    }
}

module.exports = Houses;
