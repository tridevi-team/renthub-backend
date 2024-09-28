import { Model, ModelOptions, QueryContext } from "objection";
import { v4 as uuidv4 } from "uuid";
import { currentDateTime } from "../utils/currentTime";

class Renters extends Model {
    id: string;
    room_id: string;
    name: string;
    citizen_id: string;
    birthday: string;
    gender: "male" | "female" | "other";
    email: string;
    phone_number: string;
    address: string;
    temp_reg: boolean;
    move_in_date: string;
    represent: boolean;
    note: string;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    phoneNumber: string;
    roomId: string;

    static get tableName() {
        return "renters";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name"],
            properties: {
                id: { type: "string", format: "uuid" },
                room_id: { type: "string", format: "uuid" },
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
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default Renters;
