import { Model } from "objection";

import { Equipment, Houses, Rooms, Users } from ".";

class EquipmentHistory extends Model {
    static get tableName() {
        return "equipment_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["equipment_id", "house_id", "name", "quantity", "status", "type", "created_by"],
            properties: {
                id: { type: "integer" },
                equipment_id: { type: "integer" },
                house_id: { type: "integer" },
                name: { type: "string" },
                quantity: { type: "integer" },
                status: { type: "string" },
                shared_type: { type: "string", maxLength: 10 },
                type: { type: "string" },
                exp_date: { type: "date" },
                description: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            equipment: {
                relation: Model.BelongsToOneRelation,
                modelClass: Equipment,
                join: {
                    from: "equipment_history.equipment_id",
                    to: "equipment.id",
                },
            },

            houses: {
                relation: Model.BelongsToOneRelation,
                modelClass: Houses,
                join: {
                    from: "equipment_history.house_id",
                    to: "houses.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "equipment_history.created_by",
                    to: "users.id",
                },
            },
        };
    }
}

export default EquipmentHistory;
