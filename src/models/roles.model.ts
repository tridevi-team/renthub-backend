import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";
import { Permissions } from "../interfaces";

class Roles extends Model {
    id: string;
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

    $beforeInsert(queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
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
}

export default Roles;
