import { Model } from "objection";

import { PaymentMethods, Users } from ".";

class PaymentMethodHistory extends Model {
    static get tableName() {
        return "payment_method_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["payment_method_id", "name", "account_number", "status", "type", "created_by"],
            properties: {
                id: { type: "integer" },
                payment_method_id: { type: "integer" },
                name: { type: "string" },
                account_number: { type: "integer" },
                status: { type: "integer" },
                type: { type: "string" },
                description: { type: "string" },
                api_key: { type: "string" },
                client_ip: { type: "string" },
                checksum: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            payment_methods: {
                relation: Model.BelongsToOneRelation,
                modelClass: PaymentMethods,
                join: {
                    from: "payment_method_history.payment_method_id",
                    to: "payment_methods.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "payment_method_history.created_by",
                    to: "users.id",
                },
            },
        };
    }
}

export default PaymentMethodHistory;
