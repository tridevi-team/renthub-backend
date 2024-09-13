/**
Table: room_contract_history
Columns:
id char(36) PK
room_contract_id char(36)
room_id char(36)
contract_id char(36)
deposit_amount int UN
deposit_status int UN
deposit_date datetime
deposit_refund int UN
deposit_refund_date datetime
rental_start_date datetime
rental_end_date datetime
status varchar(255)
action varchar(10)
created_by char(36)
created_at datetime */
import { Model } from "objection";

class RoomContractHistory extends Model {
    static get tableName() {
        return "room_contract_history";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: [],
            properties: {
                id: { type: "string", format: "uuid" },
                room_contract_id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
                contract_id: { type: "string", format: "uuid" },
                deposit_amount: { type: "integer" },
                deposit_status: { type: "integer" },
                deposit_date: { type: "string", format: "date-time" },
                deposit_refund: { type: "integer" },
                deposit_refund_date: { type: "string", format: "date-time" },
                rental_start_date: { type: "string", format: "date-time" },
                rental_end_date: { type: "string", format: "date-time" },
                status: { type: "string" },
                action: { type: "string", minLength: 1, maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default RoomContractHistory;
