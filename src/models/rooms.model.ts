import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";
import HouseFloors from "./houseFloors.model";

class Rooms extends Model {
    id: string;

    static get tableName() {
        return "rooms";
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
            required: ["floor_id", "name", "max_renters", "room_area", "price", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                floor_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                max_renters: { type: "integer" },
                room_area: { type: "integer" },
                price: { type: "integer" },
                description: { type: "string" },
                status: { type: "string", maxLength: 255 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            floor: {
                relation: Model.BelongsToOneRelation,
                modelClass: HouseFloors,
                join: {
                    from: "rooms.floor_id",
                    to: "house_floors.id",
                },
            },
        };
    }
}

export default Rooms;
