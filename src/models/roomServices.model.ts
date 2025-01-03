import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { Rooms, Services } from ".";
import { currentDateTime } from "../utils/currentTime";

class RoomServices extends Model {
    id: string;
    room_id: string;
    service_id: string;
    quantity: number;
    start_index: number;
    description: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    serviceId: string;
    service: Services;
    unitPrice: number;
    type: string;
    name: never;

    static get tableName() {
        return "room_services";
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
            required: ["room_id", "service_id", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                service_id: { type: "string", format: "uuid" },
                quantity: { type: "integer" },
                start_index: { type: "integer" },
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
            room: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "room_services.room_id",
                    to: "rooms.id",
                },
            },
            service: {
                relation: Model.BelongsToOneRelation,
                modelClass: Services,
                join: {
                    from: "room_services.service_id",
                    to: "services.id",
                },
            },
        };
    }

    static get modifiers() {
        return {
            basic(builder) {
                return builder
                    .join("services", "room_services.service_id", "services.id")
                    .select(
                        "services.id",
                        "services.name",
                        "services.unit_price",
                        "services.type",
                        "start_index",
                        "room_services.quantity",
                        "services.description"
                    );
            },
        };
    }
}

export default RoomServices;
