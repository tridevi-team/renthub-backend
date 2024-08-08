"use strict";
import { Model } from "objection";
import { Users, Rooms, PaymentMethods, BillHistory } from ".";

class Bills extends Model {
    static get tableName() {
        return "bills";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "payment_method_id", "status", "created_by"],
            properties: {
                id: { type: "integer" },
                room_id: { type: "integer" },
                payment_method_id: { type: "integer" },
                status: { type: "string", maxLength: 50 },
                created_by: { type: "integer" },
                created_date: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "bills.created_by",
                    to: "users.id",
                },
            },

            rooms: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "bills.room_id",
                    to: "rooms.id",
                },
            },

            payment_methods: {
                relation: Model.BelongsToOneRelation,
                modelClass: PaymentMethods,
                join: {
                    from: "bills.payment_method_id",
                    to: "payment_methods.id",
                },
            },

            bill_history: {
                relation: Model.HasManyRelation,
                modelClass: BillHistory,
                join: {
                    from: "bills.id",
                    to: "bill_history.bill_id",
                },
            },
        };
    }
}

export default Bills;
