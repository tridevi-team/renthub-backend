/**
Table: user_roles
Columns:
id char(36) PK
user_id char(36)
house_id char(36)
role_id char(36)
created_by char(36)
created_at datetime */

import { Model } from "objection";

class UserRoles extends Model {
    static get tableName() {
        return "user_roles";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["user_id", "house_id", "role_id", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                user_id: { type: "string", format: "uuid" },
                house_id: { type: "string", format: "uuid" },
                role_id: { type: "string", format: "uuid" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default UserRoles;
