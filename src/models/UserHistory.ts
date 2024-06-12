"use strict";
import { Model } from "objection";
import { Users } from ".";
import { accountRoles, accountTypes } from "../enum/Users";

class UserHistory extends Model {
    static get tableName() {
        return "user_history";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["email", "password", "full_name"],
            properties: {
                id: { type: "integer" },
                user_id: { type: "integer" },
                password: { type: "string", minLength: 1, maxLength: 250 },
                email: { type: "string", minLength: 1, maxLength: 50 },
                phone_number: { type: "string", minLength: 1, maxLength: 11, default: null },
                full_name: { type: "string", minLength: 1, maxLength: 50 },
                birthday: { type: "string", format: "date", default: null },
                role: { type: "string", minLength: 1, maxLength: 10, default: accountRoles.USER },
                type: { type: "string", minLength: 1, maxLength: 10, default: accountTypes.FREE },
                status: { type: "boolean", default: true },
                verify: { type: "boolean", default: false },
                created_at: { type: "string", default: new Date().toISOString() },
            },
        };
    }

    static relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "user_history.user_id",
                    to: "users.id",
                },
            },
        };
    }
}

export default UserHistory;
