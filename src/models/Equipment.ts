"use strict";
import { Model } from "objection";
import { Rooms, Users, EquipmentHistory } from ".";

class Equipment extends Model {
    static get tableName() {
        return "equipment";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "name", "exp_date", "created_by"],
            properties: {
                id: { type: "integer" },
                room_id: { type: "integer" },
                name: { type: "string", minLength: 1, maxLength: 50 },
                quantity: { type: "integer", default: 1 },
                status: { type: "string", maxLength: 50 },
                exp_date: { type: "date" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "equipment.created_by",
                    to: "users.id",
                },
            },

            rooms: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "equipment.room_id",
                    to: "rooms.id",
                },
            },

            equipment_history: {
                relation: Model.HasManyRelation,
                modelClass: EquipmentHistory,
                join: {
                    from: "equipment.id",
                    to: "equipment_history.equipment_id",
                },
            },
        };
    }
}

export default Equipment;
