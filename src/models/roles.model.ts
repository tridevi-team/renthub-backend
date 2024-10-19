import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import type { Permissions } from "../interfaces";
import { currentDateTime } from "../utils/currentTime";
import { Houses, UserRoles } from "./";

class Roles extends Model {
    id: string;
    houseId: string;
    house_id: string;
    name: string;
    permissions: Permissions;
    description?: string;
    status: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    createdBy: string;

    static get tableName() {
        return "roles";
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

    static get jsonSchema() {
        return {
            type: "object",
            required: ["house_id", "name", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                permissions: { type: "object" },
                description: { type: "string" },
                status: { type: "boolean" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            house: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "roles.house_id",
                    to: "houses.id",
                },
            },
            user: {
                relation: Model.HasManyRelation,
                modelClass: UserRoles,
                join: {
                    from: "roles.id",
                    to: "user_roles.role_id",
                },
            },
        };
    }
}

export default Roles;
