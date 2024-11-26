import { Address } from "@interfaces";
import { ContractTemplate } from "@models";
import { currentDateTime } from "@utils";
import type { ModelOptions, QueryContext } from "objection";
import { Model } from "objection";
import { v4 as uuidv4 } from "uuid";

class Users extends Model {
    id!: string;
    email!: string;
    password!: string;
    full_name!: string;
    gender!: string;
    phone_number!: string;
    address!: Address;
    birthday!: string;
    role!: string;
    type!: string;
    status!: boolean;
    verify!: boolean;
    first_login!: boolean;
    created_at!: string;
    updated_by!: string;
    updated_at!: string;
    phoneNumber: string;
    firstLogin: boolean;
    fullName: string;

    static get tableName() {
        return "users";
    }

    static get idColumn() {
        return "id";
    }

    $beforeInsert(_queryContext: QueryContext): Promise<any> | void {
        this.id = this.id || uuidv4();
    }

    $beforeUpdate(_opt: ModelOptions, _queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
    }

    $beforeDelete(_queryContext: QueryContext): Promise<any> | void {
        this.updated_at = currentDateTime();
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
                address: { type: "object" },
                birthday: { type: "string", format: "date" },
                role: { type: "string", maxLength: 10 },
                type: { type: "string", maxLength: 10 },
                status: { type: "boolean" },
                verify: { type: "boolean" },
                first_login: { type: "boolean" },
                created_at: { type: "string", format: "date-time" },
                updated_by: { type: "string", format: "uuid" },
                updated_at: { type: "string", format: "date-time" },
            },
        };
    }

    static get relationMappings() {
        return {
            template: {
                relation: Model.HasManyRelation,
                modelClass: ContractTemplate,
                join: {
                    from: "users.id",
                    to: "contract_templates.created_by",
                },
            },
        };
    }
}

export default Users;
