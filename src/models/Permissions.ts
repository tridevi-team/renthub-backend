"use strict";
import { Model } from "objection";

class Permissions extends Model {
    static get tableName() {
        return "permissions";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name"],
            properties: {
                id: { type: "integer" },
                name: { type: "string", minLength: 1, maxLength: 50 },
            },
        };
    }

    static relationMappings() {
        const HousePermissions = require("./HousePermissions");

        return {
            house_permissions: {
                relation: Model.HasManyRelation,
                modelClass: HousePermissions,
                join: {
                    from: "permissions.id",
                    to: "house_permissions.permission_id",
                },
            },
        };
    }
}

export default Permissions;
