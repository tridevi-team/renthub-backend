"use strict";
import { Model } from "objection";
import { Houses, Users, Permissions, HousePermissionHistory } from ".";
class HousePermissions extends Model {
    id: Number;
    user_id: Number;
    house_id: Number;
    permission_id: Number;
    created_by: Number;
    created_at: Date;
    full_name: String;
    email: String;
    permissions: any;
    key: any;

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
                created_at: { type: "string" },
            },
        };
    }

    static relationMappings() {
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

            house_permission_history: {
                relation: Model.HasManyRelation,
                modelClass: HousePermissionHistory,
                join: {
                    from: "house_permissions.id",
                    to: "house_permission_history.house_permission_id",
                },
            },
        };
    }
}

export default HousePermissions;
