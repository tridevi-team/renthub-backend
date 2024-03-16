"use strict";
const { Model } = require("objection");

class Notifications extends Model {
    static get tableName() {
        return "notifications";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["content"],
            properties: {
                id: { type: "integer" },
                content: { type: "string", minLength: 1, maxLength: 255 },
                navigate: { type: "string", maxLength: 50 },
                created_by: { type: "integer" },
                created_at: { type: "datetime" },
            },
        };
    }

    static relationMappings() {
        const Users = require("./Users");
        const NotificationRecipient = require("./NotificationRecipient");

        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "notifications.created_by",
                    to: "users.id",
                },
            },

            notification_recipient: {
                relation: Model.HasManyRelation,
                modelClass: NotificationRecipient,
                join: {
                    from: "notifications.id",
                    to: "notification_recipient.notification_id",
                },
            },
        };
    }
}

module.exports = Notifications;
