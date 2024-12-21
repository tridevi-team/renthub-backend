import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { Houses, Roles, Users } from "./";
import { currentDateTime } from "@utils/currentTime";

class UserRoles extends Model {
    id: string;
    user_id: string;
    house_id: string;
    role_id: string;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: string;
    userId: string;
    houseId: string;
    roleId: string;
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;

    static get tableName() {
        return "user_roles";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(_queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    $beforeUpdate(_opt: ModelOptions, _queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }

    $beforeDelete(_queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }
    static get jsonSchema() {
        return {
            type: "object",
            required: ["user_id", "house_id", "role_id", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                user_id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                role_id: { type: "string", format: "uuid" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "user_roles.user_id",
                    to: "users.id",
                },
            },
            house: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "user_roles.house_id",
                    to: "houses.id",
                },
            },
            role: {
                relation: Model.BelongsToOneRelation,
                modelClass: Roles,
                join: {
                    from: "user_roles.role_id",
                    to: "roles.id",
                },
            },
        };
    }
}

export default UserRoles;
