"use strict";
import { Model } from "objection";

class PaymentMethods extends Model {
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
                account_number: { type: "integer" },
                status: { type: "integer" },
                description: { type: "string", maxLength: 200 },
                api_key: { type: "string", maxLength: 100 },
                client_id: { type: "string", maxLength: 100 },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        const Users = require("./Users");
        const Houses = require("./Houses");
        const Bills = require("./Bills");

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
        };
    }
}

export default PaymentMethods;
