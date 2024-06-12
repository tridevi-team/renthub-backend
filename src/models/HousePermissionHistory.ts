import { Model } from "objection";

import { HousePermissions, Users, Houses, Permissions } from ".";

class HousePermissionHistory extends Model {
    static get tableName() {
        return "house_permission_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["house_permission_id", "user_id", "house_id", "permission_id", "type", "created_by"],
            properties: {
                id: { type: "integer" },
                house_permission_id: { type: "integer" },
                user_id: { type: "integer" },
                house_id: { type: "integer" },
                permission_id: { type: "integer" },
                type: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            house_permissions: {
                relation: Model.BelongsToOneRelation,
                modelClass: HousePermissions,
                join: {
                    from: "house_permission_history.house_permission_id",
                    to: "house_permissions.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "house_permission_history.user_id",
                    to: "users.id",
                },
            },

            houses: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "house_permission_history.house_id",
                    to: "houses.id",
                },
            },

            permissions: {
                relation: Model.BelongsToOneRelation,
                modelClass: Permissions,
                join: {
                    from: "house_permission_history.permission_id",
                    to: "permissions.id",
                },
            },
        };
    }
}

export default HousePermissionHistory;