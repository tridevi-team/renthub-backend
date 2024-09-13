import { Model } from "objection";

class Users extends Model {
    id!: string;
    email!: string;
    password!: string;
    full_name!: string;
    gender!: string;
    phone_number!: string;
    address!: string;
    birthday!: string;
    role!: string;
    type!: string;
    status!: boolean;
    verify!: boolean;
    first_login!: boolean;
    code!: string;
    created_at!: string;

    static get tableName() {
        return "users";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["email", "password", "full_name", "gender"],
            properties: {
                id: { type: "string", format: "uuid" },
                email: { type: "string", maxLength: 50 },
                password: { type: "string", maxLength: 255 },
                full_name: { type: "string", maxLength: 50 },
                gender: { type: "string", maxLength: 6 },
                phone_number: { type: "string", maxLength: 11 },
                address: { type: "string", maxLength: 255 },
                birthday: { type: "string", format: "date" },
                role: { type: "string", maxLength: 10 },
                type: { type: "string", maxLength: 10 },
                status: { type: "boolean" },
                verify: { type: "boolean" },
                first_login: { type: "boolean" },
                code: { type: "string", maxLength: 4 },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default Users;
