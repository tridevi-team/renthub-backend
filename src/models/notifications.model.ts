import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";
class Notifications extends Model {
    id: string;

    static get tableName() {
        return "notifications";
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
            required: ["title", "content", "type", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                title: { type: "string", maxLength: 255 },
                content: { type: "string" },
                type: { type: "string", maxLength: 10 },
                navigate_to: { type: "string", maxLength: 255 },
                params: { type: "json" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default Notifications;
