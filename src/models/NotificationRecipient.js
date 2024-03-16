"use strict";
const { Model } = require("objection");

class NotificationRecipient extends Model {
    static get tableName() {
        return "notification_recipient";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["notification_id", "recipient_id", "status"],
            properties: {
                id: { type: "integer" },
                notification_id: { type: "integer" },
                recipient_id: { type: "integer" },
                status: { type: "string", maxLength: 10 },
            },
        };
    }

    static relationMappings() {
        const Notifications = require("./Notifications");
        const Users = require("./Users");

        return {
            notifications: {
                relation: Model.BelongsToOneRelation,
                modelClass: Notifications,
                join: {
                    from: "notification_recipient.notification_id",
                    to: "notifications.id",
                },
            },

            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "notification_recipient.recipient_id",
                    to: "users.id",
                },
            },
        };
    }
}

module.exports = NotificationRecipient;
