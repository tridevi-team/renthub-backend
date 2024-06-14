"use strict";
import { Model } from "objection";
import { Bills, Services, BillDetailsHistory } from ".";

class BillDetails extends Model {
    old_value: number;
    new_value: number;
    prices: number;

    static get tableName() {
        return "bill_details";
    }

    // before insert, get number of renters in room
    async $beforeInsert() {
        this.old_value = 0;
        this.new_value = 0;

        const service: any = await this.$relatedQuery("services");
        this.old_value = service.old_value;

        this.new_value = service.new_value;

        this.prices = service.unit_price * (this.new_value - this.old_value);

        return this;
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
                amount: { type: "float" },
                unit_price: { type: "float" },
                total_price: { type: "float" },
                description : { type: "string" },
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

            bill_details_history: {
                relation: Model.HasManyRelation,
                modelClass: BillDetailsHistory,
                join: {
                    from: "bill_details.id",
                    to: "bill_details_history.bill_detail_id",
                },
            },
        };
    }
}

export default BillDetails;
