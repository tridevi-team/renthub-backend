import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { currentDateTime } from "../utils/currentTime";
import { HouseFloors, Houses, Rooms } from "./";

class Equipment extends Model {
    id: string;
    house_id: string;
    floor_id: string;
    room_id: string;
    code: string;
    name: string;
    status: string;
    shared_type: string;
    description: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    houseId: string;
    floorId: string;
    roomId: string;

    static get tableName() {
        return "equipment";
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
            required: ["house_id", "code", "name", "status", "shared_type", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                floor_id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                code: { type: "string", maxLength: 255 },
                name: { type: "string", maxLength: 255 },
                status: { type: "string", maxLength: 255 },
                shared_type: { type: "string", maxLength: 255 },
                description: { type: "string" },
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
                    from: "equipment.house_id",
                    to: "houses.id",
                },
            },
            floor: {
                relation: Model.BelongsToOneRelation,
                modelClass: HouseFloors,
                join: {
                    from: "equipment.floor_id",
                    to: "house_floors.id",
                },
            },
            room: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "equipment.room_id",
                    to: "room.id",
                },
            },
        };
    }
}

export default Equipment;
