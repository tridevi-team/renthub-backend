"use strict";
import { Model } from "objection";
import HousePermissions from "./HousePermissions";

class Permissions extends Model {
    id: Number;
    name: String;
    key: String;

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
                key: { type: "string", minLength: 1, maxLength: 50 },
            },
        };
    }

    static relationMappings() {
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
