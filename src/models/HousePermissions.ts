"use strict";
import { Model } from "objection";

class HousePermissions extends Model {
    static get tableName() {
        return "house_permissions";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["user_id", "house_id", "permission_id", "created_by"],
            properties: {
                id: { type: "integer" },
                user_id: { type: "integer" },
                house_id: { type: "integer" },
                permission_id: { type: "integer" },
                created_by: { type: "integer" },
                created_date: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        const Users = require("./Users");
        const Houses = require("./Houses");
        const Permissions = require("./Permissions");

        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "house_permissions.user_id",
                    to: "users.id",
                },
            },

            houses: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "house_permissions.house_id",
                    to: "houses.id",
                },
            },

            permissions: {
                relation: Model.BelongsToOneRelation,
                modelClass: Permissions,
                join: {
                    from: "house_permissions.permission_id",
                    to: "permissions.id",
                },
            },
        };
    }
}

export default HousePermissions;
