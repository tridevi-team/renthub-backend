import { Model } from "objection";

class RoomContracts extends Model {
    static get tableName() {
        return "room_contracts";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [
                "room_id",
                "contract_id",
                "deposit_amount",
                "deposit_status",
                "deposit_date",
                "deposit_refund",
                "deposit_refund_date",
                "rental_start_date",
                "rental_end_date",
                "status",
                "created_by",
            ],
            properties: {
                id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                contract_id: { type: "string", format: "uuid" },
                deposit_amount: { type: "integer" },
                deposit_status: { type: "integer" },
                deposit_date: { type: "string", format: "date-time" },
                deposit_refund: { type: "integer" },
                deposit_refund_date: { type: "string", format: "date-time" },
                rental_start_date: { type: "string", format: "date-time" },
                rental_end_date: { type: "string", format: "date-time" },
                status: { type: "string", maxLength: 255 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default RoomContracts;
