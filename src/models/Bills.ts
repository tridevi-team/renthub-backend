"use strict";
import { Model } from "objection";

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
        const Users = require("./Users");
        const Rooms = require("./Rooms");
        const PaymentMethods = require("./PaymentMethods");

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
        };
    }
}

export default Bills;
