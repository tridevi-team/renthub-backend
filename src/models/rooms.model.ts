import { Model, ModelOptions, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";
import { currentDateTime } from "../utils/currentTime";
import { HouseFloors, RoomImages, RoomServices } from "./";

class Rooms extends Model {
    id: string;
    floor_id: string;
    name: string;
    max_renters: number;
    room_area: number;
    price: number;
    description: string;
    status: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    houseId: string;
    services: RoomServices[];
    images: RoomImages[];
    floor: HouseFloors;
    maxRenters: number;
    roomArea: number;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;

    static get tableName() {
        return "rooms";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }

    $beforeDelete(queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["floor_id", "name", "created_by"],
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
            services: {
                relation: Model.HasManyRelation,
                modelClass: RoomServices,
                join: {
                    from: "rooms.id",
                    to: "room_services.room_id",
                },
            },
            images: {
                relation: Model.HasManyRelation,
                modelClass: RoomImages,
                join: {
                    from: "rooms.id",
                    to: "room_images.room_id",
                },
            },
        };
    }
}

export default Rooms;
