"use strict";
import { Model } from "objection";
import { Users, Houses, Bills, PaymentMethodHistory } from ".";

class PaymentMethods extends Model {
    id: Number;
    house_id: Number;
    name: String;
    account_number: String;
    status: Boolean;
    description: String;
    api_key: String;
    client_id: String;
    checksum: String;
    created_by: Number;
    created_at: Date;

    static get tableName() {
        return "payment_methods";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["house_id", "name", "status", "created_by"],
            properties: {
                id: { type: "integer" },
                house_id: { type: "integer" },
                name: { type: "string", minLength: 1, maxLength: 50 },
                account_number: { type: "string" },
                status: { type: "boolean" },
                description: { type: "string", maxLength: 200 },
                api_key: { type: "string" },
                client_id: { type: "string" },
                checksum: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "string" },
            },
        };
    }

    static relationMappings() {
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "payment_methods.created_by",
                    to: "users.id",
                },
            },

            houses: {
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

            payment_method_history: {
                relation: Model.HasManyRelation,
                modelClass: PaymentMethodHistory,
                join: {
                    from: "payment_methods.id",
                    to: "payment_method_history.payment_method_id",
                },
            },
        };
    }
}

export default PaymentMethods;
