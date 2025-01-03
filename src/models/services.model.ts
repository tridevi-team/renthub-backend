import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { currentDateTime } from "../utils/currentTime";
import { RoomServices } from "./";

class Services extends Model {
    id: string;
    house_id: string;
    name: string;
    unit_price: number;
    type: string;
    description: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    houseId: string;
    unitPrice: number;

    static get tableName() {
        return "services";
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
            required: ["house_id", "name", "unit_price", "type", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                unit_price: { type: "integer" },
                type: { type: "string", maxLength: 50 },
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
            roomServices: {
                relation: Model.HasManyRelation,
                modelClass: RoomServices,
                join: {
                    from: "services.id",
                    to: "room_services.service_id",
                },
            },
        };
    }
}

export default Services;
