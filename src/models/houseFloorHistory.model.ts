import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";

class HouseFloorHistory extends Model {
    id: string;

    static get tableName() {
        return "house_floor_history";
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
            required: ["floor_id", "house_id", "name", "action", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                floor_id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                description: { type: "string", maxLength: 255 },
                action: { type: "string", maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default HouseFloorHistory;
