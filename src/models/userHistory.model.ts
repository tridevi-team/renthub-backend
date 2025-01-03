import type { QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";

class UserHistory extends Model {
    id: string;

    static get tableName() {
        return "user_history";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(_queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [],
            properties: {
                id: { type: "string", format: "uuid" },
                user_id: { type: "string", format: "uuid" },
                email: { type: "string", maxLength: 50 },
                password: { type: "string", maxLength: 255 },
                full_name: { type: "string", maxLength: 50 },
                gender: { type: "string", maxLength: 6 },
                phone_number: { type: "string", maxLength: 11 },
                address: { type: "object" },
                birthday: { type: "string", format: "date" },
                role: { type: "string", maxLength: 10 },
                type: { type: "string", maxLength: 10 },
                status: { type: "boolean" },
                verify: { type: "boolean" },
                first_login: { type: "boolean" },
                action: { type: "string", maxLength: 10 },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
                action_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default UserHistory;
