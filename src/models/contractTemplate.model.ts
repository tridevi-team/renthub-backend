import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { currentDateTime } from "../utils/currentTime";

class ContractTemplate extends Model {
    id: string;
    house_id: string;
    name: string;
    content: string;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    houseId: string;
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
    updatedAt: string;

    static get tableName() {
        return "contract_template";
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
            required: ["house_id", "name", "content", "is_active", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                content: { type: "string" },
                is_active: { type: "boolean" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default ContractTemplate;
