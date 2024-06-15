import { Model } from "objection";
import { Rooms, Equipment, Users } from ".";

class RoomEquipmentHistory extends Model {
    static get tableName() {
        return "room_equipment_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["room_id", "equipment_id", "created_by"],
            properties: {
                id: { type: "integer" },
                room_id: { type: "integer" },
                equipment_id: { type: "integer" },
                description: { type: "string" },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        return {
            rooms: {
                relation: Model.BelongsToOneRelation,
                modelClass: Rooms,
                join: {
                    from: "room_equipment_history.room_id",
                    to: "rooms.id",
                },
            },

            equipment: {
                relation: Model.BelongsToOneRelation,
                modelClass: Equipment,
                join: {
                    from: "room_equipment_history.equipment_id",
                    to: "equipment.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "room_equipment_history.created_by",
                    to: "users.id",
                },
            },
        };
    }
}

export default RoomEquipmentHistory;
