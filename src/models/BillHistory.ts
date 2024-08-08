import { Model } from "objection";

import { Bills, Rooms, PaymentMethods, Users, BillDetails } from ".";

class BillHistory extends Model {
    static get tableName() {
        return "bill_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["bill_id", "room_id", "payment_method_id", "status", "type", "created_by"],
            properties: {
                id: { type: "integer" },
                bill_id: { type: "integer" },
                room_id: { type: "integer" },
                payment_method_id: { type: "integer" },
                status: { type: "string" },
                type: { type: "string" },
                description: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            bills: {
                relation: Model.BelongsToOneRelation,
                modelClass: Bills,
                join: {
                    from: "bill_history.bill_id",
                    to: "bills.id",
                },
            },

            rooms: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "bill_history.room_id",
                    to: "rooms.id",
                },
            },

            payment_methods: {
                relation: Model.BelongsToOneRelation,
                modelClass: PaymentMethods,
                join: {
                    from: "bill_history.payment_method_id",
                    to: "payment_methods.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "bill_history.created_by",
                    to: "users.id",
                },
            },

            bill_details: {
                relation: Model.HasManyRelation,
                modelClass: BillDetails,
                join: {
                    from: "bill_history.id",
                    to: "bill_details_history.bill_history_id",
                },
            },
        };
    }
}

export default BillHistory;