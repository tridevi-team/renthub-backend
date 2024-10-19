import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";
import { currentDateTime } from "../utils/currentTime";
import { Bills, Houses } from "./";

class PaymentMethods extends Model {
    id: string;
    house_id: string;
    name: string;
    account_number: string;
    bank_name: string;
    status: boolean;
    description: string;
    is_default: boolean;
    payos_client_id: string;
    payos_api_key: string;
    payos_checksum: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    houseId: string;
    accountNumber: string;
    bankName: string;
    isDefault: boolean;
    payosClientId: string;
    payosApiKey: string;
    payosChecksum: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;

    static get tableName() {
        return "payment_methods";
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
            required: ["house_id", "name", "account_number", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                account_number: { type: "string", maxLength: 255 },
                bank_name: { type: "string", maxLength: 255 },
                status: { type: "boolean" },
                description: { type: "string", maxLength: 255 },
                is_default: { type: "boolean" },
                payos_client_id: { type: "string", maxLength: 255 },
                payos_api_key: { type: "string", maxLength: 255 },
                payos_checksum: { type: "string", maxLength: 255 },
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
                    from: "payment_methods.house_id",
                    to: "houses.id",
                },
            },

            bills: {
                relation: Model.HasManyRelation,
                modelClass: Bills,
                join: {
                    from: "payment_methods.id",
                    to: "bills.payment_method_id",
                },
            },
        };
    }

    static get modifiers() {
        return {
            accountNumber(builder) {
                builder.select("name", "account_number", "bank_name");
            },
        };
    }
}

export default PaymentMethods;
