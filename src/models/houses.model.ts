import { Model, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";
import HouseFloors from "./houseFloors.model";

class Houses extends Model {
    id: string;
    name: string;
    address: string;
    contract_default: string;
    description?: string;
    collection_cycle: number;
    invoice_date: number;
    num_collect_days: number;
    status: boolean;
    created_by: string;
    created_at: string;
    createdBy: string;
    permissions: object;

    static get tableName() {
        return "houses";
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
            required: ["name", "address", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 50 },
                address: { type: "string", maxLength: 255 },
                contract_default: { type: "string" },
                description: { type: "string" },
                collection_cycle: { type: "integer" },
                invoice_date: { type: "integer" },
                num_collect_days: { type: "integer" },
                status: { type: "boolean" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
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
        };
    }
}

export default Houses;
