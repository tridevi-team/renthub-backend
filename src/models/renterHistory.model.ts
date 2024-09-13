import { Model } from "objection";

class RenterHistory extends Model {
    static get tableName() {
        return "renter_history";
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
                renter_id: { type: "string", format: "uuid" },
                name: { type: "string", maxLength: 255 },
                citizen_id: { type: "string", maxLength: 255 },
                birthday: { type: "string", format: "date" },
                gender: { type: "string", maxLength: 6 },
                email: { type: "string", maxLength: 255 },
                phone_number: { type: "string", maxLength: 255 },
                address: { type: "string", maxLength: 255 },
                temp_reg: { type: "boolean" },
                move_in_date: { type: "string", format: "date" },
                represent: { type: "boolean" },
                note: { type: "string" },
                otp: { type: "string", maxLength: 6 },
                expired_otp: { type: "string", format: "date-time" },
                action: { type: "string", maxLength: 10 },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default RenterHistory;
