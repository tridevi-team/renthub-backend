/**
Table: notifications
Columns:
id char(36) PK
title varchar(255)
content text
type varchar(10)
navigate_to varchar(255)
params json
created_by char(36)
created_at datetime */

import { Model } from "objection";

class Notifications extends Model {
    static get tableName() {
        return "notifications";
    }

    static get idColumn() {
        return "id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["title", "content", "type", "created_by"],
            properties: {
                id: { type: "string", format: "uuid" },
                title: { type: "string", maxLength: 255 },
                content: { type: "string" },
                type: { type: "string", maxLength: 10 },
                navigate_to: { type: "string", maxLength: 255 },
                params: { type: "json" },
                created_by: { type: "string", format: "uuid" },
                created_at: { type: "string", format: "date-time" },
            },
        };
    }
}

export default Notifications;