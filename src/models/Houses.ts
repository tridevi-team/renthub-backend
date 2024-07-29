"use strict";
import { Model } from "objection";
import { HouseStatus } from "../enum";
import { Users, HousePermissions, Rooms } from ".";

class Houses extends Model {
    id: Number;
    name: String;
    address: String;
    number_of_floors: Number;
    number_of_rooms: Number;
    contract_default: Number;
    status: Boolean;
    description: String;
    created_by: Number;
    created_at: Date;

    static get tableName() {
        return "houses";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "address", "number_of_floors", "status", "created_by"],
            properties: {
                id: { type: "integer" },
                name: { type: "string", minLength: 1, maxLength: 50 },
                address: { type: "string", minLength: 1, maxLength: 50 },
                number_of_floors: { type: "integer" },
                number_of_rooms: { type: "integer", default: 0 },
                contract_default: { type: "integer" },
                status: { type: "string", minLength: 1, maxLength: 20, default: HouseStatus.AVAILABLE.toString() },
                description: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            house_permissions: {
                relation: Model.HasManyRelation,
                modelClass: HousePermissions,
                join: {
                    from: "houses.id",
                    to: "house_permissions.house_id",
                },
            },

            rooms: {
                relation: Model.HasManyRelation,
                modelClass: Rooms,
                join: {
                    from: "houses.id",
                    to: "rooms.house_id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "houses.created_by",
                    to: "users.id",
                },
            },
        };
    }
}

export default Houses;
