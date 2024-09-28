import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";
import { Houses, Rooms } from "./";

class HouseFloors extends Model {
    id: string;
    house_id: string;
    name: string;
    description: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    house: Houses;
    rooms: Rooms[];

    static get tableName() {
        return "house_floors";
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
                description: { type: "string", maxLength: 255 },
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
                    from: "house_floors.house_id",
                    to: "houses.id",
                },
            },
            rooms: {
                relation: Model.HasManyRelation,
                modelClass: Rooms,
                join: {
                    from: "house_floors.id",
                    to: "rooms.floor_id",
                },
            },
        };
    }
}

export default HouseFloors;
