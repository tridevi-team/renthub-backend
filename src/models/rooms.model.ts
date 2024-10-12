import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { currentDateTime } from "../utils/currentTime";
import { Bills, Equipment, HouseFloors, Issues, Renters, RoomImages, RoomServices } from "./";

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
    renters: Renters[];

    static get tableName() {
        return "rooms";
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
            renters: {
                relation: Model.HasManyRelation,
                modelClass: Renters,
                join: {
                    from: "rooms.id",
                    to: "renters.room_id",
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
            equipment: {
                relation: Model.HasManyRelation,
                modelClass: Equipment,
                join: {
                    from: "rooms.id",
                    to: "equipment.room_id",
                },
            },
            issues: {
                relation: Model.HasManyRelation,
                modelClass: Issues,
                join: {
                    from: "rooms.id",
                    to: "issues.room_id",
                },
            },
            bills: {
                relation: Model.HasManyRelation,
                modelClass: Bills,
                join: {
                    from: "rooms.id",
                    to: "bills.room_id",
                },
            },
        };
    }

    static get modifiers() {
        return {
            defaultSelects(builder) {
                builder.select("id", "floor_id", "name", "max_renters", "room_area", "price", "description", "status");
            },

            onlyName(builder) {
                builder.select("name");
            },
        };
    }
}

export default Rooms;
