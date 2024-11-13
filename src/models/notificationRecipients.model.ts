import { Model } from "objection";
import { Notifications } from "./";

class NotificationRecipients extends Model {
    notification_id!: string;
    recipient_id!: string;
    status!: string;
    count!: number;

    static get tableName() {
        return "notification_recipients";
    }

    static get idColumn() {
        return "notification_id";
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["notification_id", "recipient_id"],
            properties: {
                notification_id: { type: "string", format: "uuid" },
                recipient_id: { type: "string", format: "uuid" },
                status: { type: "string", maxLength: 10 },
            },
        };
    }

    static get relationMappings() {
        return {
            notification: {
                relation: Model.BelongsToOneRelation,
                modelClass: Notifications,
                join: {
                    from: "notification_recipients.notification_id",
                    to: "notifications.id",
                },
            },
        };
    }

    static get modifiers() {
        return {
            statusOnly(builder) {
                builder.select("status");
            },
            recipientId(builder) {
                builder.select("recipient_id");
            },
            recipientIdAndStatus(builder) {
                builder.select("recipient_id", "status");
            },
        };
    }
}

export default NotificationRecipients;
