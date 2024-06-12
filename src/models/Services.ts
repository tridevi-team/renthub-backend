"use strict";
import { Model } from "objection";
import { Users, Houses } from ".";

class Services extends Model {
    static get tableName() {
        return "services";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "house_id", "unit_price", "type", "created_by"],
            properties: {
                id: { type: "integer" },
                house_id: { type: "integer" },
                name: { type: "string", minLength: 1, maxLength: 50 },
                unit_price: { type: "number" },
                type: { type: "string", minLength: 1, maxLength: 10 },
                rules: { type: "string", nullable: true },
                created_by: { type: "integer" },
                created_date: { type: "string", format: "date-time" },
            },
        };
    }

    static relationMappings() {
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "services.created_by",
                    to: "users.id",
                },
            },

            houses: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "services.house_id",
                    to: "houses.id",
                },
            },
        };
    }
}

export default Services;
