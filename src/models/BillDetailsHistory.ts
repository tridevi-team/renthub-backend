"use strict";
import { Model } from "objection";
import { Bills, Services } from ".";

class BillDetailsHistory extends Model {
    old_value: number;
    new_value: number;
    prices: number;

    static get tableName() {
        return "bill_details_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["bill_id", "service_id", "prices", "amount"],
            properties: {
                id: { type: "integer" },
                bill_id: { type: "integer" },
                service_id: { type: "integer" },
                old_value: { type: "float" },
                new_value: { type: "float" },
                prices: { type: "float" },
            },
        };
    }

    static relationMappings() {
        return {
            bills: {
                relation: Model.BelongsToOneRelation,
                modelClass: Bills,
                join: {
                    from: "bill_details.bill_id",
                    to: "bills.id",
                },
            },

            services: {
                relation: Model.BelongsToOneRelation,
                modelClass: Services,
                join: {
                    from: "bill_details.service_id",
                    to: "services.id",
                },
            },
        };
    }
}

export default BillDetailsHistory;
