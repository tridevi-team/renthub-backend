import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import type { Address, Permissions } from "../interfaces";
import { currentDateTime } from "../utils/currentTime";
import { Equipment, HouseFloors, Issues } from "./";

class Houses extends Model {
    id: string;
    name: string;
    address: Address;
    contract_default: string;
    description?: string;
    collection_cycle: number;
    invoice_date: number;
    num_collect_days: number;
    status: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    createdBy: string;
    permissions: Permissions;
    floors: any;

    static get tableName() {
        return "houses";
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

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "address", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 50 },
                address: { type: "object" },
                contract_default: { type: "string" },
                description: { type: "string" },
                collection_cycle: { type: "integer" },
                invoice_date: { type: "integer" },
                num_collect_days: { type: "integer" },
                status: { type: "boolean" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            floors: {
                relation: Model.HasManyRelation,
                modelClass: HouseFloors,
                join: {
                    from: "houses.id",
                    to: "house_floors.house_id",
                },
            },
            equipment: {
                relation: Model.HasManyRelation,
                modelClass: Equipment,
                join: {
                    from: "houses.id",
                    to: "equipment.house_id",
                },
            },
            issues: {
                relation: Model.HasManyRelation,
                modelClass: Issues,
                join: {
                    from: "houses.id",
                    to: "issues.house_id",
                },
            },
        };
    }
}

export default Houses;
