import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";

class UserRoleHistory extends Model {
    id: string;

    static get tableName() {
        return "user_role_history";
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
            required: [],
            properties: {
                id: { type: "string", format: "uuid" },
                user_id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                role_id: { type: "string", format: "uuid" },
                action: { type: "string", maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
                action_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default UserRoleHistory;
