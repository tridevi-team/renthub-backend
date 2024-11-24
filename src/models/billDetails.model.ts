import { currentDateTime } from "@utils/currentTime";
import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import Bills from "./bills.model";

class BillDetails extends Model {
    id: string;
    bill_id: string;
    service_id: string;
    name: string;
    old_value: number;
    new_value: number;
    amount: number;
    unit_price: number;
    total_price: number;
    description: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    billId: string;
    bill: Bills;
    serviceId: string;
    oldValue: number;
    newValue: number;
    unitPrice: number;
    totalPrice: number;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;

    static get tableName() {
        return "bill_details";
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
            required: ["bill_id", "amount", "unit_price", "total_price", "description"],
            properties: {
                id: { type: "string", format: "uuid" },
                bill_id: { type: "string", format: "uuid" },
                service_id: { type: "string", format: "uuid" },
                name: { type: "string" },
                old_value: { type: "integer" },
                new_value: { type: "integer" },
                amount: { type: "integer" },
                unit_price: { type: "integer" },
                total_price: { type: "integer" },
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
            bill: {
                relation: Model.BelongsToOneRelation,
                modelClass: Bills,
                join: {
                    from: "bill_details.bill_id",
                    to: "bills.id",
                },
            },
        };
    }

    static get modifiers() {
        return {
            basicInfo(builder) {
                builder.select(
                    "service_id",
                    "name",
                    "old_value",
                    "new_value",
                    "amount",
                    "unit_price",
                    "total_price",
                    "description"
                );
            },

            updateInfo(builder) {
                builder.select("id as key", "service_id", "name", "old_value", "new_value", "unit_price");
            },
        };
    }
}

export default BillDetails;
